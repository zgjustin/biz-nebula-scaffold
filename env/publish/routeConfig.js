/*
 * @Author: justin
 * @Date: 2020-11-23 07:12:00
 * @LastEditTime: 2020-11-27 14:32:49
 * @LastEditors: justin
 * @FilePath: /nebula.first/env/publish/routeConfig.js
 * @Description: 
 */
const path = require('path')
const tsConfig = require('../../tsconfig.json')
tsConfig.compilerOptions.module='commonjs'
require("ts-node").register(tsConfig);
module.exports = require(path.join(process.cwd(), 'src/route.ts'));