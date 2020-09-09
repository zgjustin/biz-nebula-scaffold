import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'nebula-ui/lib/_restful/decorator'
/**
 * Nebula 中涉及当户相关的模块
 */
@RestFulDecorator.RestFul('nebula/position')
export default class User extends RestFulBase{
  /**
   * @description 切换当前登录人所属的岗位
   * @type {string}
   * @memberof Position
   */
  @RestFulDecorator.Method(RestFulMethod.POST)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  Position_ChangePosition: string ='/changePosition'
}