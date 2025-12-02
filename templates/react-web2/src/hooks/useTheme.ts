import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import {
  applyTheme,
  getActualMode,
  themePresetList,
  type ThemeMode,
  type ThemePreset,
} from "@/themes";

export function useTheme() {
  const themeMode = useAppStore((state) => state.themeMode);
  const themePreset = useAppStore(
    (state) => state.themePreset
  );
  const setThemeMode = useAppStore(
    (state) => state.setThemeMode
  );
  const setThemePreset = useAppStore(
    (state) => state.setThemePreset
  );

  // 应用主题
  useEffect(() => {
    applyTheme(themePreset, themeMode);
  }, [themeMode, themePreset]);

  // 监听系统主题变化
  useEffect(() => {
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const handler = () => {
        applyTheme(themePreset, themeMode);
      };
      mediaQuery.addEventListener("change", handler);
      return () =>
        mediaQuery.removeEventListener("change", handler);
    }
  }, [themeMode, themePreset]);

  return {
    // 当前状态
    mode: themeMode,
    preset: themePreset,
    actualMode: getActualMode(themeMode),
    // 可用选项
    presets: themePresetList,
    // 设置方法
    setMode: setThemeMode,
    setPreset: setThemePreset,
  };
}
