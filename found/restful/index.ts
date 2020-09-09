import NebulaRestFul from 'nebula-ui/lib/_restful'
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
    constructor(){
        super(baseURL,60000,loginLose,true);
    }
    User = new User().resetProperty();
    Position = new Position().resetProperty();
    Theme = new Theme().resetProperty();

}
const nebulaFoundPromise:FoundRestFul = new FoundRestFul();

export default nebulaFoundPromise