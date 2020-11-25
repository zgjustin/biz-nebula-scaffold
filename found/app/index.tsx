import React,{ReactNode} from "react"
import { Route, Router, Switch } from 'dva/router';
import InnerPage from './inner-page'
import SinglePage from './single-page'
import Login from './login';
// import appRoute from '../config/route'
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'
if(packEnv!=='ssr' && packEnv!=='starter' && process.env.NODE_ENV!=='production'){
    require('biz-nebula-ui/lib/style')
}
const routes: any[] = [
    {
        path: '/build',
        lazyComponent: SinglePage
    },
    {
        path: '/build.html',
        lazyComponent: SinglePage
    },
    {
        path: '/main',
        lazyComponent: SinglePage
    },
    {
        path: '/main.html',
        lazyComponent: SinglePage
    },
    {
        path: '/list',
        lazyComponent: SinglePage
    },
    {
        path: '/engineOutList',
        lazyComponent: SinglePage
    },
    {
        path: '/listInstance',
        lazyComponent: SinglePage
    },
    {
        path: '/login',
        lazyComponent: Login
    }
]

/**
 * 路由入口文件
 * @param props 
 */
function RouterConfig(props,extendRoute?:Array<{path:string,component:ReactNode|string,outerPage?:boolean}>) {
    console.log('extend-route',extendRoute)
    let { history,route } = props;
    let rootPath = '';
    if(route){
        if(route.rootPath) rootPath = route.rootPath;
    }
    HistoryInstance.set(history,rootPath);
    let fullRoute = [];
    if(packEnv!=='ssr' && packEnv !== 'starter'){
        fullRoute = fullRoute.concat(routes);
    }
    //追加用户自定义 路由组件
    if(extendRoute){
        extendRoute.forEach(v=>{
            let {path,component,outerPage} = v;
            console.log('scaffold-component-str',component);
            let curComponent;
            if(typeof component === 'string'){
                curComponent = require(`../../src/app/${component}`).default;
                console.log('scaffold-component',curComponent);
            }else{
                curComponent = component;
            }
            // if(typeof curComponent!=='function' || curComponent!==null) return;
            if(packEnv==='ssr' || packEnv==='starter'){
                fullRoute.push({path:path,lazyComponent:curComponent})
            }else{
                fullRoute.push({path:path,lazyComponent:(props)=>{
                    return <InnerPage {...props} framework={outerPage?false:true} definedComponent={curComponent} />
                }})
            }
        })
    }
    if(packEnv!=='ssr' && packEnv!=='starter'){
        fullRoute.push({
            path: '',
            lazyComponent: InnerPage
        })
    }
    return <Router history={HistoryInstance.get()}>
        <Switch>
            {fullRoute.map(v=> <Route key={v.path} path={HistoryInstance.appendRootPrex(v.path)} component={v.lazyComponent} />)}
        </Switch>
    </Router>
}

export default RouterConfig
