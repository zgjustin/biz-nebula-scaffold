/*
 * @Author: justin
 * @Date: 2020-08-10 19:51:32
 * @LastEditTime: 2020-09-11 11:34:14
 * @LastEditors: justin
 * @FilePath: /biz-nebula-scaffold/src/route.ts
 * @Description: 路由配置
 */ 
export default [
    {
        path:'/page1',
        component:'index'
    },
    {
        path:'/page2',
        component:'index',
        outerPage:true // 不包含页面框架
    }
]
