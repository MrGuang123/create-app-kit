import { useEffect, useState } from "react";
import { useAppStore, type Theme } from "@/stores/appStore";

const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement;

  if (theme === "system") {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", systemDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
};

export function useTheme() {
  const theme = useAppStore((state) => state.theme);
  const _setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  useEffect(() => {
    // 监听系统主题变化
    if (theme === "system") {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle(
          "dark",
          e.matches
        );
      };
      mediaQuery.addEventListener("change", handler);
      return () =>
        mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    _setTheme(newTheme);
  };

  return { theme, setTheme };
}
