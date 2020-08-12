import {Component} from 'react'
import {appendPath} from '../../utils/path'
const historyKey = Symbol('history-key');
const instanceKey = Symbol('history-instance-key');
const overrideHistoryKey = Symbol('history-overrid-key');

const history=<T extends {new(...args:any[]):Component<any,any>}>(constructor:T)=>{
    return class extends constructor {
        constructor(...props:any[]){
            super(props);
            this.state={
                ...this.state,
                history:HistoryInstance.get()
            }
            HistoryInstance.listen(this._changeHistory.bind(this));
        }
        _changeHistory(){
            const historyInfo = HistoryInstance.get();
            this.setState({history:{...historyInfo}})
        }
        componentWillUnmount(){
            super.componentWillUnmount && super.componentWillUnmount();
            HistoryInstance.removeListen(this._changeHistory);
        }
    }
} 

class HistoryStore {
    static getInstance(){
        if(!HistoryStore[instanceKey]){
            HistoryStore[instanceKey] = new HistoryStore();
        }
        return HistoryStore[instanceKey]
    }
    /**
     * 注入history  单一实例
     * @param hisotry 
     */
    set(history){
        this[historyKey] = history;    
    }
    _filterPath(route){
		const historyInfo = this[historyKey];
		let url = '';
		if(typeof route==='string')
			url = route;
		else if(typeof route==='object'){
			url = route.pathname;
		}
		//路由url相同不做路由追加
		if(historyInfo.location.pathname===url) return;
		if(url)
			url = appendPath(url);
		if(typeof route==='string')
			route = url;
		else if(typeof route==='object')
			route.pathname = url;
		return route;
	}
    /**
     * 获得history
     */
    get(){
        const historyInfo = this[historyKey];
		//重写 history的push 处理路由
		if(!this[overrideHistoryKey]){
			this[overrideHistoryKey] = true;
			const pushMethod = historyInfo.push;
			historyInfo.push = (route:any,...other)=>{
				route = this._filterPath(route);
				pushMethod(route,...other);
			}
			const replaceMethod = historyInfo.replace;
			historyInfo.replace = (route:any,...other)=>{
				route = this._filterPath(route);
				replaceMethod(route,...other);
			}
		}
        return this[historyKey];
    }
    /**
     * 监听方法
     */
    listen(fn){
        if(!this['listens']) 
            this['listens']=[];
        this['listens'].push(fn);
    }
    /**
     * 移除监听方法
     */
    removeListen(fn){
        if(!this['listens']) return;
        let index = this['listens'].findIndex(v=>v===fn);
        this['listens'].splice(index,1);
    }
    /**
     * 观察者
     */
    observer(){
        if(!this['listens']) return;
        this['listens'].forEach(v=>{
            if(!v) return;
            v();
        })
    }
}
export const HistoryInstance:HistoryStore = HistoryStore.getInstance()

export default history;