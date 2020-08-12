import {FoundRestFul} from '../../found/restful'
import Test from './module/test'

/**
 * 接口请求 TODO 端口需要从配置文件中拿取
 */
class RestFul extends FoundRestFul{
    
    Test = new Test().resetProperty();

}
const nebulaPromise:RestFul = new RestFul();

export default nebulaPromise