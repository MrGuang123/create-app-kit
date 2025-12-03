/**
 * 环境配置类型声明
 * 由 webpack DefinePlugin 注入的全局变量
 */

interface AppEnvConfig {
  /** 当前环境 */
  NODE_ENV: "development" | "production";
  /** 是否为开发环境 */
  isDev: boolean;
  /** 是否为生产环境 */
  isProd: boolean;
  /** 静态资源公共路径 */
  publicPath: string;
  /** API 基础路径 */
  apiPath: string;
  /** GraphQL 端点路径 */
  graphqlPath: string;
  /** WebSocket 地址 */
  wsUrl: string;
  /** 路由 basename */
  baseName: string;
  /** 是否开启 Mock */
  enableMock: boolean;
  /** 是否开启性能监控工具（Stats.js + React Scan + React Grab） */
  enablePerfTools: boolean;
  /** 应用标题 */
  appTitle: string;
}

/**
 * 全局环境配置对象
 * @example
 * ```ts
 * // 获取 API 路径
 * const apiPath = __APP_ENV__.apiPath;
 *
 * // 判断环境
 * if (__APP_ENV__.isDev) {
 *   console.log('开发环境');
 * }
 * ```
 */
declare const __APP_ENV__: AppEnvConfig;
