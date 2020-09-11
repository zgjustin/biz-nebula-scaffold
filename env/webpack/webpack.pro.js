const merge = require('webpack-merge')
const ssrConfig = require('./webpack.ssr')
const appSetting = require('../../app.json')
const resolve = require('../utils/paths')

const rootPath = appSetting.rootPath||'';
ssrConfig.entry={
  index: ['@babel/polyfill', resolve('src/index.tsx')]
}
ssrConfig.output = merge(ssrConfig.output,{
  publicPath: rootPath+'/',
  path: resolve(`env/resource/static/apps/${appSetting.name}`)
})
module.exports = ssrConfig;
