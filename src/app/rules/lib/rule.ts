//数据类型
export const HandType = {
    1:"服务源",
    2:"数据视图(聚合)",
    3:"groovy脚本",
    5:"全动态"
}

//节点类型
export const NodeType = {
    1: "判定组件",
    2: "逻辑组件",
    3: "锁组件",
    4: "开始组件",
    5: "结束组件",
    6: "异常组件",
};

//参数-数据类型
export const ParamType = {
    'java.lang.Chart': 'chart',
    'java.lang.Long': 'long',
    'java.lang.Int':'int',
    'java.lang.Float':'float',
    'java.lang.Boolean':'boolean',
    'java.lang.Double':'double',
    'java.lang.Short':'short',
    'java.lang.Byte':'byte',
    'java.lang.String':'string',
    'java.util.Map':'object',
    'java.util.Array':'collection'
}
//节点类型-数据类型-对应的处理类
export const RuleableClass = {
    "1": "com.bizunited.platform.mars.service.rule.conditions.SimpleConditionRuleable",
    "2_1": "com.bizunited.platform.mars.service.rule.processes.ServicableProcessRuleable",
    "2_2": "com.bizunited.platform.mars.service.rule.processes.DataviewAggregateProcessRuleable",
    "2_3": "com.bizunited.platform.mars.service.rule.processes.DynamicGroovyScriptProcessRuleable",
    "2_5": "com.bizunited.platform.mars.service.rule.processes.DynamicGroovyScriptProcessRuleable",
    "3_1": "com.bizunited.platform.mars.service.rule.end.SimpleEndRuleable",
    "3_2": "com.bizunited.platform.mars.service.rule.end.SimpleEndRuleable",
    "3_3": "com.bizunited.platform.mars.service.rule.end.SimpleEndRuleable",
    "3_5": "com.bizunited.platform.mars.service.rule.end.SimpleEndRuleable",
    "4": "com.bizunited.platform.mars.service.rule.start.SimpleStarterRuleable",
    "5": "com.bizunited.platform.mars.service.rule.end.SimpleEndRuleable",
    "6": "异常组件",
}


