import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import * as utils from 'utils/index';

const Option = Select.Option;
const { TextArea } = Input;

class CreateParams extends React.PureComponent<any,any>{
  constructor(props) {
    super(props);
    this.state = {
      variables: props.params.variables
        ? utils.mapObjectToText(props.params.variables)
        : '',
    };
  }

  componentDidMount() {

  }

  onOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { assignment } = this.state;
        let data = {
          assignment: assignment,
          variables: utils.textToMap(values.variables),
        };
        this.props.submit(data);
        this.props.onCancel();
      }
    });
  };

  handleChange = value => {};


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const { assignment } = this.state;

    return (
      <Modal
        title="规则检测"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        maskClosable={false}
        onOk={this.onOk}
        okText="确认"
        cancelText="取消"
        width="40rem"
      >
        <div>
          <Form>
            <Form.Item {...formItemLayout} label="规则参数">
              {getFieldDecorator('variables', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入规则参数！',
                  },
                ],
              })(<TextArea placeholder="请输入key:value" row={4} />)}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default   Form.create()(CreateParams);

