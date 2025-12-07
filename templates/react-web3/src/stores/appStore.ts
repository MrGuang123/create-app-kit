import { createStore } from "@/utils/createStore";
import type { ThemeMode, ThemePreset } from "@/themes";

export type LanguageCode = "zh-CN" | "en-US";

export const languages = [
  { code: "zh-CN", name: "简体中文" },
  { code: "en-US", name: "English" },
] as const;

type AppState = {
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  language: LanguageCode;
};

type AppActions = {
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setLanguage: (language: LanguageCode) => void;
};

export const useAppStore = createStore<
  AppState,
  AppActions
>(
  (set) => ({
    themeMode: "system",
    themePreset: "tech",
    language: "zh-CN",
    setThemeMode: (mode) =>
      set(
        (state) => {
          state.themeMode = mode;
        },
        false,
        `setThemeMode/${mode}`
      ),
    setThemePreset: (preset) =>
      set(
        (state) => {
          state.themePreset = preset;
        },
        false,
        `setThemePreset/${preset}`
      ),
    setLanguage: (language) =>
      set(
        (state) => {
          state.language = language;
        },
        false,
        `setLanguage/${language}`
      ),
  }),
  {
    name: "app-store",
    persistOptions: {
      partialize: (state) => ({
        themeMode: state.themeMode,
        themePreset: state.themePreset,
        language: state.language,
      }),
    },
  }
);
