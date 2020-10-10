import React, { PureComponent } from 'react'
import { RegisterComponent } from 'biz-nebula-ui'

/**
 * 自定义nebula组件 用于列表弹框和页面
 * 接受props属性 
 * listContext 当前列表上下文
 * listContext.record 当前列表选中行数据
 */
@RegisterComponent.toList('CrmListModal','crm弹框内容')
class CrmListModal extends PureComponent<any,any>{
    //内置保存回调
    save(closeRefresh){
        //保存数据

        //调用弹框关闭 并刷新表格
        closeRefresh && closeRefresh();
    }
    render(){
        let {listContext={}}=this.props;
        return <span>{JSON.stringify(listContext.record)}</span>
    }
}

export default CrmListModal