const merge = require('webpack-merge')
const resolve = require('../utils/paths')
const config = require('./basic.config')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
//TODO 编译uglifyjs不能编译es6 替换为terser 压缩打包, 兼容问题，不兼容Es6的环境处理
const UglifyJsPlugin = require('terser-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const appSetting = require('../../app.json')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const rootPath = appSetting.rootPath||'';
const env = 'production'
module.exports = merge(config(env), {
  mode: env,
  entry: {
    app: ['@babel/polyfill', resolve('src/index.tsx')]
  },
  output: {
    publicPath: rootPath+'/'
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: rootPath
            }
          },
          'css-loader',
          {
            loader: 'less-loader', 
            options: {
              javascriptEnabled: true 
            }
          }
        ]
      }
    ]
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    runtimeChunk: { name: 'scripts/manifest' }, // 打包 runtime 代码
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        // cssProcessor: require('cssnano'),
        // 避免打包时对css中zIndex重新计算导致浮窗不能出现
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
        // canPrint: true
      }),
      new UglifyJsPlugin({
        cache:true,
        parallel: true,
        terserOptions:{
          ecma:8,
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|svg|css|png)$/,
      threshold: 10240,
      minRatio: 0.8
      // deleteOriginalAssets:true
    })
  ]
})
