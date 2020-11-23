import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'biz-nebula-ui/lib/_restful/decorator'
/**
 * 规则模块 API
 */
@RestFulDecorator.RestFul("")
export default class Rules extends RestFulBase{
    //查询所有规则
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    FindRulesALL: string = '/ruleDefinitions/findAll'

    //按状态-查询所有分组
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findByGroupStatus: string = '/ruleTemplateGroups/findByGroupStatus'

    //按类型-查询所有分组
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findByType: string = '/ruleTemplateGroups/findByType'


    //
    //按照 分组／类型 查询模版节点
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findByTemplateGroupAndStatusAndType: string = '/ruleTemplateNodes/findByTemplateGroupAndStatusAndType'

    //保存--模版节点
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    SaveRuleTemplateNodes: string = '/ruleTemplateNodes'

    //更新--模版节点
    @RestFulDecorator.Method(RestFulMethod.PATCH)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    UpdateRuleTemplateNodes: string = '/ruleTemplateNodes'

    //查询--通过id模版节点详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    FindTemplateDetailsById: string = '/ruleTemplateNodes/findDetailsById'

    //查询-通过code模版节点详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    FindTemplateDetailsByCode: string = '/ruleTemplateNodes/findByCode'


    //模版节点移至分组
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    BindTemplateGroup: string = '/ruleTemplateNodes/bindTemplateGroup'

    //模版节点移除分组
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    UnBindTemplateGroup: string = '/ruleTemplateNodes/unbindTemplateGroups'

    //添加分组
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.JSON)
    addGroup: string = '/ruleTemplateGroups'

    //根据code,version查询，查询某一规则
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findDetailsByCodeAndVersion: string = '/runtimeDefinitions/findDetailsByCodeAndVersion'

    //根据code,version查询，查询某一规则
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findContentByCodeAndVersion: string = '/ruleDefinitions/findContentByCodeAndVersion'




    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findFileByPath: string = '/venus/files/findByFileNameAndRelativeLocal'


    //根据code,version查询，查询某一规则
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    processDefinitions: string = '/runtimeDefinitions/process'



    //根据分组code,查询分组
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findGroupByCode: string = '/ruleTemplateGroups/findByCode'

    //根据分组ID,查询分组详情
    @RestFulDecorator.Method(RestFulMethod.GET)
    @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
    findGroupDetailsById: string = '/ruleTemplateGroups/findDetailsById'

    //生成规则
    @RestFulDecorator.Method(RestFulMethod.POST)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    RuntimeDefinitions: string = '/runtimeDefinitions'

    //更新规则
    @RestFulDecorator.Method(RestFulMethod.PATCH)
    @RestFulDecorator.ContentType(RestFulContentType.FORMDATA)
    UpdateRuntimeDefinitions: string = '/runtimeDefinitions'
}
