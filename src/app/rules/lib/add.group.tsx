import React,{ PureComponent } from 'react';
import {Input, message, Modal, Form, Select} from "antd"
import connect from "@/decorator/lib/connect";

const FormItem = Form.Item;
const { Option }  = Select;

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
class AddGroup extends PureComponent<any,any>{


    constructor(props) {
        super(props);
        this.state = {
            selectedRow: null,
            visible: false,
            isShow: false,
            data: props.data || null
        }
    }

    visibleModal = () => {
        this.setState({
            visible:!this.state.visible
        });
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("values>>>",values);
                this.props.dispatch({
                    type: "rules/addGroup",
                    data: values,
                    callback: (data) => {
                        if(data) {
                            message.success("添加分组成功");
                            this.props.onSaveCallback && this.props.onSaveCallback();
                            this.close();
                        }
                    }
                });
            } else {
                console.log(err);
            }
        });
    }

    close = () => {
        this.visibleModal();
        this.props.form.resetFields();
    }

    render () {
        const { visible, isShow, selectedRow }  = this.state;
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
        const { data } = this.state;

        return (
            <Modal
                visible={ visible }
                onCancel={ this.visibleModal }
                onOk={ this.handleOk }
                width="800px"
                title="新增分组"
                style={{
                    top: "20px"
                }}
            >
                <Form>
                    <FormItem {...formItemLayout} label="编号">
                        {getFieldDecorator("code", {
                            initialValue: '',
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
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                        {getFieldDecorator("name", {
                            initialValue: data && data.name ? data.name : '',
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
                            initialValue: data && data.type ? data.type : "",
                            rules: [
                                {
                                    required: true,
                                    message: '请选择类型！',
                                }
                            ]
                        })(
                            <Select>
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
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddGroup)
