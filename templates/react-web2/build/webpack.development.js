const path = require("path");
const { merge } = require("webpack-merge");
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");
const notifier = require("node-notifier");
const baseConfig = require("./webpack.base");
const packageJson = require("../package.json");

const devPort = 5173;

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    filename: "static/js/[name].js",
  },
  devServer: {
    port: devPort,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "../public"),
    },
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: packageJson.name,
      color: "#61dafb",
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `${packageJson.name} running at: http://localhost:${devPort}`,
        ],
      },
      onErrors: (severity, errors) => {
        if (severity !== "error") return;
        notifier.notify({
          title: "Build Error",
          message: `${errors[0].name}\n${
            errors[0].file || ""
          }`,
        });
      },
      clearConsole: true,
    }),
  ],
  stats: "none", // 关闭默认输出
});
