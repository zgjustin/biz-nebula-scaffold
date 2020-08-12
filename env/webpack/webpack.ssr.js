const webpack = require('webpack')
const resolve = require('../utils/paths')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const chalk = require('chalk')
const createHappyPlugin = (id, loaders) => {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool
  })
}
const WebpackBase = require('webpack');
const IgnorePlugin = WebpackBase.IgnorePlugin;

module.exports = {
  mode: 'production',
  entry: {
    index: [resolve('src/ssrEntry/index.tsx')]
  },
  output: {
    publicPath: '',
    path: resolve('ssr-dist'),
    chunkFilename: 'scripts/[name].js',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.less', '.svg'],
    alias: {
      '@': resolve('src'),
      components: resolve('src/components'),
      decorator: resolve('src/decorator'),
      http: resolve('src/http'),
      mock: resolve('src/mock'),
      model: resolve('src/model'),
      restful: resolve('src/restful'),
      router: resolve('src/router'),
      utils: resolve('src/utils'),
      app: resolve('src/app'),
      enum: resolve('src/enum'),
      entity: resolve('src/entity')
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)?$/,
        use: 'happypack/loader?id=happy-babel',
        exclude: /node_modules/,
        // include:[/nebula-ui/,/src\/*/]
      },
      // {
      //   test: /\.(less|css)$/,
      //   use: 'happypack/loader?id=happy-css'
      // },
      {
        test: /\.(gif|jpg|png|svg)\??.*$/,
        // use: 'happypack/loader?id=happy-img'
        // 图片加载问题处理
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              name: "[name].[hash:8].[ext]",
              outputPath: "images/",
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff|eot|ttf)\??.*$/,
        use: 'happypack/loader?id=happy-font'
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
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
    // runtimeChunk:{name:'manifest'},
    // splitChunks: {
    //   chunks: "all",
    //   minSize: 30000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: true,
    //   cacheGroups: {
    //       nebula:{
    //         name:"nebula",
    //         test:/nebula\-ui/,
    //         priority:-5
    //       },
    //       vendors: {
    //           name: "vendors",
    //           test: /[\\/]node_modules[\\/]/,
    //           priority: -10
    //       },
    //       default: {
    //           name: "common",
    //           minChunks: 2,
    //           priority: -20,
    //           reuseExistingChunk: true
    //       }
    //   }
    // }
  },
  externals:{
    react:'window["nebulaLib-react"]',
    'nebula-ui':'window["nebulaLib-nebula"]',
    lodash:'window["nebulaLib-lodash"]',
    dva:'window["nebulaLib-dva"]',
    'react-monaco-editor':'window["nebulaLib-codeEditor"]'
  },
  plugins: [
    new webpack.DefinePlugin({
      packEnv:JSON.stringify('ssr')
    }),
    new IgnorePlugin(/\.(css|less)$/, /nebula-ui/),
    createHappyPlugin('happy-babel', [
      {
        loader: 'babel-loader',
        options: {
          babelrc: true,
          cacheDirectory: true
        }
      }
    ]),
    createHappyPlugin('happy-font', [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]),
    createHappyPlugin('happy-css', ['style-loader', 'css-loader', 'less-loader']),
    new ProgressBarPlugin({
      format: chalk.green('Progressing') + '[:bar]' + chalk.green(':percent') + '(:elapsed seconds)',
      clear: false,
      width: 60
    })
  ]
}
