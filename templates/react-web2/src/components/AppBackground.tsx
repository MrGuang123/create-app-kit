/**
 * 应用全局背景
 * - 使用主题变量，支持多主题切换
 * - 亮色模式：浅色渐变
 * - 暗色模式：深色渐变 + 光晕效果 + 网格
 */
export function AppBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* 基础背景 - 使用主题背景色 */}
      <div className="absolute inset-0 bg-background" />

      {/* 渐变叠加层 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary), transparent),
            radial-gradient(ellipse 60% 40% at 100% 100%, var(--ring), transparent)
          `,
          opacity: 0.08,
        }}
      />

      {/* 网格效果 - 暗色模式 */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
        }}
      />

      {/* 光晕效果 - 仅暗色模式 */}
      <div
        className="absolute left-1/4 top-0 hidden h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[150px] dark:block"
        style={{
          backgroundColor: "var(--primary)",
          opacity: 0.12,
        }}
      />
      <div
        className="absolute right-0 bottom-0 hidden h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full blur-[120px] dark:block"
        style={{
          backgroundColor: "var(--ring)",
          opacity: 0.08,
        }}
      />
    </div>
  );
}
