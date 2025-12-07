import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  loadWasm,
  isWasmLoaded,
  type WasmExports,
} from "@/wasm";

// ==================== 性能测试结果类型 ====================
interface BenchmarkResult {
  name: string;
  jsTime: number;
  wasmTime: number;
  speedup: number;
  jsResult: string;
  wasmResult: string;
}

// ==================== JS 版本的计算函数 ====================
const jsFibonacciRecursive = (n: number): bigint => {
  if (n <= 1) return BigInt(n);
  return (
    jsFibonacciRecursive(n - 1) +
    jsFibonacciRecursive(n - 2)
  );
};

const jsFibonacciIterative = (n: number): bigint => {
  if (n <= 1) return BigInt(n);
  let a = 0n;
  let b = 1n;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

const jsIsPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const sqrt = Math.sqrt(n);
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const jsCountPrimes = (max: number): number => {
  let count = 0;
  for (let i = 2; i <= max; i++) {
    if (jsIsPrime(i)) count++;
  }
  return count;
};

const jsGetNthPrime = (n: number): number => {
  if (n <= 0) return 0;
  let count = 0;
  let num = 2;
  while (count < n) {
    if (jsIsPrime(num)) count++;
    if (count < n) num++;
  }
  return num;
};

// ==================== 结果卡片组件 ====================
function ResultCard({
  result,
}: {
  result: BenchmarkResult;
}) {
  const speedupColor =
    result.speedup > 2
      ? "text-green-500"
      : result.speedup > 1
      ? "text-blue-500"
      : "text-orange-500";

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h4 className="font-semibold text-foreground mb-3">
        {result.name}
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-muted-foreground">
            JavaScript
          </div>
          <div className="font-mono text-foreground">
            {result.jsTime.toFixed(2)}ms
          </div>
          <div className="text-xs text-muted-foreground truncate">
            结果: {result.jsResult}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">
            Rust WASM
          </div>
          <div className="font-mono text-primary">
            {result.wasmTime.toFixed(2)}ms
          </div>
          <div className="text-xs text-muted-foreground truncate">
            结果: {result.wasmResult}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">
          加速比:{" "}
        </span>
        <span className={`font-bold ${speedupColor}`}>
          {result.speedup.toFixed(2)}x
        </span>
        {result.speedup > 1 && (
          <span className="text-xs text-muted-foreground ml-2">
            (WASM 快{" "}
            {((result.speedup - 1) * 100).toFixed(0)}%)
          </span>
        )}
      </div>
    </div>
  );
}

// ==================== 图像处理组件 ====================
function ImageProcessor({
  wasm,
}: {
  wasm: WasmExports | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<ImageData | null>(null);
  const [processTime, setProcessTime] = useState<
    number | null
  >(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 加载示例图片
  const loadSampleImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 创建一个彩色渐变图像作为示例
    const width = 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // 绘制彩色渐变
    const gradient = ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );
    gradient.addColorStop(0, "#ff6b6b");
    gradient.addColorStop(0.25, "#feca57");
    gradient.addColorStop(0.5, "#48dbfb");
    gradient.addColorStop(0.75, "#ff9ff3");
    gradient.addColorStop(1, "#54a0ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 添加一些形状
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.arc(100, 100, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300, 200, 80, 0, Math.PI * 2);
    ctx.fill();

    // 保存原始图像
    originalImageRef.current = ctx.getImageData(
      0,
      0,
      width,
      height
    );
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    loadSampleImage();
  }, [loadSampleImage]);

  // 恢复原图
  const resetImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !originalImageRef.current) return;

    ctx.putImageData(originalImageRef.current, 0, 0);
    setProcessTime(null);
  }, []);

  // 应用 WASM 滤镜
  const applyFilter = useCallback(
    (
      filterName:
        | "grayscale"
        | "invert"
        | "brightness"
        | "blur"
    ) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !wasm || !originalImageRef.current)
        return;

      // 先恢复原图
      ctx.putImageData(originalImageRef.current, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas!.width,
        canvas!.height
      );

      const start = performance.now();

      // Rust WASM 直接操作 Uint8Array
      const data = new Uint8Array(imageData.data.buffer);

      // 应用滤镜
      switch (filterName) {
        case "grayscale":
          wasm.grayscale(data);
          break;
        case "invert":
          wasm.invert(data);
          break;
        case "brightness":
          wasm.adjust_brightness(data, 1.5);
          break;
        case "blur":
          wasm.blur(data, canvas!.width, canvas!.height);
          break;
      }

      const end = performance.now();
      setProcessTime(end - start);

      // 显示结果
      ctx.putImageData(imageData, 0, 0);
    },
    [wasm]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        🖼️ 图像处理示例
      </h3>
      <p className="text-sm text-muted-foreground">
        使用 Rust WASM
        进行像素级图像处理，展示零拷贝内存操作
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
          onClick={() => applyFilter("grayscale")}
          disabled={!wasm || !imageLoaded}
        >
          灰度化
        </button>
        <button
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
          onClick={() => applyFilter("invert")}
          disabled={!wasm || !imageLoaded}
        >
          反色
        </button>
        <button
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
          onClick={() => applyFilter("brightness")}
          disabled={!wasm || !imageLoaded}
        >
          增加亮度
        </button>
        <button
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
          onClick={() => applyFilter("blur")}
          disabled={!wasm || !imageLoaded}
        >
          高斯模糊
        </button>
        <button
          className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm"
          onClick={resetImage}
        >
          恢复原图
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[400px]"
        />
      </div>

      {processTime !== null && (
        <div className="text-sm text-muted-foreground">
          处理耗时:{" "}
          <span className="text-primary font-mono">
            {processTime.toFixed(2)}ms
          </span>
          <span className="ml-2">
            ({(400 * 300).toLocaleString()} 像素)
          </span>
        </div>
      )}
    </div>
  );
}

// ==================== 字符串处理演示 ====================
function StringDemo({
  wasm,
}: {
  wasm: WasmExports | null;
}) {
  const [input, setInput] = useState(
    "Hello Rust WebAssembly!"
  );
  const [reversed, setReversed] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleProcess = useCallback(() => {
    if (!wasm) return;
    setReversed(wasm.reverse_string(input));
    setWordCount(wasm.word_count(input));
  }, [wasm, input]);

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold text-foreground">
        📝 字符串处理（wasm-bindgen 特性）
      </h3>
      <p className="text-sm text-muted-foreground">
        展示 Rust 直接处理 JavaScript 字符串的能力
      </p>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border border-input rounded text-sm bg-background text-foreground"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入文本..."
        />
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
          onClick={handleProcess}
          disabled={!wasm}
        >
          处理
        </button>
      </div>
      {reversed && (
        <div className="text-sm space-y-1">
          <div>
            <span className="text-muted-foreground">
              反转:{" "}
            </span>
            <span className="text-foreground font-mono">
              {reversed}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">
              单词数:{" "}
            </span>
            <span className="text-foreground font-mono">
              {wordCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 主页面组件 ====================
export default function WasmDemoPage() {
  const [wasm, setWasm] = useState<WasmExports | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BenchmarkResult[]>(
    []
  );
  const [running, setRunning] = useState(false);

  // 加载 WASM 模块
  const handleLoadWasm = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const instance = await loadWasm();
      setWasm(instance);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "WASM 加载失败，请先运行 pnpm wasm:build"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 运行性能测试
  const runBenchmarks = useCallback(async () => {
    if (!wasm) return;

    setRunning(true);
    setResults([]);

    // 等待 UI 更新
    await new Promise((r) => setTimeout(r, 50));

    const newResults: BenchmarkResult[] = [];

    // 测试 1: 递归斐波那契 (n=35)
    const fibN = 35;
    {
      const jsStart = performance.now();
      const jsResult = jsFibonacciRecursive(fibN);
      const jsTime = performance.now() - jsStart;

      const wasmStart = performance.now();
      const wasmResult = wasm.fibonacci_recursive(fibN);
      const wasmTime = performance.now() - wasmStart;

      newResults.push({
        name: `斐波那契递归 (n=${fibN})`,
        jsTime,
        wasmTime,
        speedup: jsTime / wasmTime,
        jsResult: jsResult.toString(),
        wasmResult: wasmResult.toString(),
      });
    }

    // 测试 2: 迭代斐波那契 (n=80)
    const fibIterN = 80;
    {
      const jsStart = performance.now();
      const jsResult = jsFibonacciIterative(fibIterN);
      const jsTime = performance.now() - jsStart;

      const wasmStart = performance.now();
      const wasmResult = wasm.fibonacci_iterative(fibIterN);
      const wasmTime = performance.now() - wasmStart;

      newResults.push({
        name: `斐波那契迭代 (n=${fibIterN})`,
        jsTime,
        wasmTime,
        speedup: jsTime / wasmTime,
        jsResult: jsResult.toString(),
        wasmResult: wasmResult.toString(),
      });
    }

    // 测试 3: 素数计数
    const primeMax = 100000;
    {
      const jsStart = performance.now();
      const jsResult = jsCountPrimes(primeMax);
      const jsTime = performance.now() - jsStart;

      const wasmStart = performance.now();
      const wasmResult = wasm.count_primes(primeMax);
      const wasmTime = performance.now() - wasmStart;

      newResults.push({
        name: `统计素数个数 (1~${primeMax.toLocaleString()})`,
        jsTime,
        wasmTime,
        speedup: jsTime / wasmTime,
        jsResult: jsResult.toString(),
        wasmResult: wasmResult.toString(),
      });
    }

    // 测试 4: 第 N 个素数
    const nthPrime = 10000;
    {
      const jsStart = performance.now();
      const jsResult = jsGetNthPrime(nthPrime);
      const jsTime = performance.now() - jsStart;

      const wasmStart = performance.now();
      const wasmResult = wasm.get_nth_prime(nthPrime);
      const wasmTime = performance.now() - wasmStart;

      newResults.push({
        name: `第 ${nthPrime.toLocaleString()} 个素数`,
        jsTime,
        wasmTime,
        speedup: jsTime / wasmTime,
        jsResult: jsResult.toString(),
        wasmResult: wasmResult.toString(),
      });
    }

    setResults(newResults);
    setRunning(false);
  }, [wasm]);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          🦀 Rust WebAssembly Demo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          使用 Rust + wasm-pack + wasm-bindgen 构建的高性能
          WASM 模块
        </p>
      </div>

      {/* WASM 状态 */}
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                wasm ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="font-medium text-foreground">
              {wasm ? "WASM 已加载" : "WASM 未加载"}
            </span>
          </div>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
            onClick={handleLoadWasm}
            disabled={loading || isWasmLoaded()}
          >
            {loading
              ? "加载中..."
              : wasm
              ? "已加载"
              : "加载 WASM"}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded text-sm">
            <p className="font-medium">加载失败</p>
            <p>{error}</p>
            <p className="mt-2 text-xs">
              请先运行{" "}
              <code className="bg-muted px-1 rounded">
                pnpm wasm:build
              </code>{" "}
              编译 Rust WASM 模块
            </p>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="p-4 bg-primary/10 rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-foreground">
          📋 使用说明
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>
            安装 Rust 和 wasm-pack：
            <code className="bg-muted px-1 rounded ml-1 text-foreground">
              cargo install wasm-pack
            </code>
          </li>
          <li>
            编译 WASM：
            <code className="bg-muted px-1 rounded ml-1 text-foreground">
              pnpm wasm:build
            </code>
          </li>
          <li>点击「加载 WASM」初始化模块</li>
          <li>点击「运行性能测试」对比 JS vs Rust WASM</li>
        </ol>
      </div>

      {/* 性能测试 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            📊 性能对比测试
          </h3>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
            onClick={runBenchmarks}
            disabled={!wasm || running}
          >
            {running ? "测试中..." : "运行性能测试"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((result, i) => (
              <ResultCard key={i} result={result} />
            ))}
          </div>
        )}

        {results.length === 0 && !running && (
          <div className="text-center py-8 text-muted-foreground">
            {wasm
              ? "点击上方按钮运行测试"
              : "请先加载 WASM 模块"}
          </div>
        )}
      </div>

      {/* 字符串处理演示 */}
      <StringDemo wasm={wasm} />

      {/* 图像处理 */}
      <div className="pt-4 border-t border-border">
        <ImageProcessor wasm={wasm} />
      </div>

      {/* Rust WASM 优势说明 */}
      <div className="p-4 bg-accent rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-foreground">
          🦀 Rust WASM 的优势
        </h3>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              wasm-bindgen
            </strong>{" "}
            - 自动生成 JS ↔ Rust 绑定，支持复杂类型
          </li>
          <li>
            <strong className="text-foreground">
              零成本抽象
            </strong>{" "}
            - 无运行时开销，编译时优化
          </li>
          <li>
            <strong className="text-foreground">
              内存安全
            </strong>{" "}
            - 编译时保证，无 GC 暂停
          </li>
          <li>
            <strong className="text-foreground">
              丰富生态
            </strong>{" "}
            - web-sys, js-sys, 大量 crate 支持
          </li>
        </ul>
      </div>
    </div>
  );
}
