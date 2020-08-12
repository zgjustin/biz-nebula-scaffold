/*
 * @Author: justin
 * @Date: 2020-07-29 16:57:44
 * @LastEditTime: 2020-07-29 16:59:27
 * @LastEditors: justin
 * @FilePath: /biz.nebula/nebula.starter/src/restful/module/theme.ts
 * @Description: 主题相关API接口
 */ 
import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'biz-nebula-ui/lib/_restful/decorator'

@RestFulDecorator.RestFul('nebula/theme')
export default class User extends RestFulBase{
  /**
   * @description 查询主题配置
   * @type {string}
   * @memberof User
   */
  @RestFulDecorator.Method(RestFulMethod.GET)
  FindTheme: string = "/findTheme"
  
}