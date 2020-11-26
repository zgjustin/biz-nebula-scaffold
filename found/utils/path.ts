/*
 * @Description: 
 * @Author: justin
 * @Date: 2019-12-09 11:54:08
 * @LastEditors: justin
 * @LastEditTime: 2020-11-26 14:28:40
 */
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'
/**
 * 追加给定的多个路径
 * @param path 路径多个
 */
export function appendPath(path:string){
    return HistoryInstance.appendRootPrex(path);
}

/**
 * 移除根目录
 * @param path 目标路径
 */
export function removePath(path:string){
    if(!path){
        return path;
    }   
    let root = HistoryInstance.appendRootPrex(''); //appSetting.rootPath;
    if(!root){
        return path;
    } 
    //根目录是否/结束去掉
    const isRemoveLastChart = root.lastIndexOf('/');
    if(isRemoveLastChart) root = root.substr(0,root.length-1);
    if(!root) {
        return path;
    }
    let rootIndex = path.indexOf(root);
    if(rootIndex<0) {
        return path;
    }
    return path.substring(rootIndex+root.length);
}