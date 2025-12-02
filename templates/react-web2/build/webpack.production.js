const webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const {
  BundleAnalyzerPlugin,
} = require("webpack-bundle-analyzer");
const WebpackBar = require("webpackbar");
const getBaseConfig = require("./webpack.base");
const packageJson = require("../package.json");

const isAnalyze = process.env.ANALYZE === "true";

module.exports = merge(getBaseConfig("production"), {
  mode: "production",

  // 生产环境 source map（用于错误追踪，不暴露源码）
  devtool: "hidden-source-map",

  output: {
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename:
      "static/js/[name].[contenthash:8].chunk.js", // 异步 chunk 命名
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },

  plugins: [
    // 构建进度条
    new WebpackBar({
      name: packageJson.name,
      color: "#36cfc9", // 生产用青色区分
    }),

    // Source Map 输出到单独目录（dist 同级的 sourcemaps 目录）
    new webpack.SourceMapDevToolPlugin({
      filename: "../sourcemaps/[file].map",
      append: false, // 不在 JS/CSS 中添加 sourceMappingURL 注释
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename:
        "static/css/[name].[contenthash:8].chunk.css",
    }),

    // Gzip 压缩（nginx 也可以做，但预压缩更快）
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // 大于 10KB 才压缩
      minRatio: 0.8,
    }),

    // Brotli 压缩（比 gzip 更小，现代浏览器支持）
    new CompressionPlugin({
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      filename: "[path][base].br",
    }),

    // Bundle 分析（运行 ANALYZE=true pnpm build）
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多线程压缩
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console
            drop_debugger: true, // 删除 debugger
            pure_funcs: ["console.log", "console.info"], // 删除指定函数
          },
          format: {
            comments: false, // 删除注释
          },
        },
        extractComments: false, // 不生成 LICENSE.txt
      }),
      new CssMinimizerPlugin(),
    ],

    // 代码分割策略
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // React 相关库单独打包
        react: {
          name: "react-vendor",
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          priority: 20,
          chunks: "all",
        },
        // 其他第三方库
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "all",
          minSize: 0,
        },
        // 公共模块
        common: {
          name: "common",
          minChunks: 2, // 被引用 2 次以上
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },

    // Runtime 单独打包（利于缓存）
    runtimeChunk: "single",

    // 模块 ID 使用确定性算法（利于缓存）
    moduleIds: "deterministic",
  },

  // 性能提示
  performance: {
    hints: "warning",
    maxEntrypointSize: 250 * 1024, // 入口文件 250KB 警告
    maxAssetSize: 250 * 1024, // 单个资源 250KB 警告
  },
});
