const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getConfig } = require("./config");

const resolvePath = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);

/**
 * 获取基础 webpack 配置
 * @param {string} env - 环境名称 (development | production)
 * @returns {object} webpack 配置对象
 */
module.exports = (env = "development") => {
  const envConfig = getConfig(env);

  return {
    entry: resolvePath("src/index.tsx"),
    output: {
      path: resolvePath("dist"),
      filename: "static/js/[name].[contenthash:8].js",
      assetModuleFilename:
        "static/media/[name].[hash][ext][query]",
      publicPath: envConfig.publicPath,
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      alias: {
        "@": resolvePath("src"),
      },
    },
    // 启用异步WebAssembly
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: { syntax: "typescript", tsx: true },
                transform: {
                  react: { runtime: "automatic" },
                },
                target: "es2020",
              },
            },
          },
        },
        // 将SVG作为组件导入时，使用@svgr/webpack转换为React组件
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: /react/, // import Icon from './icon.svg?react'
          use: ["@svgr/webpack"],
        },
        {
          test: /\.(png|jpe?g|gif|webp|avif)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
        // 将SVG作为URL导入时，使用asset/inline处理
        {
          test: /\.svg$/i,
          type: "asset",
          resourceQuery: { not: [/react/] }, // 普通 import 作为 URL
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
        // 字体
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/fonts/[name].[hash:8][ext]",
          },
        },
        // 音视频
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/media/[name].[hash:8][ext]",
          },
        },
        // wasm-pack 生成的 WASM（在 pkg 目录）由其 JS 胶水代码处理，排除掉
        {
          test: /\.wasm$/,
          include: /pkg/,
          type: "asset/resource",
          generator: {
            filename: "static/wasm/[name].[hash:8][ext]",
          },
        },
        // 其他 WASM 文件使用 webpack 的 asyncWebAssembly
        {
          test: /\.wasm$/,
          exclude: /pkg/,
          type: "webassembly/async",
        },
        {
          test: /\.(txt|md|glsl|vert|frag)$/i,
          type: "asset/source", // 作为字符串导入
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolvePath("public/index.html"),
        title: envConfig.appTitle,
      }),
      // 定义全局环境变量，可在业务代码中直接使用
      new webpack.DefinePlugin({
        __APP_ENV__: JSON.stringify({
          NODE_ENV: envConfig.NODE_ENV,
          isDev: envConfig.isDev,
          isProd: envConfig.isProd,
          publicPath: envConfig.publicPath,
          apiPath: envConfig.apiPath,
          wsUrl: envConfig.wsUrl,
          baseName: envConfig.baseName,
          enableMock: envConfig.enableMock,
          enablePerfTools: envConfig.enablePerfTools,
          appTitle: envConfig.appTitle,
        }),
        // 也可以单独定义，方便按需使用
        "process.env.NODE_ENV": JSON.stringify(
          envConfig.NODE_ENV
        ),
      }),
    ],
    stats: "minimal",
  };
};
