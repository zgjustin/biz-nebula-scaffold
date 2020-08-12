/*
 * @Description:
 * @Author: justin
 * @Date: 2019-12-03 11:19:57
 * @LastEditors: justin
 * @LastEditTime: 2020-08-06 14:20:13
 */
// const fs = require('fs')
const merge = require('webpack-merge')
const resolve = require('../utils/paths')
const webpack = require('webpack')
const config = require('./basic.config')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const appConfig = require('../../app.json')
const devConf = {
  host: '0.0.0.0',
  port: 9512
}
const openHost = `http://localhost:${devConf.port}`
const proxyHost = 'http://139.9.236.174:5900'
const rootPath =  '';
const env = 'development';
module.exports = merge(config(env), {
  // 模式
  mode: env,
  entry: {
    app: resolve('src/index.tsx')
  },
  output: {
    publicPath: rootPath
  },
  devServer: {
    contentBase: resolve('dist'),
    historyApiFallback: true,
    inline: true,
    quiet: true,
    overlay: true,
    hot: true,
    open: true,
    openPage: openHost,
    proxy: {
      '/v1': {
        target: proxyHost,
        pathRewrite: { '^/v1': '/v1' },
        changeOrigin: true,
        secure: false
      }
    },
    ...devConf
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: 'happypack/loader?id=happy-css'
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('.././dll/manifest.json')
    }),
    new AddAssetHtmlPlugin([
      {
        publicPath: rootPath+'/dll',
        outputPath: 'dll',
        filepath: resolve('env/dll/*.js'),
        includeSourcemap: false,
        typeOfAsset: 'js'
      }
    ]),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`你好这里是你的程序地址 : ${openHost}`]
      },
      clearConsole: true
    })
  ]
})
