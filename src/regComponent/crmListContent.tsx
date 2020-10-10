import React, { PureComponent } from 'react'
import { RegisterComponent,Button } from 'biz-nebula-ui'
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'

/**
 * 自定义nebula组件 用于列表弹框和页面
 * 接受props属性 
 * listContext 当前列表上下文
 * listContext.record 当前列表选中行数据
 */
@RegisterComponent.toList('CrmListContent','crm页面内容')
class CrmListModal extends PureComponent<any,any>{
    //内置保存回调
    save(closeRefresh){
        //保存数据

        //返回列表页面
        HistoryInstance.get().back();
    }
    render(){
        let {listContext={}}=this.props;
        return <>
            <span>{JSON.stringify(listContext.record)}</span>
            <Button text='保存' onClick={this.save}></Button>
        </>
    }
}

export default CrmListModal