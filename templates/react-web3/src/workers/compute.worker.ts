/**
 * 计算密集型任务 Worker
 *
 * 支持的任务类型：
 * - fibonacci: 计算斐波那契数列
 * - primeCount: 统计质数数量
 * - sort: 大数组排序
 * - matrixMultiply: 矩阵乘法
 */

// 引入 WebWorker 类型定义
/// <reference lib="webworker" />

// 声明为模块，避免全局污染
export {};

// ============ 消息类型定义 ============
interface WorkerMessage {
  id: string;
  type:
    | "fibonacci"
    | "primeCount"
    | "sort"
    | "matrixMultiply";
  payload: unknown;
}

interface WorkerResult {
  id: string;
  type: string;
  success: boolean;
  result?: unknown;
  error?: string;
  duration: number;
}

// ============ 计算任务实现 ============

/**
 * 斐波那契数列（递归，故意慢）
 */
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * 统计 n 以内的质数数量
 */
function countPrimes(n: number): number {
  if (n < 2) return 0;

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return isPrime.filter(Boolean).length;
}

/**
 * 大数组排序
 */
function sortArray(data: number[]): number[] {
  // 使用快速排序
  return [...data].sort((a, b) => a - b);
}

/**
 * 矩阵乘法
 */
function matrixMultiply(
  a: number[][],
  b: number[][]
): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const common = b.length;

  const result: number[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < common; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

// ============ 消息处理 ============
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;
  const startTime = performance.now();

  let result: unknown;
  let error: string | undefined;
  let success = true;

  try {
    switch (type) {
      case "fibonacci":
        result = fibonacci(payload as number);
        break;

      case "primeCount":
        result = countPrimes(payload as number);
        break;

      case "sort":
        result = sortArray(payload as number[]);
        break;

      case "matrixMultiply": {
        const { a, b } = payload as {
          a: number[][];
          b: number[][];
        };
        result = matrixMultiply(a, b);
        break;
      }

      default:
        throw new Error(`未知的任务类型: ${type}`);
    }
  } catch (e) {
    success = false;
    error = e instanceof Error ? e.message : String(e);
  }

  const duration = performance.now() - startTime;

  // 发送结果回主线程
  const response: WorkerResult = {
    id,
    type,
    success,
    result,
    error,
    duration,
  };

  self.postMessage(response);
};

// Worker 错误处理
self.onerror = (event: string | Event) => {
  console.error("[Worker] 发生错误:", event);
};

// 通知主线程 Worker 已就绪
self.postMessage({ type: "ready" });
