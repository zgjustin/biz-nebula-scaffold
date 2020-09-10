/*
 * @Author: justin
 * @Date: 2020-07-28 16:11:30
 * @LastEditTime: 2020-09-09 12:09:46
 * @LastEditors: justin
 * @FilePath: /biz.nebula/nebula.scaffold/found/utils/router.ts
 * @Description: 路由跳转
 */ 
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'
/**
 * 路由跳转统一控制
 */

export default {
    push:(url:string)=>{
        HistoryInstance.get().push(url);
    }
}
