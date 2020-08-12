import dva from 'dva';
import './assert/index.less'
import {HistoryInstance} from './decorator/lib/history'

const createBrowserHistory = require('history').createBrowserHistory;
const history = createBrowserHistory();

HistoryInstance.set(history);
const app = dva({
    history:history,//使用browserHistory的模式路由
    onError(e, dispatch) {
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
    app.start('#app');
}


export default start