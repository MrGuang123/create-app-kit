import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppStore,
  languages,
  type LanguageCode,
} from "@/stores/appStore";

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const _setLanguage = useAppStore(
    (state) => state.setLanguage
  );

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const changeLanguage = (newLang: LanguageCode) => {
    _setLanguage(newLang);
  };

  return {
    currentLanguage: language,
    changeLanguage,
    languages,
    t,
  };
}
