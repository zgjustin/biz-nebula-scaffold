import dva from 'dva';
import './assert/index.less'
import appJson from '../app.json'

const createBrowserHistory = require('history').createBrowserHistory;
const history = createBrowserHistory();

const app = dva({
    history:history,//使用browserHistory的模式路由
    onError(e, _dispatch) {
        console.error('engine', e.message);
    },
});
// 批量加入models
const start = (models,routes)=>{
    console.log('entry',models,routes);
    let foundModels;
    if(packEnv==='ssr'||packEnv==='starter'){
        foundModels =[];
    }else{
        foundModels = require('./model/index.ts').default;
    }
    const appEntry = require('./app/index.tsx').default;
    const allModels = foundModels.concat(models||[]);
    allModels.forEach((obj:any) => app.model(obj));
    const entryRoute = (props)=>{
        console.log('routes',routes)
        return appEntry(props, routes);
    }
    app.router(entryRoute);
    try{
        let allRegCom = require.context('../src/regComponent',false,/\.tsx$/);
        if(allRegCom){
            allRegCom = allRegCom.keys().map(key=>{
                // console.log('reg-key',key)
                return allRegCom(key).default;
            })
        }
    }catch(e){
        //没有自定义组件，直接跳过
        console.log('no-definde-components',e)
    }
    //生产环境 注入全局window中
    if(packEnv==='ssr'||packEnv==='starter'){
        window[appJson.name] = app.start();
        return;
    }
    //生产环境 注入全局window中
    // if(process.env.NODE_ENV==='production'){
    //     window[appJson.name] = app.start();
    //     return;
    // }
    app.start('#app');
}


export default start