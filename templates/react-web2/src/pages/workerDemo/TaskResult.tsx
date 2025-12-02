import { Timer, CheckCircle, XCircle } from "lucide-react";

interface TaskResultProps {
  title: string;
  result?: unknown;
  duration?: number;
  error?: string;
  success?: boolean;
}

// 任务展示组件
export default function TaskResult({
  title,
  result,
  duration,
  error,
  success,
}: TaskResultProps) {
  return (
    <div className="rounded-lg bg-card p-4 ring-1 ring-border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-foreground">
          {title}
        </h4>
        {success !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs ${
              success ? "text-primary" : "text-destructive"
            }`}
          >
            {success ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {success ? "成功" : "失败"}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p className="font-mono break-all">
            结果:{" "}
            {typeof result === "object"
              ? JSON.stringify(result).slice(0, 100) + "..."
              : String(result)}
          </p>
        </div>
      )}

      {duration !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Timer className="h-3 w-3" />
          耗时: {duration.toFixed(2)} ms
        </div>
      )}
    </div>
  );
}
