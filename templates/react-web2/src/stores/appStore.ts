import { createStore } from "@/utils/createStore";

export type Theme = "light" | "dark" | "system";
export type LanguageCode = "zh-CN" | "en-US";

export const languages = [
  { code: "zh-CN", name: "简体中文" },
  { code: "en-US", name: "English" },
] as const;

type AppState = {
  theme: Theme;
  language: LanguageCode;
};

type AppActions = {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: LanguageCode) => void;
};

export const useAppStore = createStore<
  AppState,
  AppActions
>(
  (set) => ({
    theme: "dark",
    language: "zh-CN",
    setTheme: (theme) =>
      set(
        (state) => {
          state.theme = theme;
        },
        false,
        `setTheme/${theme}`
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
        theme: state.theme,
        language: state.language,
      }),
    },
  }
);
