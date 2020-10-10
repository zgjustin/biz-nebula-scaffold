import React, { PureComponent } from 'react'
import { RegisterComponent,Select } from 'biz-nebula-ui'

/**
 * 自定义nebula组件
 * 接受props属性 
 * value 受控值
 * onChange 值变更事件
 * defaultValue 组件默认值
 */
@RegisterComponent.toFilter('CrmSelect','Crm下拉框')
class CrmListSelect extends PureComponent<any,any>{
    onChange(e){
        let {onChange} = this.props;
        onChange && onChange(e);
    }
    render(){
        let {value}=this.props;
        return <Select value={value} placeholder='请选择' options={[{label:'选项1',value:'1'},{label:'选项2',value:'2'}]}></Select>
    }
}

export default CrmListSelect