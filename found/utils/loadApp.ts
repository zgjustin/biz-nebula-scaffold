/*
 * @Description: Please insert description
 * @Author: yangrongxin
 * @Date: 2020-07-08 16:24:15
 * @LastEditors: justin
 * @LastEditTime: 2020-07-29 16:31:57
 */ 
import appSetting from '../../app.json'
import {appendPath} from './path'
/**
 * 脚本加载完成项脚本保存 
 * 不需要重复加载
 */
const scriptLoadedData = {}

/**
 * 加载依赖的公共模块 加载完成所有的数据之后 执行设置的回调
 * @param modules 
 */
export const loadChunks = function(modules:Array<string>,callback?:Function){
    let moduleLoadPromise = [];
    modules.forEach(m=>{
        moduleLoadPromise.push(new Promise(resolve=>{
            loadChunk('dll',m,()=>{
                resolve();
            })
        }))
    })
    Promise.all(moduleLoadPromise).then(()=>{
        callback && callback();
    })
}
/**
 * 加载公共脚本
 */
export const loadChunk = function(app:string,module:string,callback?:Function){
    // let scriptUrl = `/static/apps/${app}/scripts/${module}.js`;
    let scriptUrl = appendPath(`/resource/static/apps/${app}/${module}.js?nb=${appSetting['version']}`);
    if(!scriptLoadedData[scriptUrl]){
        loadScript(scriptUrl,callback);
        return;
    }
    callback&&callback();
}
/**
 * 加载manifest脚本
 * @param app 
 */
export const loadManifest = function(app:string){
    let scriptUrl = appendPath(`/resource/static/apps/${app}/manifest.js`);
    if(!scriptLoadedData[scriptUrl]){
        loadScript(scriptUrl);
    }
}

/* 
 * 动态加载对应的脚本文件
 */
export const loadExecScript = function(app:string,module:string,path:string,callback?:Function){
    // let scriptUrl = `/static/apps/${app}/scripts/${module}.js`;
    let scriptUrl = appendPath(`/resource/static/apps/${app}/${module}.js`);
    let moduleId = module==='index'?`${app}`: `${app}_${module}`;
    //执行脚本已存在移除
    if(scriptLoadedData[scriptUrl]){
        let module = moduleId && window[moduleId];
        callback && callback(module);
        return;
    }
    let vers = '';
    if(process.env.NODE_ENV === 'production'){
        vers = appSetting['version'];
    }else{
        vers = new Date().getTime().toString();
    }
    loadScript(scriptUrl,callback,moduleId,vers);
}
/**
 * 加载执行脚本 创建一个script标签 动态注入到全局上下文中 加载对应的脚本内容
 * 使用同步加载
 */
export const loadScript = function(src:string, callback?:Function,moduleId?:string,version?:string){
    let scriptUrl = src;
    let head = document.getElementsByTagName('head');
    if(!head) return;
    let headElement = head[0];
    if(!headElement) return;
    let script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    let loadScriptUrl = scriptUrl;
    if(version){
        loadScriptUrl = `${scriptUrl}?nb=${version}`;
    }
    script.setAttribute('src',loadScriptUrl);
    script.onload = script['oneadystatechange']= function () {
        // if (this.readyState === "loaded" || this.readyState === "complete" ) {
            let module = moduleId && window[moduleId];
            // console.log('loadScript', module)
            scriptLoadedData[scriptUrl] = true;
            callback && callback(module);
            script.onload = script['oneadystatechange'] = null;
        // }
    }
    headElement.appendChild(script);
}
