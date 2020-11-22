import React,{ReactNode} from "react"
import { Route, Router, Switch } from 'dva/router';
import {appendPath} from '../utils/path'
import InnerPage from './inner-page'
import SinglePage from './single-page'
import Login from './login';
// import appRoute from '../config/route'
import 'biz-nebula-ui/lib/style'
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'
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
    let { history } = props;
    HistoryInstance.set(history,appendPath(''));
    let fullRoute = [].concat(routes);
    //追加用户自定义 路由组件
    if(extendRoute){
        extendRoute.forEach(v=>{
            let {path,component,outerPage} = v;
            let curComponent;
            if(typeof component === 'string'){
                curComponent = require(`../../src/app/${component}`).default;
            }else{
                curComponent = component;
            }
            // if(outerPage){
            //     fullRoute.push({path:path,lazyComponent:curComponent})
            // }else{
            fullRoute.push({path:path,lazyComponent:(props)=>{
                return <InnerPage {...props} framework={outerPage?false:true} definedComponent={curComponent} />
            }})
            // }
        })
    }
    fullRoute.push({
        path: '',
        lazyComponent: InnerPage
    })
    return <Router history={HistoryInstance.get()}>
        <Switch>
            {fullRoute.map(v=> <Route key={v.path} path={appendPath(v.path)} component={v.lazyComponent} />)}
        </Switch>
    </Router>
}

export default RouterConfig
