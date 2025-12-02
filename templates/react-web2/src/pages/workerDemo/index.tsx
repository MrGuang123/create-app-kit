import { useState, useCallback } from "react";
import { useWorker } from "@/hooks/useWorker";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Cpu, Zap, Loader2 } from "lucide-react";
import TaskResult from "./TaskResult";

export default function WorkerDemo() {
  const { isReady, isLoading, pendingCount, execute } =
    useWorker();

  // 斐波那契
  const [fibInput, setFibInput] = useState("40");
  const [fibResult, setFibResult] = useState<{
    result?: number;
    duration?: number;
    error?: string;
    success?: boolean;
  } | null>(null);

  // 质数统计
  const [primeInput, setPrimeInput] = useState("1000000");
  const [primeResult, setPrimeResult] = useState<{
    result?: number;
    duration?: number;
    error?: string;
    success?: boolean;
  } | null>(null);

  // 数组排序
  const [sortSize, setSortSize] = useState("100000");
  const [sortResult, setSortResult] = useState<{
    result?: number[];
    duration?: number;
    error?: string;
    success?: boolean;
  } | null>(null);

  // 主线程对比
  const [mainThreadTime, setMainThreadTime] = useState<
    number | null
  >(null);

  // 任务执行
  const runFibonacci = useCallback(async () => {
    const n = parseInt(fibInput);
    if (isNaN(n) || n < 0) return;

    setFibResult(null);
    const result = await execute<number, number>(
      "fibonacci",
      n
    );
    setFibResult({
      result: result.result,
      duration: result.duration,
      error: result.error,
      success: result.success,
    });
  }, [fibInput, execute]);

  const runPrimeCount = useCallback(async () => {
    const n = parseInt(primeInput);
    if (isNaN(n) || n < 0) return;

    setPrimeResult(null);
    const result = await execute<number, number>(
      "primeCount",
      n
    );
    setPrimeResult({
      result: result.result,
      duration: result.duration,
      error: result.error,
      success: result.success,
    });
  }, [primeInput, execute]);

  const runSort = useCallback(async () => {
    const size = parseInt(sortSize);
    if (isNaN(size) || size <= 0) return;

    // 生成随机数组
    const randomArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 1000000)
    );

    setSortResult(null);
    const result = await execute<number[], number[]>(
      "sort",
      randomArray
    );
    setSortResult({
      result: result.result?.slice(0, 10), // 只显示前 10 个
      duration: result.duration,
      error: result.error,
      success: result.success,
    });
  }, [sortSize, execute]);

  // 主线程斐波那契（对比用，演示用）
  const runMainThreadFib = useCallback(() => {
    const n = parseInt(fibInput);
    if (isNaN(n) || n < 0 || n > 45) {
      alert("主线程计算请使用 45 以下的数字，否则会卡住！");
      return;
    }

    const start = performance.now();

    // 在主线程执行（会阻塞 UI）
    const fib = (x: number): number => {
      if (x <= 1) return x;
      return fib(x - 1) + fib(x - 2);
    };
    fib(n);

    setMainThreadTime(performance.now() - start);
  }, [fibInput]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" />
          Web Worker Demo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          将计算密集型任务放到后台线程，避免阻塞 UI
        </p>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isReady ? "bg-primary" : "bg-muted-foreground"
            }`}
          />
          <span className="text-sm text-foreground">
            Worker 状态: {isReady ? "就绪" : "初始化中..."}
          </span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            执行中 ({pendingCount} 个任务)
          </div>
        )}
      </div>

      <div className="p-4 bg-primary/10 rounded-lg">
        <h3 className="font-medium mb-2 text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4" />
          优势演示
        </h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>✅ 计算在后台线程执行，UI 保持流畅响应</li>
          <li>✅ 支持多个任务并行执行（Promise 接口）</li>
          <li>✅ 自动管理 Worker 生命周期</li>
          <li>✅ TypeScript 类型安全</li>
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-card p-4 ring-1 ring-border space-y-4">
          <h3 className="font-semibold text-foreground">
            🔢 斐波那契数列
          </h3>
          <p className="text-xs text-muted-foreground">
            递归计算（故意慢，演示用）
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={fibInput}
              onChange={(e) => setFibInput(e.target.value)}
              placeholder="输入 n"
              className="w-24"
            />
            <Button
              onClick={runFibonacci}
              disabled={!isReady || isLoading}
            >
              Worker 计算
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runMainThreadFib}
          >
            主线程计算（会卡）
          </Button>
          {mainThreadTime !== null && (
            <p className="text-xs text-muted-foreground">
              主线程耗时: {mainThreadTime.toFixed(2)} ms
            </p>
          )}
          {fibResult && (
            <TaskResult
              title={`Fibonacci(${fibInput})`}
              {...fibResult}
            />
          )}
        </div>

        <div className="rounded-lg bg-card p-4 ring-1 ring-border space-y-4">
          <h3 className="font-semibold text-foreground">
            🔍 质数统计
          </h3>
          <p className="text-xs text-muted-foreground">
            统计 n 以内的质数数量（埃氏筛法）
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={primeInput}
              onChange={(e) =>
                setPrimeInput(e.target.value)
              }
              placeholder="输入 n"
              className="w-32"
            />
            <Button
              onClick={runPrimeCount}
              disabled={!isReady || isLoading}
            >
              计算
            </Button>
          </div>
          {primeResult && (
            <TaskResult
              title={`${primeInput} 以内的质数`}
              {...primeResult}
            />
          )}
        </div>

        <div className="rounded-lg bg-card p-4 ring-1 ring-border space-y-4">
          <h3 className="font-semibold text-foreground">
            📊 大数组排序
          </h3>
          <p className="text-xs text-muted-foreground">
            随机生成数组并排序
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={sortSize}
              onChange={(e) => setSortSize(e.target.value)}
              placeholder="数组大小"
              className="w-32"
            />
            <Button
              onClick={runSort}
              disabled={!isReady || isLoading}
            >
              排序
            </Button>
          </div>
          {sortResult && (
            <TaskResult
              title={`排序 ${sortSize} 个元素`}
              result={sortResult.result}
              duration={sortResult.duration}
              error={sortResult.error}
              success={sortResult.success}
            />
          )}
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2 text-foreground">
          📝 使用方法
        </h3>
        <pre className="text-xs text-primary overflow-x-auto p-3 bg-card rounded border border-border">
          {`import { useWorker } from '@/hooks/useWorker';

function MyComponent() {
  const { isReady, execute } = useWorker();

  const handleCalculate = async () => {
    const result = await execute('fibonacci', 40);
    console.log(result.result, result.duration);
  };

  return (
    <button onClick={handleCalculate} disabled={!isReady}>
      计算
    </button>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
