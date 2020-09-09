import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'nebula-ui/lib/_restful/decorator'
/**
 * Nebula 中涉及当户相关的模块
 */
@RestFulDecorator.RestFul('nebula/users')
export default class User extends RestFulBase{
  /**
   * @description 修改当前用户的个人设置
   * @type {string}
   * @memberof User
   */
  @RestFulDecorator.Method(RestFulMethod.PATCH)
  Users_ChangeSettings: string = ""
  /**
   *
   * @description 修改当前登录人的用户密码
   * @type {string}
   * @memberof User
   */
  @RestFulDecorator.Method(RestFulMethod.PATCH)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  Users_UpdatePassword: string = "/updatePassword"

  /**
   * 用户鉴权 查询用户是否登录
   */
  @RestFulDecorator.Method(RestFulMethod.GET)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  UserFindByPrincipal : '/nebula/users/findByPrincipal'

  /**
   * 获得当前登录人的所有按钮权限
   */
  @RestFulDecorator.Method(RestFulMethod.GET)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  ButtonsFindByCurrentUser: '/nebula/buttons/findByCurrentUser'
  /**
   * 获得当前登录人的所有菜单
   */
  @RestFulDecorator.Method(RestFulMethod.GET)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  CompetencesViewItemFindByCurrentUser : '/nebula/competences/findByCurrentUser?viewItem=true'

  
}
