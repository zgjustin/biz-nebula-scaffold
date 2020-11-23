import React,{ PureComponent } from 'react';
import {
    Form,
    Input,
    message,
    Select,
    Radio,
    Button, Icon
} from 'antd'

import { connect }  from "../../decorator"
import SelectDataView  from "./lib/select.dataview"
import SelectDataSource from "./lib/select.datasource"
import SelectParams from "./lib/select.params"
import SelectScript from "./lib/select.script"
import { RuleableClass } from './lib/rule';
import { getParams } from 'utils/urlParam';

import "./index.less"

const { Option } = Select;
const {TextArea} = Input;
const FormItem = Form.Item;

const  types = [{
    label: "判定组件",
    value: 1
}, {
    label: "逻辑组件",
    value: 2
}, {
    label: "锁组件",
    value: 3
}, {
    label: "开始组件",
    value: 4
}, {
    label: "结束组件",
    value: 5
}, {
    label: "异常组件",
    value: 6
}]

@connect('rules')
class Setting extends PureComponent<any,any>{

    nodelist: any = null;
    selectDataView: any = null;
    selectDataSource: any = null;

    inputForm: any = null;
    outputForm: any = null;
    scriptForm: any = null;

    constructor(props) {
        super(props);
        let urlParam = getParams(window.location.href);
        this.state = {
            id: urlParam.id || "", //编辑
            type: 2,
            sourceType: 3,
            view: {
                dataview: null,  // 数据视图
                colsFields: [], // 数据视图字段
                filterFields: [] // 数据视图系统参数
            },
            dataSource: null, //服务源
            next:true, //groovy 脚本 - 下一步标示
            script: null, //groovy 脚本
            data: null
        }
    }


    componentDidMount() {
        let { id }  = this.state;
        if(id !== "") {
            this.props.dispatch({
                type: "rules/findTemplateDetails",
                data: {
                    id: id
                },
                callback: (data) => {
                  if(data) {
                      let _state:any = {
                          type: data.type,
                          sourceType: data.sourceType
                      }

                      //脚本
                      if(data.sourceType === 3) {
                          _state.script = data.sourceScript && data.sourceScript.script ? data.sourceScript.script : null
                      }
                      //处理数据视图,输出参数
                      if(data.sourceType === 2) {
                          let { aggregateType, scale, aggregateField }  = data.sourceAggregateDataView;
                          data.outputs[0] = Object.assign({},data.outputs[0], {
                              aggregateType,
                              aggregateField,
                              scale
                          })
                      }

                      this.setState({
                          data,
                          ..._state
                      },() => {
                          //服务源
                          if(data.sourceType === 1) {
                              this.getDataSource(data.sourceServicable.servicableMethod);
                          }
                          //数据视图
                          else if(data.sourceType === 2) {
                              this.setSelectDataView(data.sourceAggregateDataView.viewCode);
                          }
                      });
                  }
                }
            });
        }
    }

    async getDataSource(name) {
        let dataSource = await this.props.dispatch({
            type: "rules/findDataSourceByName",
            name
        });

        if(!dataSource) return;
        this.setState({
            dataSource: dataSource
        });
    }

    async getDataview(code) {
        let dataview = await this.props.dispatch({
            type: "rules/findDataViewDetailsByCode",
            code
        });
        return dataview;
    }

    /**
     * 设置选中的数据视图
     * @param {数据视图} dataView
     */
    async setSelectDataView(code) {
        let dataview = await this.getDataview(code);
        if (!dataview) return;
        let { fields, systemFilters } = dataview;

        this.setState({
            view: {
                dataview: dataview,
                colsFields: fields || [],
                filterFields: systemFilters || []
            }
        });
    }

    changeDataSource = (data) => {
        this.setState({
            dataSource: data
        });
    }


    visibleDataSource (name) {
        this.selectDataSource.show(name);
    }

    visibleDataView() {
        let {
            view: { dataview }
        } = this.state;

        this.selectDataView.getWrappedInstance().showModal(dataview);
    }

    upgradeStructure = (data,type) => {
        let tmp = [];
        if(data.keys && data.keys.length) {
            data.keys.forEach((index) => {
                tmp.push({
                    paramName: data.paramName[index],
                    paramType: data.paramType[index],
                    paramDesc: data.paramDesc[index],
                    nullable: true,
                    type: type
                });
            })
        }
        return tmp;
    }

    //转化为数据视图的参数
    upgradeStructureView = (data, dataview) => {
        let tmp = {};
        if(data.keys && data.keys.length == 1) {
            tmp = {
                aggregateField: data.aggregateField[0], //聚集函数对应的视图字段
                aggregateType: data.aggregateType[0], //SQL集合函数类型
                scale: data.scale[0], //小数保留维数（默认为2）
                viewCode: dataview.code
            }
        }
        return tmp;
    }

    //转化为数据源的参数
    upgradeDataSourceStructure = (properties) => {
        if(properties && properties.length === 0) return [];
        let tmp = [];
        properties.forEach((propertie) => {
            if(propertie.annonQualifiedName !== "") {
                tmp.push({
                    paramName:propertie.annonQualifiedName,
                    paramType:propertie.parameter
                });
            }
        });
        return tmp;
    }

    btnSubmitClick = () => {
        let { type, sourceType, view: { dataview }, dataSource, script } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;
                if(type !==1 && type !== 4 && type !== 5 && type !== 6 && sourceType !== 5) {
                    data.inputs = null;
                    data.outputs = null;
                    this.inputForm && this.inputForm.validateFields((err1, inputs) => {
                        if(!err1) {
                            data.inputs = this.upgradeStructure(inputs,1);
                        }
                    });

                    this.outputForm && this.outputForm.validateFields((err2, outputs) => {
                        if(!err2) {
                            data.outputs = this.upgradeStructure(outputs,2);
                            // 数据视图(聚合)
                            if(sourceType == 2 && dataview) {
                                data.sourceAggregateDataView = this.upgradeStructureView(outputs, dataview)
                                delete data.sourceTypeName;
                            }
                            // 服务源
                            if(sourceType == 1 && dataSource) {
                                data.sourceServicable = {
                                    servicableMethod: dataSource.name
                                }
                                delete data.sourceTypeName;
                            }
                            // 脚本
                            if(sourceType == 3 && script) {
                                data.sourceScript = {
                                    script
                                }
                                delete data.sourceTypeName;
                            }
                        }
                    });

                    // 固定类
                    if(RuleableClass[`${type}_${sourceType}`]) {
                        data.ruleableClass = RuleableClass[`${type}_${sourceType}`];
                    }

                    if(data.inputs && data.outputs) {
                        console.log("rule node data>>>",data);
                        this.saveTemplateNode(data);
                    }
                }
                else {
                    if(sourceType == 5) {
                        if(RuleableClass[`${type}_${sourceType}`]) {
                            data.ruleableClass = RuleableClass[`${type}_${sourceType}`];
                        }
                    }else {
                        if(RuleableClass[`${type}`]) {
                            data.ruleableClass = RuleableClass[`${type}`];
                        }
                    }
                    this.saveTemplateNode(data);
                }
            }
        })
    }

    saveTemplateNode = (node) => {
        let { data } = this.state;
        //更新
        if(data && data.id) {

            node.id = data.id;

            this.props.dispatch({
                type: "rules/updateRuleTemplateNode",
                data:node,
                callback: (result) => {
                    if(result) {
                        message.success("更新模版节点成功");
                        this.props.history.push("/rule/nodelist");
                    }
                }
            });
        }
        //保存
        else {
            this.props.dispatch({
                type: "rules/saveRuleTemplateNode",
                data:node,
                callback: (result) => {
                    if(result) {
                        message.success("保存模版节点成功");
                        this.props.history.push("/rule/nodelist");
                    }
                }
            });
        }

    }

    btnCloseClick = () => {

    }

    changeScript = (data) => {
        this.setState({
            script: data
        });
    }


    saveScript = () => {
        console.log("this.scriptForm>>>>",this.scriptForm);
        this.scriptForm.wrappedInstance.handleSubmit();
    }

    backStep = () => {
        this.setState({
            next:false
        });
    }

    render () {

        const formItemLayout = {
            labelCol: {
                sm: { span: 3 },
                xs: { span: 24 },
            },
            wrapperCol: {
                sm: { span: 18 },
                xs: { span: 24 },
            },
        };

        const { getFieldDecorator } = this.props.form;

        const { type, sourceType,  view: { dataview, colsFields, filterFields }, dataSource, next, script, data} = this.state;

        console.log("dataSource>>>",dataSource && dataSource);

        return (
            <div className="roles-setting-node">
                <Form>
                    <FormItem  {...formItemLayout} label="编号">
                        {getFieldDecorator("code", {
                            initialValue: data && data.code ? data.code : '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入编号！',
                                },
                                {
                                    max: 255,
                                    message: '编号不能超过255个字符！'
                                }
                            ],
                        })(
                            <Input disabled={data && data.id ? true : false} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                        {getFieldDecorator("name", {
                            initialValue: data && data.name ? data.name : "",
                            rules: [
                                {
                                    required: true,
                                    message: '请输入名称！',
                                },
                                {
                                    max: 255,
                                    message: '名称不能超过255个字符！'
                                }
                            ],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型">
                        {getFieldDecorator('type', {
                            initialValue: type,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择类型！',
                                }
                            ],
                        })(
                            <Select
                                disabled={data && data.id ? true : false}
                                onChange={(value) => this.setState({
                                    type: value
                                })}
                            >
                                {types.map(item => {
                                    return (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })}
                            </Select>
                        )}
                    </FormItem>
                    {type !== 1 && type !== 4 && type !== 5 && type !== 6 && (
                        <>
                            <FormItem {...formItemLayout} label="处理器类型">
                                {getFieldDecorator('sourceType', {
                                    initialValue: sourceType,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择类型！',
                                        }
                                    ],
                                })(
                                    <div className="form-text">
                                        <Radio.Group
                                            value={sourceType}
                                            buttonStyle="solid"
                                            disabled={data && data.id ? true : false}
                                            onChange={e => {
                                                this.setState({
                                                    sourceType: e.target.value,
                                                })
                                            }}
                                        >
                                            <Radio.Button value={2}>数据视图(聚合)</Radio.Button>
                                            <Radio.Button value={1}>服务源</Radio.Button>
                                            <Radio.Button value={3}>groovy脚本</Radio.Button>
                                            <Radio.Button value={5}>动态</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                )}
                            </FormItem>
                            {  sourceType == 2 && (
                                <>
                                    <FormItem {...formItemLayout} label="数据视图编码">
                                        {getFieldDecorator('sourceTypeName', {
                                            initialValue: dataview && dataview.code ? dataview.code : "" ,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择数据视图！',
                                                }
                                            ],
                                        })(
                                            <div className="form-text">
                                                <Input
                                                    readOnly
                                                    value={dataview && dataview.code ? dataview.code : ""}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => this.visibleDataView()}
                                                    placeholder="请选择数据视图"
                                                    addonAfter={<Icon type="setting" />}
                                                />
                                            </div>
                                        )}
                                    </FormItem>
                                    <SelectDataView
                                        ref={node => {
                                            this.selectDataView = node;
                                        }}
                                        setSelectDataView={code => this.setSelectDataView(code)}
                                    />
                                </>

                            )}
                            {  sourceType == 1 && (
                                <>
                                    <FormItem {...formItemLayout} label="服务源">
                                        {getFieldDecorator('sourceTypeName', {
                                            initialValue: dataSource && dataSource.name ? dataSource.name : "" ,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择服务源！',
                                                }
                                            ],
                                        })(
                                            <div className="form-text">
                                                <Input
                                                    readOnly
                                                    value={dataSource && dataSource.name ? dataSource.name : ""}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => this.visibleDataSource(dataSource && dataSource.name ? dataSource.name : "")}
                                                    placeholder="请选择服务源"
                                                    addonAfter={<Icon type="setting" />}
                                                />
                                            </div>
                                        )}
                                    </FormItem>
                                    <SelectDataSource
                                        ref={node => {
                                            this.selectDataSource = node;
                                        }}
                                        onChange={this.changeDataSource}
                                    />
                                </>

                            )}
                            {  sourceType == 3 && (
                                <>
                                    <FormItem {...formItemLayout} label="脚本">
                                        {getFieldDecorator('sourceTypeName', {
                                            initialValue:script && script.name ? script.name : "" ,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择脚本！',
                                                }
                                            ],
                                        })(
                                            <div className="form-text">
                                                <SelectScript
                                                    data={script}
                                                    wrappedComponentRef={self => this.scriptForm = self}
                                                    onChange={this.changeScript}
                                                />
                                            </div>
                                        )}
                                    </FormItem>

                                </>
                            )}

                            {
                                sourceType && sourceType == 2 && dataview  && (
                                    <>
                                        <FormItem {...formItemLayout} label="入参">
                                            <SelectParams
                                                ref={self => this.inputForm = self}
                                                type={1}
                                                datatype={sourceType}
                                                colsFields={colsFields || []}
                                                single={true}
                                                data={data && data.inputs ? data.inputs : filterFields}
                                            />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="出参">
                                            <SelectParams
                                                ref={self => this.outputForm = self}
                                                type={2}
                                                datatype={sourceType}
                                                colsFields={colsFields || []}
                                                data={data && data.outputs ? data.outputs : []}
                                                single={true}
                                            />
                                        </FormItem>
                                    </>
                                )
                            }
                            {
                                sourceType && sourceType == 1 && dataSource  && (
                                    <>
                                        <FormItem {...formItemLayout} label="入参">
                                            <SelectParams
                                                datatype={sourceType}
                                                data={data && data.inputs ? data.inputs : this.upgradeDataSourceStructure(dataSource.properties || [])}
                                                ref={self => this.inputForm = self}
                                                type={1}
                                                single={true}
                                            />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="出参">
                                            <SelectParams
                                                datatype={sourceType}
                                                ref={self => this.outputForm = self}
                                                data={data && data.outputs ? data.outputs : []}
                                                type={2}
                                                single={true}
                                            />
                                        </FormItem>
                                    </>
                                )
                            }
                            {
                                sourceType && sourceType == 3  && (
                                    <>
                                        <FormItem {...formItemLayout} label="入参">
                                            <SelectParams
                                                datatype={sourceType}
                                                ref={self => this.inputForm = self}
                                                type={1}
                                                data={data && data.inputs ? data.inputs : []}
                                                single={false}
                                            />
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="出参">
                                            <SelectParams
                                                datatype={sourceType}
                                                ref={self => this.outputForm = self}
                                                type={2}
                                                single={false}
                                                data={data && data.outputs ? data.outputs : []}
                                            />
                                        </FormItem>
                                    </>
                                )
                            }
                        </>
                    )}
                </Form>

                <div className="dialog-footer">
                    <Button onClick={this.btnCloseClick}>取消</Button>
                    <Button onClick={this.btnSubmitClick} type="primary">确定</Button>
                </div>

            </div>
        )
    }
}

export default Form.create<any>()(Setting);
