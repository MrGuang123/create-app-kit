import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
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

const menu = [
  { label: "学习列表", to: "/list", icon: BookOpen },
  { label: "新功能", to: "/newFeature", icon: Sparkles },
];

const RootLayout = () => {
  const { pathname } = useLocation();

  return (
    <>
      {/* 侧边栏 */}
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <h1 className="text-lg font-semibold">
            学习中心
          </h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>导航菜单</SidebarGroupLabel>
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
            © 2024 学习中心
          </p>
        </SidebarFooter>
      </Sidebar>

      {/* 主内容区 */}
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b border-sidebar-border px-6">
          <SidebarTrigger />
          <h2 className="font-semibold">
            {menu.find((m) => m.to === pathname)?.label ||
              "首页"}
          </h2>
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
