import React, { PureComponent } from 'react'
import * as LoadScriptHelper from '../../utils/loadApp'

export interface NebulaAssemblyListState{
    /**
     * 加载数据状态
     */
    loading:boolean

    /**
     * 表单模版组件
     */
    ListComponent:any
}
/**
 * Nebula列表组件
 */
export default class NebulaAssemblyList extends PureComponent<any,NebulaAssemblyListState>{
    
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            ListComponent:null
        }
    }

    componentDidMount(){
        LoadScriptHelper.loadChunks(['dva','nebula','lodash'],()=>{
            LoadScriptHelper.loadExecScript('page','list','nebulaAssembly-list',(module)=>{
              this.setState({loading:false,ListComponent:module});
            })
          })
    }

    render(){
        const {loading,ListComponent} = this.state;
        if(loading===true) return <div>正在加载列表模版...</div>
        return !ListComponent?<div>未找到列表模版</div>:<ListComponent {...this.props} />
    }
}