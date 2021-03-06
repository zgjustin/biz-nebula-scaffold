/*
 * @Author: justin
 * @Date: 2020-07-29 16:49:10
 * @LastEditTime: 2020-11-26 11:55:29
 * @LastEditors: justin
 * @FilePath: /nebula.first/found/data/theme.ts
 * @Description: 主题管理 加载主题
 */ 
import Restful from '../restful'
import {baseURL} from '../http'
import {appendPath} from '../utils/path'
import less from 'less'
/**
 * 拼接后端图片路径
 */
const appendImagePath=(url:string)=>{
    if(!url) return;
    return `${baseURL}/venus/images${url}`
}
class ThemeManage {
    /**
     * 从后端接口加载主题数据
     */
    static async getThemeData(){
        const themeData = await Restful.GetApiPromise(Restful.Theme.FindTheme);
        if(themeData){
            const {logo,small_logo,background,system_icon} = themeData;
            themeData.system_icon = system_icon && appendImagePath(system_icon);
            themeData.background = background && appendImagePath(background);
            themeData.logo = logo && appendImagePath(logo);
            themeData.small_logo = small_logo && appendImagePath(small_logo);
        }
        return themeData;
    }
    /**
     * 根据后端主题配置装载布局信息
     */
    static async loadSystemLayout(themeData?:any){
        if(!themeData){
            themeData = await this.getThemeData();
        }
        if(!themeData) return;
        //加载布局信息
        // const {logo,_small_logo,system_icon,system_title,color} = themeData;
        const {logo,system_icon,system_title,color} = themeData;
        //变更系统标题
        if(system_title){
            let titleElement = document.head.querySelector('title');
            if(titleElement){
                titleElement.innerHTML = system_title;
            }
        }
        //变更系统icon
        if(system_icon){
            let sysIconElement = document.head.querySelector('link[rel]');
            if(sysIconElement){
                sysIconElement.setAttribute('href',system_icon);
            }
        }
        //变更系统logo
        if(logo){
            let logoElement:any = document.body.querySelector('.nebula-layout-header .nebula-layout-logo');
            if(logoElement){
                logoElement.style.setProperty('background-image', `url("${logo}")`)
            }
        }
        //变更主题
        await this.loadTheme(color);
    }
    /**
     * 根据后端主题配置装载主题样式
     */
    static async loadTheme(color){
        //生成样式文件
        const themeVar = color && color.variables;
        let themeVarString = '';
        if(themeVar){
            themeVarString = Object.entries(themeVar).map(([k,v])=>`${k}:${v}`).join(';');
        }
        let defaultVar = appendPath('/resource/static/theme/less/default.less');
        let systemStyle = appendPath('/resource/static/theme/less/index.less');
        let lessLoadExpress = `@import '${defaultVar}';${themeVarString};@import '${systemStyle}';`;
        let newCss:string = await new Promise((resolve)=>{
            less.render(lessLoadExpress,{javascriptEnabled:true},(error:any,out:any)=>{
                if(error){
                    console.error('less render:',error);
                    resolve();
                    return;
                }
                resolve(out.css);
            })
        })
        if(!newCss) return;
        let styleElement = document.head.querySelector('style[id="theme_setting_style"]');
        if(!styleElement){
            styleElement = document.createElement('style');
            styleElement.setAttribute('type','text/css');
            styleElement.setAttribute('id','theme_setting_style');
            document.head.appendChild(styleElement)
        }
        styleElement.innerHTML = newCss;
    }
}

export default ThemeManage
