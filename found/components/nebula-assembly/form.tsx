import React, { PureComponent } from 'react'
import * as LoadScriptHelper from '../../utils/loadApp'

export interface NebulaAssemblyFormState{
    /**
     * 加载数据状态
     */
    loading:boolean

    /**
     * 表单模版组件
     */
    FormComponent:any
}
/**
 * Nebula表单组件
 */
export default class NebulaAssemblyForm extends PureComponent<any,NebulaAssemblyFormState>{
    
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            FormComponent:null
        }
    }

    componentDidMount(){
        const {isCreatForm} = this.props;
        LoadScriptHelper.loadChunks(['dva','nebula','lodash'],()=>{
            LoadScriptHelper.loadExecScript('page','form',isCreatForm?'nebulaAssembly-form':'nebulaAssembly-formMain',(module)=>{
              this.setState({loading:false,FormComponent:module},()=>{
                const engineTarget = window['engine']
                if (!engineTarget) {
                    console.log('modal->init:', '没有表单实例数据信息')
                    return
                }
                engineTarget.ready = form => {
                    const {formRef} = this.props;
                    formRef && formRef(form);
                }
              });
            })
          })
    }

    render(){
        const {loading,FormComponent} = this.state;
        if(loading===true) return <div>正在加载表单模版...</div>
        return !FormComponent?<div>未找到表单模版</div>:<FormComponent {...this.props} />
    }
}