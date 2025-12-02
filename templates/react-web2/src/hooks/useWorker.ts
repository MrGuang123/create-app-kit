import {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";

// ============ 类型定义 ============

type TaskType =
  | "fibonacci"
  | "primeCount"
  | "sort"
  | "matrixMultiply";

interface WorkerTask<T = unknown> {
  id: string;
  type: TaskType;
  payload: T;
}

interface WorkerResult<T = unknown> {
  id: string;
  type: string;
  success: boolean;
  result?: T;
  error?: string;
  duration: number;
}

interface PendingTask {
  resolve: (value: WorkerResult) => void;
  reject: (reason: Error) => void;
}

interface UseWorkerReturn {
  /** Worker 是否就绪 */
  isReady: boolean;
  /** 是否正在执行任务 */
  isLoading: boolean;
  /** 待处理任务数量 */
  pendingCount: number;
  /** 执行任务 */
  execute: <T, R>(
    type: TaskType,
    payload: T
  ) => Promise<WorkerResult<R>>;
  /** 终止 Worker */
  terminate: () => void;
}

// ============ 生成唯一 ID ============

let taskIdCounter = 0;
const generateTaskId = () =>
  `task-${Date.now()}-${++taskIdCounter}`;

// ============ Hook 实现 ============

/**
 * Web Worker Hook
 *
 * @example
 * ```tsx
 * const { isReady, isLoading, execute } = useWorker();
 *
 * const handleCalculate = async () => {
 *   const result = await execute<number, number>('fibonacci', 40);
 *   console.log(result);
 * };
 * ```
 */
/**
 * Webpack 5 会自动识别这种 new URL(..., import.meta.url) + new Worker() 的组合，并且：
 * 自动将 compute.worker.ts 打包为独立的 chunk
 * 自动处理 TypeScript 编译（因为你已经配置了 swc-loader 处理 .ts 文件）
 * 自动生成正确的 Worker 文件路径，所以无需安装worker-loader或者其它插件了
 */
export function useWorker(): UseWorkerReturn {
  const workerRef = useRef<Worker | null>(null);
  const pendingTasksRef = useRef<Map<string, PendingTask>>(
    new Map()
  );

  const [isReady, setIsReady] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 初始化 Worker
  useEffect(() => {
    // 创建 Worker 实例
    const worker = new Worker(
      /* webpackChunkName: "compute-worker" */
      new URL(
        "../workers/compute.worker.ts",
        import.meta.url
      ),
      { type: "module" }
    );

    // 消息处理
    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;

      // Worker 就绪消息
      if (data.type === "ready") {
        setIsReady(true);
        return;
      }

      // 任务结果消息
      const result = data as WorkerResult;
      const pending = pendingTasksRef.current.get(
        result.id
      );

      if (pending) {
        pending.resolve(result);
        pendingTasksRef.current.delete(result.id);
        setPendingCount(pendingTasksRef.current.size);
      }
    };

    // 错误处理
    worker.onerror = (error) => {
      console.error("[useWorker] Worker 错误:", error);

      // 拒绝所有待处理的任务
      pendingTasksRef.current.forEach((pending) => {
        pending.reject(new Error("Worker 发生错误"));
      });
      pendingTasksRef.current.clear();
      setPendingCount(0);
    };

    workerRef.current = worker;

    // 清理
    return () => {
      worker.terminate();
      workerRef.current = null;
      setIsReady(false);
    };
  }, []);

  // 执行任务
  const execute = useCallback(
    <T, R>(
      type: TaskType,
      payload: T
    ): Promise<WorkerResult<R>> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker 未初始化"));
          return;
        }

        const id = generateTaskId();
        const task: WorkerTask<T> = { id, type, payload };

        // 存储 Promise 回调
        pendingTasksRef.current.set(id, {
          resolve: resolve as (value: WorkerResult) => void,
          reject,
        });
        setPendingCount(pendingTasksRef.current.size);

        // 发送任务给 Worker
        workerRef.current.postMessage(task);
      });
    },
    []
  );

  // 终止 Worker
  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsReady(false);

      // 拒绝所有待处理的任务
      pendingTasksRef.current.forEach((pending) => {
        pending.reject(new Error("Worker 已终止"));
      });
      pendingTasksRef.current.clear();
      setPendingCount(0);
    }
  }, []);

  return {
    isReady,
    isLoading: pendingCount > 0,
    pendingCount,
    execute,
    terminate,
  };
}
