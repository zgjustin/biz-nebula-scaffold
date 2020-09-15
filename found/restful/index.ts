import NebulaRestFul from 'biz-nebula-ui/lib/_restful'
import User from './module/user'
import Position from './module/position'
import Router from '../utils/router'
import Theme from './module/theme'
import {baseURL} from '../http'

/**
 * 登录信息丢失跳转
 * @param url 
 */
function loginLose(url:string){
    if(url){
        window.location.href=url;
        return;
    } 
    Router.push('/login');
}

/**
 * 接口请求
 */
export class FoundRestFul extends NebulaRestFul{
    constructor(url?:string,timeout?:number,fail?:(url:string)=>void){
        super(typeof(url)==='undefined'?baseURL:url,timeout||60000,fail||loginLose,true);
    }
    User = new User().resetProperty();
    Position = new Position().resetProperty();
    Theme = new Theme().resetProperty();

}
const nebulaFoundPromise:FoundRestFul = new FoundRestFul();

export default nebulaFoundPromise