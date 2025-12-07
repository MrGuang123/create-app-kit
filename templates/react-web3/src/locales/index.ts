import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./zh-CN";
import enUS from "./en-US";

i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
  // 默认中文
  lng: "zh-CN",
  // 如果用户语言不存在，则使用中文
  fallbackLng: "zh-CN",
  // 默认命名空间
  defaultNS: "common",
  // 不转义HTML实体，react已经处理好XSS
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
