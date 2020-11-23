import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'biz-nebula-ui/lib/_restful/decorator'
/**
 * Nebula模块 API
 */
@RestFulDecorator.RestFul('nebula')
export default class Nebula extends RestFulBase{

     /**
      * @description 保存图片的方法
      * @type {string}
      * @memberof Nebula
      */
     @RestFulDecorator.Method(RestFulMethod.POST)
     Image_Upload: string = "/files/images/fileImageUpload"

    /**
     * 查询组织信息
     */
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    Org_Findall: string = "/orgs/findAll";

    /**
     * 修改组织状态
     */
    @RestFulDecorator.Method(RestFulMethod.PATCH)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    Org_UpdateStatus: string = "/orgs/updateStatus";

    /**
     * 拿取鉴权信息
     */
    @RestFulDecorator.Method(RestFulMethod.GET)
    UserFindByPrincipal = "/users/findByPrincipal";
    /**
     * 拿取用户信息
     */
    @RestFulDecorator.Method(RestFulMethod.GET)
    FindUser = "/roles/findByUserId";


    //Nebula关联设定 重置指定用户的密码信息
    @RestFulDecorator.Method(RestFulMethod.PATCH)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    Nebula_UsersUpdatePassword: string = '/users/updatePassword';


    //
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    FindRuleByConditions: string = '/codeRules/findAllByConditions';

    //查询数据源列表
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    FindDataSourceList: string = '/dataSources'

    //通过数据源code,查询数据视图列表
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    FindDataViewByCode: string = '/dataViewGroups/findDetailsByDataSource'


    //通过数据源code,查询数据视图详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    FindViewDetailsByCode: string = '/dataViews/findDetailsByCode'

    //通过name,查询服务源详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    FindDataSourceDetailsByName: string = '/servicableMethods/findDetailsByName'

    //查询服务源列表
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    FindServiceDataSourceList: string = '/servicableMethods/findByConditions'

    //添加groovy脚本
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    SaveScript: string = '/scripts'

    //更新groovy脚本
    @RestFulDecorator.Method(RestFulMethod.PATCH)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    UpdateScript: string = '/scripts/update'

    //查询groovy脚本列表
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    ScriptList: string = '/scripts/findByConditions'

    //查询groovy脚本详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    GetScriptCode: string = '/scripts/findContentById'

    //查询数据字典

    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    DictFindByCode: string = '/dictItems/findByCode'

}
