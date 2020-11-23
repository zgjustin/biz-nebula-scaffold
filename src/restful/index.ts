import {FoundRestFul} from '../../found/restful'
import Test from './module/test'
import Rules from './module/rules'
import Nebula from './module/nebula'


/**
 * 接口请求 TODO 端口需要从配置文件中拿取
 */
class RestFul extends FoundRestFul{
    constructor(url?:string){
        super(url);
    }
    Test = new Test().resetProperty();
    //规则 模块
    Rules = new Rules().resetProperty();
    //Nebula 相关模块
    Nebula2 = new Nebula().resetProperty();

}
const nebulaPromise:RestFul = new RestFul();

export default nebulaPromise