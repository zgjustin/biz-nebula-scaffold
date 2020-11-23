/*
 * @Author: justin
 * @Date: 2020-11-23 07:12:00
 * @LastEditTime: 2020-11-23 07:14:46
 * @LastEditors: justin
 * @FilePath: /nebula.first/env/publish/routeConfig.js
 * @Description: 
 */
const path = require('path')
require("ts-node/register");
module.exports = require(path.join(process.cwd(), 'src/route.ts'));