const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { experiments } = require("webpack");

const resolvePath = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);

module.exports = {
  entry: resolvePath("src/index.tsx"),
  output: {
    path: resolvePath("dist"),
    filename: "static/js/[name].[contenthash:8].js",
    assetModuleFilename:
      "static/media/[name].[hash][ext][query]",
    publicPath: "/",
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
      {
        test: /\.wasm$/,
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
    }),
  ],
  stats: "minimal",
};
