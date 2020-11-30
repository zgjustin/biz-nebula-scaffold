import React,{ReactNode} from "react"
import { Route, Router, Switch } from 'dva/router';
// import appRoute from '../config/route'
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'

/**
 * 路由入口文件
 * @param props 
 */
function RouterRegister(props,extendRoute?:Array<{path:string,component:ReactNode|string,outerPage?:boolean}>) {
    let { history,route } = props;
    let rootPath = '';
    if(route){
        if(route.rootPath) rootPath = route.rootPath;
    }
    HistoryInstance.set(history,rootPath);
    let fullRoute = [];
    //追加用户自定义 路由组件
    if(extendRoute){
        extendRoute.forEach(v=>{
            let {path,component} = v;
            let curComponent;
            if(typeof component === 'string'){
                curComponent = require(`../src/app/${component}`).default;
            }else{
                curComponent = component;
            }
            fullRoute.push({path:path,lazyComponent:curComponent})
        })
    }
    return <Router history={HistoryInstance.get()}>
        <Switch>
            {fullRoute.map(v=> <Route key={v.path} path={HistoryInstance.appendRootPrex(v.path)} component={v.lazyComponent} />)}
        </Switch>
    </Router>
}

export default RouterRegister
