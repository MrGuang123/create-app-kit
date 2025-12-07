import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Activity,
  Eye,
  MousePointer2,
  Zap,
  RefreshCw,
  Gauge,
  Timer,
  MemoryStick,
  Sparkles,
  Settings,
  Workflow,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

/**
 * 性能监控工具演示页面
 */
export default function PerfToolsDemo() {
  const isEnabled = __APP_ENV__.enablePerfTools;

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Performance Tools Demo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          性能监控和调试工具集成演示 - Stats.js / React Scan
          / React Grab
        </p>
      </div>

      {/* 当前状态 */}
      <div
        className={`p-4 rounded-lg ${
          isEnabled ? "bg-green-500/10" : "bg-yellow-500/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isEnabled ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="font-medium text-foreground">
            {isEnabled
              ? "✅ 性能监控工具已启用"
              : "⚠️ 性能监控工具已禁用"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          通过{" "}
          <code className="px-1 py-0.5 bg-muted rounded">
            build/config.js
          </code>{" "}
          中的{" "}
          <code className="px-1 py-0.5 bg-muted rounded">
            enablePerfTools
          </code>{" "}
          配置控制
        </p>
      </div>

      {/* 工具介绍 */}
      <div className="grid gap-4 md:grid-cols-3">
        <ToolCard
          icon={<Gauge className="h-5 w-5" />}
          title="Stats.js"
          description="实时 FPS、帧时间、内存监控面板"
          color="text-green-500"
          features={["FPS 帧率", "MS 帧时间", "MB 内存"]}
        />
        <ToolCard
          icon={<Eye className="h-5 w-5" />}
          title="React Scan"
          description="可视化高亮正在渲染的 React 组件"
          color="text-red-500"
          features={[
            "渲染高亮",
            "重渲染检测",
            "性能瓶颈定位",
          ]}
        />
        <ToolCard
          icon={<MousePointer2 className="h-5 w-5" />}
          title="React Grab"
          description="Cmd+C 快速抓取组件上下文给 AI"
          color="text-cyan-500"
          features={[
            "点击抓取",
            "复制到剪贴板",
            "AI 辅助开发",
          ]}
        />
      </div>

      {/* 配置说明 */}
      <div className="p-4 bg-primary/10 rounded-lg">
        <h3 className="font-medium mb-2 text-foreground flex items-center gap-2">
          <Settings className="h-4 w-4" />
          配置方式
        </h3>
        <pre className="text-xs overflow-x-auto p-3 bg-card rounded border border-border">
          {`// build/config.js
const config = {
  development: {
    // 开启性能监控工具
    enablePerfTools: true,  // 设为 false 可关闭
    // ...
  },
  production: {
    // 生产环境默认关闭
    enablePerfTools: false,
    // ...
  },
};`}
        </pre>
      </div>

      {/* 使用说明 */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2 text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          使用说明
        </h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            ✅ <strong>Stats.js</strong>: 右上角显示 FPS
            面板，点击可切换显示内容
          </li>
          <li>
            ✅ <strong>React Scan</strong>:
            组件渲染时会闪烁高亮，频繁闪烁说明需要优化
          </li>
          <li>
            ✅ <strong>React Grab</strong>: 按 Cmd+C
            进入选择模式，点击组件抓取上下文
          </li>
          <li>✅ 生产环境会自动关闭，不影响包体积</li>
        </ul>
      </div>

      {/* 交互演示区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RenderStressTest />
        <AnimationDemo />
      </div>

      {/* 性能问题演示场景 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          性能问题演示场景
        </h3>
        <p className="text-sm text-muted-foreground">
          以下场景包含常见的性能问题，使用 Stats.js 和 React
          Scan 观察问题，然后使用 React Grab 分析代码
        </p>
        <PerformanceProblemDemo />
      </div>

      {/* 工具详细说明 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Timer className="h-4 w-4" />
          工具详解
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <UsageCard
            title="Stats.js"
            icon={
              <Gauge className="h-4 w-4 text-green-500" />
            }
            steps={[
              "右上角显示 FPS 面板",
              "点击面板切换 FPS/MS/MB",
              "绿色=良好，红色=卡顿",
            ]}
          />
          <UsageCard
            title="React Scan"
            icon={<Eye className="h-4 w-4 text-red-500" />}
            steps={[
              "组件渲染时会闪烁高亮",
              "频繁闪烁=可能需要优化",
              "配合 memo/useMemo 验证",
            ]}
          />
          <UsageCard
            title="React Grab"
            icon={
              <MousePointer2 className="h-4 w-4 text-cyan-500" />
            }
            steps={[
              "按 Cmd+C 进入选择模式",
              "点击任意组件抓取上下文",
              "粘贴到 Cursor/Claude 中",
            ]}
          />
        </div>
      </div>

      {/* 性能优化工作流程 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          性能优化工作流程
        </h3>

        <div className="rounded-lg bg-card p-6 ring-1 ring-border space-y-6">
          {/* 步骤 1 */}
          <WorkflowStep
            step={1}
            title="发现性能问题"
            icon={
              <Target className="h-5 w-5 text-blue-500" />
            }
            description="使用 Stats.js 监控整体性能指标"
            actions={[
              {
                tool: "Stats.js",
                action: "观察右上角 FPS 面板",
                tip: "FPS < 60 或频繁波动说明存在性能问题",
              },
              {
                tool: "Stats.js",
                action: "切换到 MS 面板查看帧时间",
                tip: "帧时间 > 16ms 说明单帧渲染过慢",
              },
              {
                tool: "Stats.js",
                action: "切换到 MB 面板查看内存使用",
                tip: "内存持续增长可能存在内存泄漏",
              },
            ]}
          />

          {/* 步骤 2 */}
          <WorkflowStep
            step={2}
            title="定位问题组件"
            icon={<Eye className="h-5 w-5 text-red-500" />}
            description="使用 React Scan 找出频繁重渲染的组件"
            actions={[
              {
                tool: "React Scan",
                action: "在页面上进行操作（点击、输入等）",
                tip: "观察哪些组件频繁闪烁高亮",
              },
              {
                tool: "React Scan",
                action: "识别高亮最频繁的组件",
                tip: "这些组件可能是性能瓶颈",
              },
              {
                tool: "React Scan",
                action:
                  "检查父组件更新是否导致子组件重渲染",
                tip: "如果子组件不需要更新但频繁闪烁，需要优化",
              },
            ]}
          />

          {/* 步骤 3 */}
          <WorkflowStep
            step={3}
            title="分析组件代码"
            icon={
              <MousePointer2 className="h-5 w-5 text-cyan-500" />
            }
            description="使用 React Grab 快速获取组件上下文"
            actions={[
              {
                tool: "React Grab",
                action: "按 Cmd+C 进入选择模式",
                tip: "页面会显示组件选择提示",
              },
              {
                tool: "React Grab",
                action: "点击问题组件",
                tip: "组件代码和 props 会被复制到剪贴板",
              },
              {
                tool: "React Grab",
                action: "粘贴到 Cursor/Claude 中分析",
                tip: "AI 可以帮助识别优化点（如缺少 memo、不必要的计算等）",
              },
            ]}
          />

          {/* 步骤 4 */}
          <WorkflowStep
            step={4}
            title="实施优化方案"
            icon={
              <Zap className="h-5 w-5 text-yellow-500" />
            }
            description="根据分析结果应用优化技巧"
            actions={[
              {
                tool: "优化技巧",
                action: "使用 React.memo 包裹组件",
                tip: "防止 props 未变化时的重渲染",
              },
              {
                tool: "优化技巧",
                action:
                  "使用 useMemo/useCallback 缓存计算结果",
                tip: "避免每次渲染都重新计算",
              },
              {
                tool: "优化技巧",
                action: "拆分大组件为小组件",
                tip: "减少不必要的重渲染范围",
              },
              {
                tool: "优化技巧",
                action: "使用 useTransition 处理非紧急更新",
                tip: "提升用户交互响应速度",
              },
            ]}
          />

          {/* 步骤 5 */}
          <WorkflowStep
            step={5}
            title="验证优化效果"
            icon={
              <CheckCircle className="h-5 w-5 text-green-500" />
            }
            description="再次使用工具验证优化是否生效"
            actions={[
              {
                tool: "React Scan",
                action: "观察组件是否仍然频繁闪烁",
                tip: "如果闪烁减少，说明优化生效",
              },
              {
                tool: "Stats.js",
                action: "检查 FPS 是否稳定在 60",
                tip: "帧率稳定说明性能已改善",
              },
              {
                tool: "Stats.js",
                action: "观察内存使用是否稳定",
                tip: "内存不再增长说明没有泄漏",
              },
            ]}
          />
        </div>

        {/* 实际案例 */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            实际优化案例
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground">
                  案例 1：列表渲染优化
                </strong>
                <p className="mt-1">
                  使用 Stats.js 发现滚动列表时 FPS 降到
                  30，React Scan 显示列表项频繁闪烁。 使用
                  React Grab 抓取列表项组件，发现缺少
                  memo。添加 React.memo 后，FPS 恢复到 60。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground">
                  案例 2：表单输入优化
                </strong>
                <p className="mt-1">
                  React Scan
                  显示输入框变化时整个表单组件都在闪烁。使用
                  React Grab 分析发现 表单组件没有使用
                  useCallback
                  缓存事件处理函数。优化后只有输入框本身会重渲染。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground">
                  案例 3：内存泄漏排查
                </strong>
                <p className="mt-1">
                  Stats.js 显示内存持续增长。使用 React Scan
                  发现某个组件频繁创建和销毁。 使用 React
                  Grab 抓取组件代码，发现 useEffect
                  没有正确清理定时器。修复后内存稳定。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 工具卡片组件
 */
interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  features: string[];
}

const ToolCard = ({
  icon,
  title,
  description,
  color,
  features,
}: ToolCardProps) => (
  <div className="rounded-lg bg-card p-4 ring-1 ring-border">
    <div className={`mb-3 ${color}`}>{icon}</div>
    <h4 className="font-semibold text-foreground">
      {title}
    </h4>
    <p className="text-xs text-muted-foreground mt-1 mb-3">
      {description}
    </p>
    <div className="flex flex-wrap gap-1">
      {features.map((f) => (
        <span
          key={f}
          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
        >
          {f}
        </span>
      ))}
    </div>
  </div>
);

/**
 * 使用说明卡片
 */
interface UsageCardProps {
  title: string;
  icon: React.ReactNode;
  steps: string[];
}

const UsageCard = ({
  title,
  icon,
  steps,
}: UsageCardProps) => (
  <div className="rounded-lg bg-card p-4 ring-1 ring-border">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="font-medium text-foreground">
        {title}
      </span>
    </div>
    <ol className="space-y-1 text-xs text-muted-foreground">
      {steps.map((step, i) => (
        <li key={i}>
          {i + 1}. {step}
        </li>
      ))}
    </ol>
  </div>
);

/**
 * 列表项组件 - 故意没有使用 memo，存在性能问题
 */
interface ListItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  isSelected: boolean;
  onClick: (id: number) => void;
  expensiveValue: number;
}

const ListItem = ({
  item,
  isSelected,
  onClick,
  expensiveValue,
}: ListItemProps) => {
  // 问题：每次渲染都执行这个计算
  const displayPrice = `¥${item.price.toFixed(2)}`;

  // 问题：即使 expensiveValue 没有变化，也会在每次渲染时使用
  const _unused = expensiveValue % 1000;

  return (
    <div
      className={`p-3 rounded border cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/20 border-primary"
          : "bg-card border-border hover:bg-muted/50"
      }`}
      onClick={() => onClick(item.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-foreground">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {item.description}
          </div>
        </div>
        <div className="ml-4 text-right">
          <div className="font-semibold text-foreground">
            {displayPrice}
          </div>
          <div className="text-xs text-muted-foreground">
            ID: {item.id}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 性能问题演示组件
 * 包含常见的性能问题，用于测试性能监控工具
 */
const PerformanceProblemDemo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `项目 ${i}`,
      description: `这是第 ${i} 个项目的描述信息`,
      price: Math.floor(Math.random() * 1000),
    }))
  );
  const [selectedId, setSelectedId] = useState<
    number | null
  >(null);
  const [counter, setCounter] = useState(0);

  // 问题 1: 没有使用 useCallback，每次渲染都创建新函数
  const handleItemClick = (id: number) => {
    setSelectedId(id);
  };

  // 问题 2: 不必要的计算，每次渲染都重新计算
  const filteredItems = items.filter((item) =>
    item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 问题 3: 复杂的计算没有使用 useMemo
  const expensiveCalculation = () => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  };

  const expensiveValue = expensiveCalculation();

  return (
    <div className="rounded-lg bg-card p-6 ring-1 ring-border space-y-6">
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">
          🐛 性能问题场景
        </h4>
        <p className="text-sm text-muted-foreground">
          这个场景包含多个性能问题，观察 Stats.js 的 FPS 和
          React Scan 的高亮效果
        </p>
      </div>

      {/* 问题说明 */}
      <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          包含的性能问题：
        </h5>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>❌ 列表项组件没有使用 React.memo</li>
          <li>❌ 事件处理函数没有使用 useCallback</li>
          <li>❌ 过滤计算没有使用 useMemo</li>
          <li>❌ 昂贵的计算在每次渲染时都执行</li>
          <li>❌ 父组件状态更新导致所有子组件重渲染</li>
        </ul>
      </div>

      {/* 计数器 - 用于触发重渲染 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            计数器：
          </span>
          <span className="text-lg font-semibold text-foreground">
            {counter}
          </span>
        </div>
        <Button
          onClick={() => setCounter((c) => c + 1)}
          variant="outline"
          size="sm"
        >
          点击触发重渲染
        </Button>
        <span className="text-xs text-muted-foreground">
          （观察：每次点击都会导致所有列表项重渲染）
        </span>
      </div>

      {/* 搜索框 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          搜索项目（输入时观察性能）：
        </label>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入搜索关键词..."
          className="max-w-md"
        />
      </div>

      {/* 列表 - 包含性能问题 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            显示 {filteredItems.length} / {items.length}{" "}
            个项目
          </span>
          <span className="text-xs text-orange-500">
            💡 使用 React Scan 观察：输入时所有项目都会闪烁
          </span>
        </div>
        <div className="max-h-96 overflow-y-auto border rounded-lg p-2 space-y-1">
          {filteredItems.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={handleItemClick}
              expensiveValue={expensiveValue}
            />
          ))}
        </div>
      </div>

      {/* 优化提示 */}
      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          优化建议：
        </h5>
        <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
          <li>使用 React.memo 包裹 ListItem 组件</li>
          <li>使用 useCallback 缓存 handleItemClick</li>
          <li>使用 useMemo 缓存 filteredItems</li>
          <li>使用 useMemo 缓存 expensiveValue</li>
          <li>
            使用 React Grab 抓取组件代码，让 AI 帮助优化
          </li>
        </ol>
      </div>
    </div>
  );
};

/**
 * 工作流程步骤组件
 */
interface WorkflowStepProps {
  step: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  actions: Array<{
    tool: string;
    action: string;
    tip: string;
  }>;
}

const WorkflowStep = ({
  step,
  title,
  icon,
  description,
  actions,
}: WorkflowStepProps) => (
  <div className="space-y-3">
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h4 className="font-semibold text-foreground">
            {title}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>
        <div className="space-y-2">
          {actions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 rounded bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {action.tool}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {action.action}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-1">
                  💡 {action.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {step < 5 && (
      <div className="flex justify-center py-2">
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    )}
  </div>
);

/**
 * 渲染压力测试组件
 */
const RenderStressTest = () => {
  const [count, setCount] = useState(100);
  const [items, setItems] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const startTest = useCallback(() => {
    setIsRunning(true);
    setItems(Array.from({ length: count }, (_, i) => i));
  }, [count]);

  const stopTest = useCallback(() => {
    setIsRunning(false);
    setItems([]);
  }, []);

  // 持续触发重渲染
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setItems((prev) => prev.map(() => Math.random()));
    }, 16);
    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <div className="rounded-lg bg-card p-4 ring-1 ring-border space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <RefreshCw
          className={`h-4 w-4 ${
            isRunning ? "animate-spin" : ""
          }`}
        />
        渲染压力测试
      </h3>
      <p className="text-xs text-muted-foreground">
        模拟大量组件频繁重渲染，观察 Stats.js 帧率和 React
        Scan 高亮
      </p>

      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24"
          placeholder="组件数量"
          disabled={isRunning}
        />
        <span className="text-sm text-muted-foreground">
          个组件
        </span>
      </div>

      <div className="flex gap-2">
        <Button onClick={startTest} disabled={isRunning}>
          <Zap className="h-4 w-4 mr-1" />
          开始测试
        </Button>
        <Button
          variant="outline"
          onClick={stopTest}
          disabled={!isRunning}
        >
          停止
        </Button>
      </div>

      {isRunning && (
        <div className="grid grid-cols-10 gap-1 max-h-32 overflow-hidden">
          {items.slice(0, 100).map((val, i) => (
            <div
              key={i}
              className="h-3 rounded-sm transition-colors"
              style={{
                backgroundColor: `hsl(${
                  val * 360
                }, 70%, 50%)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 动画演示组件
 */
const AnimationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particleCount, setParticleCount] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
    }>
  >([]);
  const rafRef = useRef<number>(0);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 初始化粒子
    particlesRef.current = Array.from(
      { length: particleCount },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      })
    );

    setIsAnimating(true);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [particleCount]);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsAnimating(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="rounded-lg bg-card p-4 ring-1 ring-border space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <MemoryStick className="h-4 w-4" />
        Canvas 动画测试
      </h3>
      <p className="text-xs text-muted-foreground">
        使用 Canvas 渲染粒子动画，观察 Stats.js 的帧率变化
      </p>

      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={particleCount}
          onChange={(e) =>
            setParticleCount(Number(e.target.value))
          }
          className="w-24"
          placeholder="粒子数量"
          disabled={isAnimating}
        />
        <span className="text-sm text-muted-foreground">
          个粒子
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={startAnimation}
          disabled={isAnimating}
        >
          <Zap className="h-4 w-4 mr-1" />
          开始动画
        </Button>
        <Button
          variant="outline"
          onClick={stopAnimation}
          disabled={!isAnimating}
        >
          停止
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        className="w-full rounded bg-black/50"
      />
    </div>
  );
};
