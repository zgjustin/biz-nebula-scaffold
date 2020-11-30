import dva from 'dva';
const createBrowserHistory = require('history').createBrowserHistory;
const history = createBrowserHistory();

//使用browserHistory的模式路由
const app = dva({
    history:history,
    onError(e, _dispatch) {
        console.error('engine', e.message);
    },
});
/**
 * 检查环境是否为umd打包模式
 */
const checkEnvIsUmd=()=>{
    return packEnv==='ssr'||packEnv==='starter';
}
/**
 * 脚手架主入口文件
 * 使用dva 状态管理
 */
const start = (appEntry,foundModels)=>{
    return (models,routes)=>{
        const allModels = foundModels.concat(models||[]);
        allModels.forEach((obj:any) => app.model(obj));
        const entryRoute = (props)=>{
            return appEntry(props, routes);
        }
        app.router(entryRoute);
        try{
            let allRegCom = require['context']('../src/regComponent',false,/\.tsx$/);
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
        //umd打包模式 注入全局window中 返回dav组件给umd打包环境使用
        if(checkEnvIsUmd()){
            return app.start();
        }
        app.start('#app');
    }
}


export default start