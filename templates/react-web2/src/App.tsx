import AppRoutes from "@/routes";
import { QueryProvider } from "@/providers/queryProvider";
import { SidebarProvider } from "@/shadcn/ui/sidebar";

const App = () => {
  return (
    <QueryProvider>
      {/* 亮色背景 */}
      <div className="fixed inset-0 z-0 bg-linear-to-br from-slate-50 via-white to-blue-50 dark:hidden" />
      {/* 暗色背景 */}
      <div className="fixed inset-0 z-0 hidden bg-linear-to-br from-slate-900 via-slate-950 to-indigo-950 dark:block" />
      {/* 光晕效果 - 暗色模式 */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 hidden h-96 w-96 -translate-x-1/2 bg-cyan-500/20 blur-[120px] dark:block" />
      <div className="pointer-events-none fixed right-0 bottom-0 z-0 hidden h-80 w-80 bg-indigo-500/15 blur-[100px] dark:block" />

      <SidebarProvider className="relative z-10">
        <AppRoutes />
      </SidebarProvider>
    </QueryProvider>
  );
};

export default App;
