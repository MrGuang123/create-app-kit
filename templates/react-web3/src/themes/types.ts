/**
 * 主题颜色变量定义
 */
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  name: string;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
}

/**
 * 主题模式
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * 主题预设名称
 */
export type ThemePreset = "tech" | "material" | "antd";
