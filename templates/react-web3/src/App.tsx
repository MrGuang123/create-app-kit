import { Suspense } from "react";
import AppRoutes from "@/routes";
import { QueryProvider } from "@/providers/queryProvider";
import { SidebarProvider } from "@/shadcn/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { AppBackground } from "@/components/AppBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loading } from "@/components/Loading";

const App = () => {
  // 初始化主题和语言
  // FOCUS: 如果你设置了其它布局，并且没有添加切换主题和语言的组件，请取消注释下面的代码
  // useTheme();
  // useLanguage();

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <QueryProvider>
          <AppBackground />
          <SidebarProvider className="relative z-10">
            <AppRoutes />
          </SidebarProvider>
        </QueryProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
