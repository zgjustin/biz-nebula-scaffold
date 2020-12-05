import React,{ReactNode} from "react"
import InnerPage from './inner-page'
import Login from './login';
import RouteRegister from '../routeRegister'
import '../assert/index.less'
if(process.env.NODE_ENV!=='production'){
    require('biz-nebula-ui/lib/style')
}

/**
 * 开发环境路由入口文件
 * @param props 
 */
function RouterConfig(props,extendRoute?:Array<{path:string,component:ReactNode|string,outerPage?:boolean,loginPage?:boolean}>) {
    let fullRoute:Array<any> = [{//登录路由
        path: '/login',
        component: Login
    }];
    //追加用户自定义 路由组件
    if(extendRoute){
        extendRoute.forEach(v=>{
            let {path,component,outerPage,loginPage} = v;
            if(loginPage){
                fullRoute.push({
                    path:path,
                    component:component
                })
            }else{
                fullRoute.push({
                    path:path,
                    component:(props)=>{
                        return <InnerPage {...props} framework={outerPage?false:true} definedComponent={component} />
                    }
                })
            }
        })
    }
    fullRoute.push({
        path: '',
        component: InnerPage
    })
    return RouteRegister(props,fullRoute)
}

export default RouterConfig
