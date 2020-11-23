import { Component } from "react";
import { Row, Col, Form, Input, Select, Icon } from "antd";
import React from "react";
import { ParamType } from './rule';

const { Option } = Select;

interface SettingParamsProps {
    type?: number;  // 1.入参  2.出参
    datatype?: number; // 1.服务源 2.数据视图 3.groovy脚本 4.动态
    colsFields?: any[]; //datatype:1 --数据视图可选字段
    data?:any[]; //初始化数据
    single: boolean; // 是否可以添加多个参数
    filterFields?: any[]; // 输出参数  入参／出参
    form?:any;
}

interface SettingParamsState {
    data?:any[]; //初始化数据
    paramsType: any[] //参数类型
}

//1、count；2、sum；3、avg；4、max；5、min
const aggregate = [{
        label:"count",
        value: 1,
        title: "计数"
    }, {
        label:"sum",
        value: 2,
        title: "求和"
    }, {
        label:"avg",
        value: 3,
        title: "平均"
    }, {
        label:"max",
        value: 4,
        title: "最大值"
    }, {
        label:"min",
        value: 5,
        title: "最小值"
    }];

class SettingParams extends Component <SettingParamsProps, SettingParamsState>{
    uuid: number = 0;

    constructor(props) {
        super(props);
        this.state = {
            data: props.data || [],
            paramsType: ['chart','long','int','float','boolean','double','short','byte','string','object','collection']

        }
    }

    componentDidMount() {
        let { data } = this.props;
        if(data && data.length == 0 ) {
            this.uuid++;
            this.props.form.setFieldsValue({
                keys:[0]
            });
        }else {
            this.setDefaultData(data);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data && nextProps.data.length) {
            this.setDefaultData(nextProps.data);
        }
    }

    setDefaultData = (data ) => {
        if(data && data.length) {
            this.uuid = data.length;
            this.props.form.setFieldsValue({
                keys: data.map((item, index) => index)
            })
            this.setState({
                data,
            }, () => {
                this.setDefaultValue();
            });
        }else  {
            this.add();
        }
    }

    setDefaultValue = () => {
        let { data } = this.props;
        let params = {};
        data.forEach((item,index) => {
            params[`paramName[${index}]`] = item.paramName;
            params[`paramType[${index}]`] = this.getParamType(item.paramType);
            params[`paramDesc[${index}]`] = item.paramDesc;
            //聚合类型
            if(item.aggregateType) {
                params[`aggregateType[${index}]`] = item.aggregateType;
            }
            //聚合精度
            if(item.scale) {
                params[`scale[${index}]`] = item.scale;
            }
            //聚合字段
            if(item.aggregateField) {
                params[`aggregateField[${index}]`] = item.aggregateField;
            }
        });
        this.props.form.setFieldsValue(params)
    }

    getParamType = (paramType) => {
        return ParamType[paramType] ? ParamType[paramType] : paramType;
    }

    getDefaultValue = () => {
        let paramNames = [], paramTypes = [], paramDescs =[],aggregateTypes = [], scales = [], aggregateFields = [];
        let { data} = this.props;
        if(data && data.length) {
            data.forEach(item => {
                paramNames.push(item.paramName);
                paramTypes.push(this.getParamType(item.paramType));
                paramDescs.push(item.paramDesc || '')

                if(item.aggregateType) {
                    aggregateTypes.push(item.aggregateType);
                }

                if(item.scale) {
                    scales.push(item.scale);
                }

                if(item.aggregateField) {
                    aggregateFields.push(item.aggregateField);
                }

            })
        }

        let params: any  = {
            paramNames,
            paramTypes,
            paramDescs
        }

        if(aggregateTypes && aggregateTypes.length) {
            params.aggregateTypes = aggregateTypes
        }

        if(scales && scales.length) {
            params.scales = scales
        }

        return params;
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        this.uuid = this.uuid-1
    };

    onViewFieldChange = (value,option, index) => {
        let { props: { item } } = option;
        if(item && item.fieldType) {
            this.props.form.setFieldsValue({
                [`paramType[${index}]`]: this.getParamType(item.fieldType)
            })
        }
    }

    // 获取数据视图参数
    getViewParams = (k, paramName, paramType,aggregateType,scale, aggregateField) => {
        let { paramsType } = this.state;
        let { type, colsFields } = this.props;
        let { getFieldDecorator } = this.props.form;
        //入参
        if(type === 1) {
            return (
                <>
                    <Col span={6}>
                        <Form.Item
                            label='实参名'
                        >
                            {getFieldDecorator(`paramName[${k}]`,{
                                initialValues: paramName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择实参'
                                    }
                                ]
                            })(
                                <Input readOnly={true} defaultValue={paramName} value={paramName} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label='数据类型'
                        >
                            {getFieldDecorator(`paramType[${k}]`,{
                                initialValues: paramType,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择参数数据类型'
                                    }
                                ]
                            })(
                                <Select
                                    disabled={true}
                                    defaultValue={paramType}
                                    value={paramType}
                                    style={{ width: '100%' }}
                                    placeholder="请选择参数数据类型"
                                >
                                    {
                                        paramsType && paramsType.map(item => {
                                            return <Option key={item} value={item} >{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </>
            )
        }
        //出参
        else {
            return (
                <>
                    <Col span={6}>
                        <Form.Item
                            label='聚合函数'
                        >
                            {getFieldDecorator(`aggregateType[${k}]`,{
                                initialValues: aggregateType,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择聚合函数'
                                    }
                                ]
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择实参"
                                >
                                    {
                                        aggregate && aggregate.map(item => {
                                            return <Option key={item.value} value={item.value} >{item.label}({item.title})</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label='聚合字段'
                        >
                            {getFieldDecorator(`aggregateField[${k}]`,{
                                initialValues: aggregateField,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择字段'
                                    }
                                ]
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择字段"
                                    onChange={(event,option) => this.onViewFieldChange(event,option,k)}
                                >
                                    {
                                        colsFields && colsFields.map(item => {
                                            return <Option key={item.fieldName} value={item.fieldName} item={item}>{item.fieldName}({item.displayName})</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label='实参名'
                        >
                            {getFieldDecorator(`paramName[${k}]`,{
                                initialValues: paramName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入实参'
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label='精度'
                        >
                            {getFieldDecorator(`scale[${k}]`,{
                                initialValues: scale,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择精度'
                                    }
                                ]
                            })(
                                <Input type="number"  min={0} max={3}/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label='数据类型'
                        >
                            {getFieldDecorator(`paramType[${k}]`,{
                                initialValues: paramType,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择参数数据类型'
                                    }
                                ]
                            })(
                                <Select
                                    disabled={true}
                                    defaultValue={paramType}
                                    value={paramType}
                                    style={{ width: '100%' }}
                                    placeholder="请选择参数数据类型"
                                >
                                    {
                                        paramsType && paramsType.map(item => {
                                            return <Option key={item} value={item} >{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </>
            )
        }

    }

    // 获取服务源参数
    getDataSourceParams = (k, paramName, paramType) => {
        let { paramsType } = this.state;
        let { type, colsFields } = this.props;
        let { getFieldDecorator } = this.props.form;
        //入参
        return (
           <>
               <Col span={6} key={k}>
                   <Form.Item
                       label='实参名'
                   >
                       {getFieldDecorator(`paramName[${k}]`,{
                           initialValues: paramName,
                           rules:[
                               {
                                   required:true,
                                   message:'请输入参数名'
                               }
                           ]
                       })(
                           <Input readOnly={type ==1 ? true : false} defaultValue={paramName} value={paramName}/>
                       )}
                   </Form.Item>
               </Col>
               <Col span={6}>
                   <Form.Item
                       label='数据类型'
                   >
                       {getFieldDecorator(`paramType[${k}]`,{
                           initialValues: paramType,
                           rules:[
                               {
                                   required:true,
                                   message:'请选择参数数据类型'
                               }
                           ]
                       })(
                           <Select
                               disabled={type ==1 ? true : false}
                               defaultValue={paramType}
                               value={paramType}
                               style={{ width: '100%' }}
                               placeholder="请选择参数数据类型"
                           >
                               {
                                   paramsType && paramsType.map(item => {
                                       return <Option key={item} value={item} >{item}</Option>
                                   })
                               }
                           </Select>
                       )}
                   </Form.Item>
               </Col>
           </>
        )

    }

    getFormItems = () => {
        const { datatype, colsFields, type, single } = this.props;
        const { getFieldDecorator } = this.props.form;
        let { paramsType } = this.state;
        const { keys } = this.props.form.getFieldsValue();
        let { paramNames, paramTypes, paramDescs, aggregateTypes, scales, aggregateFields}  = this.getDefaultValue();

        return keys.map((k, index) => {
            let paramName = paramNames && paramNames[k] ? paramNames[k] : '';
            let paramType = paramTypes && paramTypes[k] ? paramTypes[k] : '';
            let paramDesc = paramDescs && paramDescs[k] ? paramDescs[k] : '';
            let aggregateType = aggregateTypes && aggregateTypes[k] ? aggregateTypes[k]: '';
            let scale = scales && scales[k] ? scales[k] : '';
            let aggregateField = aggregateFields && aggregateFields[k] ? aggregateFields[k] : '';

            return (
                <Row>
                    { datatype && datatype === 3 && (
                        <>
                            <Col span={6} key={k}>
                                <Form.Item
                                    label='实参名'
                                >
                                    {getFieldDecorator(`paramName[${k}]`,{
                                        initialValues: paramName,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入参数名'
                                            }
                                        ]
                                    })(
                                        <Input defaultValue={paramName} value={paramName}/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label='数据类型'
                                >
                                    {getFieldDecorator(`paramType[${k}]`,{
                                        initialValues: paramType,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请选择参数数据类型'
                                            }
                                        ]
                                    })(
                                        <Select
                                            defaultValue={paramType}
                                            value={paramType}
                                            style={{ width: '100%' }}
                                            placeholder="请选择参数数据类型"
                                        >
                                            {
                                                paramsType && paramsType.map(item => {
                                                    return <Option key={item} value={item} >{item}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </>
                    )}

                    {datatype  && datatype === 2 && this.getViewParams(k, paramName, paramType,aggregateType,scale,aggregateField)}
                    {datatype  && datatype === 1 && this.getDataSourceParams(k, paramName, paramType)}


                    <Col span={6} key={k}>
                        <Form.Item
                            label='参数描述'
                        >
                            {getFieldDecorator(`paramDesc[${k}]`,{
                                initialValues: paramDesc || '',
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入参数描述'
                                    }
                                ]
                            })(
                                <Input defaultValue={paramDesc} value={paramDesc}/>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={6} className='form-icon'>
                        { keys.length > 1 && !single ? (
                            <span className='form-icon-span'>
                                <Icon
                                    style={{
                                        fontSize: "30px"
                                    }}
                                    type="minus-circle-o"
                                    onClick={() => this.remove(k)}
                                />
                             </span>
                        ) : null}
                        {index === keys.length-1 && !single ? (
                            <span className='form-icon-span'>
                                <Icon
                                    style={{
                                        fontSize: "30px"
                                    }}
                                    type="plus-circle"
                                    onClick={() => this.add()}
                                />
                              </span>
                        ): null}
                    </Col>
                </Row>
            )
        })
    }

    render(){
        let { } = this.state;
        const { getFieldDecorator } = this.props.form;

        getFieldDecorator('keys', { initialValue: [] });


        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };

        return (
            <div className="params">
                <Form>
                    {this.getFormItems()}
                </Form>
            </div>
        );
    }
}


export default Form.create()(SettingParams);
