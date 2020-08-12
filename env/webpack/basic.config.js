const webpack = require('webpack')
const resolve = require('../utils/paths')
const HtmLWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// const devMode = process.env.NODE_ENV !== 'production'
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')
const HappyPack = require('happypack')
const appConfig = require('../../app.json')
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

module.exports = function (env) {
  const rootPath = env !== 'production' ? '': (appConfig.rootPath||'');
  return {
    output: {
      filename: '[name].[hash:8].js',
      chunkFilename: 'scripts/[name].[hash:8].chunk.js',
      path: resolve('build'),
      publicPath: rootPath+'/'
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
        entity: resolve('src/entity'),
      }
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts|js)?$/,
          use: 'happypack/loader?id=happy-babel',
          exclude: /node_modules/
        },
        {
          test: /\.(gif|jpg|png|svg)\??.*$/,
          // use: 'happypack/loader?id=happy-img'
          use: [
            {
              loader: "url-loader",
              options: {
                esModule: false,
                name: "[name].[hash:8].[ext]",
                outputPath: `./resource/images/`,
                publicPath: `${rootPath}/resource/images/`,
                limit: 2000
              }
            }
          ]
        },
        {
          test: /\.(woff|eot|ttf)\??.*$/,
          use: 'happypack/loader?id=happy-font'
        }
      ]
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new webpack.ProvidePlugin({}),
      new HtmLWebpackPlugin({
        template: resolve('env/templete/index.html'),
        filename: 'index.html',
        inject: 'body',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true
        }
      }),
  
      new CopyPlugin([
        {
          from: './env/resource',
          to: './resource'
        },
        {
          from: './found/http/webSiteConfig.js',
          to: './siteConfig.js'
        }
      ]),
      createHappyPlugin('happy-babel', [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            cacheDirectory: true
          }
        }
      ]),
      createHappyPlugin('happy-img', [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: `./resource/images/`,
            publicPath: `${rootPath}/resource/images/`
          }
        }
      ]),
      createHappyPlugin('happy-font', [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: `./resource/fonts/`,
            publicPath: `${rootPath}/resource/fonts/`
          }
        }
      ]),
      createHappyPlugin('happy-css', ['style-loader', 'css-loader',
      {
        loader: 'less-loader', 
        options: {
          javascriptEnabled: true 
        }
      }]),
      new MonacoWebpackPlugin(
        {
          languages: ['javascript', 'typescript', 'xml', 'mysql','sql', 'json','html', 'java'],
          filename: `./static/editor/[name].worker.js`
        }
      ),
      new ProgressBarPlugin({
        format: chalk.green('Progressing') + '[:bar]' + chalk.green(':percent') + '(:elapsed seconds)',
        clear: false,
        width: 60
      })
    ]
  }
}
