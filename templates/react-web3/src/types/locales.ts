import zhCN from "@/locales/zh-CN";

// 使用中文作为类型基准
type Resources = typeof zhCN;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: Resources;
  }
}
