/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    context: process.cwd(),
    watchOptions: {
      ignored: /node_modules/
    },
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: process.env.production ? 'static/bundle.min.[contenthash].js' : 'static/bundle.min.[hash].js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader',
              options: {transpileOnly: true}
            }
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.(ttf|woff|woff2|png|eot|svg)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'static'
          }
        },
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        eslint: true,
        useTypescriptIncrementalApi: false,
        memoryLimit: 4096,
        async: !process.env.production
      }),
      !process.env.production ? new ForkTsCheckerNotifierWebpackPlugin({
        title: 'TypeScript',
        excludeWarnings: false
      }) : null,
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ].filter(Boolean)
  }
};
