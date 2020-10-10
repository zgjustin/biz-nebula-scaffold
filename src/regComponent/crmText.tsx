import React, { PureComponent } from 'react'
import { RegisterComponent } from 'nebula-ui'

/**
 * 自定义nebula组件
 * 接受props属性 
 * value 受控值
 * onChange 值变更事件
 * defaultValue 组件默认值
 * placeholder 水印提示信息
 * guide 验证错误提示
 * field 控件对应后端字段
 * form 表单对象
 * onClick
 * onMouseOver
 * onMouseOut
 * controls
 */
@RegisterComponent.toFrom('CrmText','Crm文本')
class CrmText extends PureComponent<any,any>{
    onChange(e){
        let {onChange} = this.props;
        onChange && onChange(e);
    }
    render(){
        let {value,field}=this.props;
        return <span onClick={this.props.onClick}>{field}-{value}</span>
    }
}

export default CrmText