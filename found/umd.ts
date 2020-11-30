/*
 * @Author: justin
 * @Date: 2020-11-27 20:28:38
 * @LastEditTime: 2020-11-27 20:37:57
 * @LastEditors: justin
 * @FilePath: /nebula.first/found/umd.ts
 * @Description: 
 */
import entry from './entry'
import Models from '../src/model'
import routes from '../src/route'
import routeRegister from './routeRegister'
import appJson from '../app.json'

/**
 * umd环境打包 注入到全局变量
 */
window[appJson.name] = entry(routeRegister,[])(Models,routes)