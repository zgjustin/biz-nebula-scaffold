###  引擎组件说明   ###


####  引擎表单数据录入组件  ####
props说明：
isCreatForm:boolean 是否创建表单 true调用创建表单组件，false调用打开实例表单
formStatus:boolean 是否启用无状态表单 true有状态 false无状态
cversion:string 表单版本号
isDefault:boolean 是否使用默认模版
visibilityName:string 指定可见性
formRef:(form)=>void  表单组件实例回调
code: 表单业务编码
notButton:boolean 是否显示表单按钮
notMessage:boolean 是否显示表单提交验证提示显示

创建表单 代码示例：
`js`
import AssemblyForm from 'found/components/nebula-assembly/form'
<AssemblyForm isCreatForm={true} code = {code} notButton={true} notMessage={true} formRef = {form=>this.formInstanceTarget = form}/>
//调用表单提交
this.formInstanceTarget.submit((data)=>{
    //提交成功业务逻辑处理 data为提交的数据
})

打开实例配合参数
isCreatForm为false时以下参数可用
taskCode:string 业务编码由调用者指定一个唯一的编号，一个实例一个编码
instanceId:string 实例id
onlyView:boolean 是否打开只读表单
invokeParams:object 表单提交携带参数
打开实例表单 代码示例：
import AssemblyForm from 'found/components/nebula-assembly/form'
<AssemblyForm isCreatForm={false} instanceId={instanceId} visibilityName={visibilityName} taskCode = {taskCode} notButton={true} notMessage={true} formRef = {form=>this.formInstanceTarget = form}/>
//调用表单提交
this.formInstanceTarget.submit((data)=>{
    //提交成功业务逻辑处理 data为提交的数据
})

####  引擎列表选择组件  ####
props说明：
listParams:object 列表携带参数
listParams.code: 列表code
listParams.selectAble: 是否启用表格选择 可选 'checkbox'|'radio'|false
listParams.selectedChange: (selectedKeys,selectedRow)=>void 选中行回调
listParams除了以上参数，可以自定义其他的参数作为列表引用上下文参数


代码示例：
`js`
import AssemblyList from 'found/components/nebula-assembly/list'
<AssemblyList
                listParams={{
                    code:code,
                    selectAble:'radio',
                    selectedChange:(_selectedKeys,selectedRows)=>{
                        this.selectedRow = selectedRows;
                    }
                }} />