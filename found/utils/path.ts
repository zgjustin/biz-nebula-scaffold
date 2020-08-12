/*
 * @Description: 
 * @Author: justin
 * @Date: 2019-12-09 11:54:08
 * @LastEditors: justin
 * @LastEditTime: 2020-08-04 10:28:41
 */
import appSetting from '../../app.json'

/**
 * 追加给定的多个路径
 * @param path 路径多个
 */
export function appendPath(path:string){
    let root = process.env.NODE_ENV !== 'production'?'': appSetting.rootPath;
    //根目录是否/结束去掉
    const isRemoveLastChart = root.lastIndexOf('/');
    if(isRemoveLastChart) root = root.substr(0,root.length-1);
    return root+path;
}

/**
 * 移除根目录
 * @param path 目标路径
 */
export function removePath(path:string){
    if(!path){
        return path;
    }   
    let root = appSetting.rootPath;
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