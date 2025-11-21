const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolvePath = (relativePath) => path.resolve(__dirname, '..', relativePath);

module.exports = {
  entry: resolvePath('src/index.tsx'),
  output: {
    path: resolvePath('dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    assetModuleFilename: 'static/media/[name].[hash][ext][query]',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': resolvePath('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('public/index.html'),
    }),
  ],
  stats: 'minimal',
};
