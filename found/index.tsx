/**
 * 开发环境入口文件
 */
import entry from './entry'
import dva from 'dva';
import react from 'react'
import reactDom from 'react-dom'
import * as reactIs from 'react-is';
import * as history from 'history'
import axios from 'axios'
import * as ReactRouterRedux from 'react-router-redux'
import * as ReactRouterDom from 'react-router-dom'
import less from 'less'
/**
 * 入口注入 UMD全局变量
 */
window["nebulaLib-react"] = react;
window["nebulaLib-reactDom"] = reactDom;
window["nebulaLib-reactIs"] = reactIs;
window["nebulaLib-history"] = history;
window["nebulaLib-axios"] = axios;
window["nebulaLib-reactRouterRedux"] = ReactRouterRedux
window["nebulaLib-reactRouterDom"] = ReactRouterDom
window["nebulaLib-less"]=less
window["nebulaLib-dva"]=dva

export default entry(require('./app/index.tsx').default,require('./model/index.ts').default)