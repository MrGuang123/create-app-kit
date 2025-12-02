/**
 * 环境配置文件
 * 包含 development 和 production 环境的配置
 */

const config = {
  // 开发环境配置
  development: {
    // 静态资源公共路径
    publicPath: "/",
    // API 基础路径
    apiPath: "/api",
    // WebSocket 地址
    wsUrl: "ws://localhost:8080",
    // 路由 basename（用于子路径部署）
    baseName: "/",
    // 是否开启 Mock
    enableMock: true,
    // 开发服务器端口
    devPort: 5173,
    // 其他自定义配置
    appTitle: "React App (Dev)",
  },

  // 生产环境配置
  production: {
    // 静态资源公共路径（可配置 CDN 地址）
    publicPath: "/",
    // API 基础路径
    apiPath: "/api",
    // WebSocket 地址
    wsUrl: "wss://your-production-domain.com/ws",
    // 路由 basename（用于子路径部署，如 /app/）
    baseName: "/",
    // 是否开启 Mock
    enableMock: false,
    // 其他自定义配置
    appTitle: "React App",
  },
};

/**
 * 获取指定环境的配置
 * @param {string} env - 环境名称 (development | production)
 * @returns {object} 环境配置对象
 */
function getConfig(env) {
  const envConfig = config[env];
  if (!envConfig) {
    throw new Error(`Unknown environment: ${env}`);
  }
  return {
    ...envConfig,
    // 注入环境标识
    NODE_ENV: env,
    isDev: env === "development",
    isProd: env === "production",
  };
}

module.exports = {
  config,
  getConfig,
};
