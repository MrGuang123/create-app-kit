import {
  Moon,
  Sun,
  Monitor,
  Check,
  Cpu,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shadcn/ui/dropdown-menu";
import type { ThemePreset } from "@/themes";

// 主题图标映射
const themeIcons: Record<ThemePreset, typeof Cpu> = {
  tech: Cpu,
  material: Layers,
  antd: LayoutGrid,
};

export function ThemeToggle() {
  const { mode, preset, presets, setMode, setPreset } =
    useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {/* 模式选择 */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          模式
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setMode("light")}>
          <Sun className="mr-2 h-4 w-4" />
          亮色
          {mode === "light" && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          暗色
          {mode === "dark" && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          跟随系统
          {mode === "system" && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 主题风格选择 */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          风格
        </DropdownMenuLabel>
        {presets.map((theme) => {
          const Icon =
            themeIcons[theme.name as ThemePreset];
          return (
            <DropdownMenuItem
              key={theme.name}
              onClick={() =>
                setPreset(theme.name as typeof preset)
              }
            >
              <Icon
                className="mr-2 h-4 w-4"
                style={{ color: theme.dark.primary }}
              />
              {theme.label}
              {preset === theme.name && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
