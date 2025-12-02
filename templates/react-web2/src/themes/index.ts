import type {
  ThemeColors,
  ThemeConfig,
  ThemePreset,
  ThemeMode,
} from "./types";
import { tech, material, antd } from "./presets";

export type {
  ThemeColors,
  ThemeConfig,
  ThemePreset,
  ThemeMode,
};

/**
 * 所有可用的主题预设
 */
export const themePresets: Record<
  ThemePreset,
  ThemeConfig
> = {
  tech,
  material,
  antd,
};

/**
 * 主题预设列表（用于 UI 展示）
 */
export const themePresetList = Object.values(themePresets);

/**
 * 将 ThemeColors 转换为 CSS 变量字符串
 */
const colorsToCSSVariables = (
  colors: ThemeColors
): string => {
  return `
    --background: ${colors.background};
    --foreground: ${colors.foreground};
    --card: ${colors.card};
    --card-foreground: ${colors.cardForeground};
    --popover: ${colors.popover};
    --popover-foreground: ${colors.popoverForeground};
    --primary: ${colors.primary};
    --primary-foreground: ${colors.primaryForeground};
    --secondary: ${colors.secondary};
    --secondary-foreground: ${colors.secondaryForeground};
    --muted: ${colors.muted};
    --muted-foreground: ${colors.mutedForeground};
    --accent: ${colors.accent};
    --accent-foreground: ${colors.accentForeground};
    --destructive: ${colors.destructive};
    --destructive-foreground: ${colors.destructiveForeground};
    --border: ${colors.border};
    --input: ${colors.input};
    --ring: ${colors.ring};
    --sidebar: ${colors.sidebar};
    --sidebar-foreground: ${colors.sidebarForeground};
    --sidebar-primary: ${colors.sidebarPrimary};
    --sidebar-primary-foreground: ${colors.sidebarPrimaryForeground};
    --sidebar-accent: ${colors.sidebarAccent};
    --sidebar-accent-foreground: ${colors.sidebarAccentForeground};
    --sidebar-border: ${colors.sidebarBorder};
    --sidebar-ring: ${colors.sidebarRing};
  `;
};

/**
 * 应用主题到 DOM
 */
export const applyTheme = (
  preset: ThemePreset,
  mode: ThemeMode
): void => {
  const theme = themePresets[preset];
  if (!theme) return;

  const root = document.documentElement;

  // 确定实际使用的模式
  let actualMode: "light" | "dark" =
    mode === "light" ? "light" : "dark";
  if (mode === "system") {
    actualMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
  }

  // 获取对应的颜色
  const colors =
    actualMode === "dark" ? theme.dark : theme.light;

  // 设置 CSS 变量
  root.style.cssText = colorsToCSSVariables(colors);

  // 设置 dark 类
  root.classList.toggle("dark", actualMode === "dark");

  // 保存当前主题信息到 data 属性（方便调试）
  root.dataset.theme = preset;
  root.dataset.mode = actualMode;
};

/**
 * 获取当前实际的模式（处理 system）
 */
export const getActualMode = (
  mode: ThemeMode
): "light" | "dark" => {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
  }
  return mode;
};
