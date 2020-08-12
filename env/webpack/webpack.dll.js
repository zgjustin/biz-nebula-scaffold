const path = require('path')
const webpack = require('webpack')
const resolve = require('../utils/paths')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const vendors = [
  'react',
  'react-dom',
  'lodash',
  'redux',
  'redux-logger',
  'axios',
  'antd',
  'react-redux',
  'redux-saga',
  'async-validator'
]
module.exports = {
  mode: 'production',
  entry: {
    base: vendors
  },
  output: {
    path: resolve('env/dll'),
    filename: '[name].dll.js',
    library: '_dll_[name]_[hash:5]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dll', 'manifest.json'),
      name: '_dll_[name]_[hash:5]',
      context: resolve('')
    })
  ]
}
