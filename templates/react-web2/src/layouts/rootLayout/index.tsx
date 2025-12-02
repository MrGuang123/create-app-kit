import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/shadcn/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const menu = [
  { label: "学习列表", to: "/list", icon: BookOpen },
  { label: "新功能", to: "/newFeature", icon: Sparkles },
  {
    label: "WebSocket 测试",
    to: "/socketTest",
    icon: Terminal,
  },
  {
    label: "Web Worker",
    to: "/workerDemo",
    icon: Cpu,
  },
];

const RootLayout = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <>
      {/* 侧边栏 */}
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <h1 className="text-lg font-semibold">
            {t("sidebar.title")}
          </h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {t("sidebar.navMenu")}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => {
                  const isActive = pathname === item.to;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                      >
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <p className="text-xs text-muted-foreground">
            {t("sidebar.copyright")}
          </p>
        </SidebarFooter>
      </Sidebar>

      {/* 主内容区 */}
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b border-sidebar-border px-6">
          <SidebarTrigger />
          <h2 className="font-semibold">
            {menu.find((m) => m.to === pathname)?.label ||
              t("nav.home")}
          </h2>
          <LanguageSwitcher />
          <ThemeToggle />
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
};

export default RootLayout;
