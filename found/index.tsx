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
    const foundModels = require('./model').default;
    const appEntry = require('./app/index').default
    const allModels = foundModels.concat(models||[]);
    allModels.forEach((obj:any) => app.model(obj));
    const entryRoute = (props)=>{
        return appEntry(props, routes);
    }
    app.router(entryRoute);
    //生产环境 注入全局window中
    if(process.env.NODE_ENV==='production'){
        window[appJson.name] = app.start();
        return;
    }
    app.start('#app');
}


export default start