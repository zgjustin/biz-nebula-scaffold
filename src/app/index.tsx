/*
 * @Author: justin
 * @Date: 2020-04-24 09:21:06
 * @LastEditTime: 2020-09-21 11:34:06
 * @LastEditors: justin
 * @FilePath: /nebula2/src/app/index.tsx
 * @Description: 工程入口文件
 */ 
import React from "react";
import {Table,Input,FormModal,Modal,Select,FormItem} from 'biz-nebula-ui'
import {Select as AntSelect} from 'antd'
import RestFul from 'restful'

class ChildModal extends FormModal{
    renderFormItem(){
        let {name} = this.state.paramData;
        console.log(name)
        return <FormItem name='name' label='选择' required={true}>
            <AntSelect 
            placeholder='选择'
            value={name}
                >
                <AntSelect.Option value='1'>男</AntSelect.Option>
                <AntSelect.Option value='2'>女</AntSelect.Option>
            </AntSelect>
            </FormItem>
    }
}

export default ()=>{
    let child:FormModal;
    const showModal = ()=>{
        FormModal.form({
            title:'测试弹框',
            controls:[
                {control:Input,label:'姓名',name:'name',placeholder:'用户名',required:true,rules:[]},
                {control:Select,label:'选择',name:'name',placeholder:'选择',required:true,rules:[],promise:()=>{
                return RestFul.GetApiPromise(RestFul.Nebula2.DictFindByCode,{dictCode:'sex'}).then(result=>{
                     return result.map(v=>({label:v.dictKey,value:v.dictValue}))
                 })
             }}
            ]
        }).show();
    } 
    
    const show2 =()=>{
        Modal.create({
            title:'自定义模版',
            openMode:1,
            children:<div>哈哈哈</div>,
            buttons:[
                {name:'btn1',modalButtonType:0 ,icon:'lib7-atm-away',text:'按钮1'}
            ]
        })
    }
    return <React.Fragment><Table 
    promise={(search)=>{
        return RestFul.GetApiPromise(RestFul.Nebula2.DictFindByCode,{dictCode:'sex'}).then(result=>{
            return result.map(v=>({name:v.dictKey,title:v.dictValue}))
        });
    }}
    searchItem={[
        {control:Input,label:'姓名',name:'name',placeholder:'用户名',required:true,rules:[]},
        {control:Select,label:'选择',name:'name',placeholder:'选择',required:true,rules:[],promise:()=>{
           return RestFul.GetApiPromise(RestFul.Nebula2.DictFindByCode,{dictCode:'sex'}).then(result=>{
                return result.map(v=>({label:v.dictKey,value:v.dictValue}))
            })
        }},
]} 
    buttons={[{name:'btn1',icon:'lib7-atm-away',onClick:()=>{show2()},text:'按钮1'}]}
    columnBtn={[{name:'btn1',text:'按钮1',showText:true,onClick:(record,index)=>{
        alert(JSON.stringify(record))
    }}]}
    columns={[{name:'name',sort:true,title:'名称',dictCode:'xxx'},{name:'title',title:'名称',dictCode:'xxx'}]}/>
    <ChildModal ref={node=>child=node}></ChildModal>
    </React.Fragment>
}
