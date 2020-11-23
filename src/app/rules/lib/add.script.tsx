import React, { PureComponent } from 'react';
import {
  Form,
  Spin,
  Input,
  message,
  Drawer,
} from 'antd';
import MonacoEditor from '../../../components/base/monac.editor';
// import gvMkdown from './groovy.help.md';
import connect from "@/decorator/lib/connect";
const { TextArea } = Input;
const FormItem = Form.Item;

@connect('rules')
class AddScript extends PureComponent <any,any> {
  monaco:any = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      code: '',
      visible: false,
      helpLoading: false,
      helpHtml: '',
      data: props.data || null
    };
  }

  componentDidMount() {
    let { data }  = this.props;
    debugger;
    if(data) {
        this.doDispatch(data);
    }
  }

  componentWillReceiveProps(nextProps) {

      if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
          this.setState({
              data:nextProps.data
          },() => {
              if(nextProps.data && nextProps.data.id) {
                  this.doDispatch(nextProps.data);
              }
          });
      }
  }

  doDispatch = data => {
      this.props.dispatch({
          type: "rules/getScriptCode",
          data: {
              scriptId: data.id,
          },
          callback: (data) => {
              if(data) {
                  this.setState({
                      code: data,
                  });
              }

          }
      });
  };

  resetEditorField() {
    this.setState({
      code: '',
    });
  }

  editorDidMount = (editor, monaco) => {
    this.monaco = monaco;
    editor.focus();
  };

  addScript = data => {
      this.props.dispatch({
          type: "rules/saveScript",
          data: {
              scriptEntity: JSON.stringify({
                  name: data.name,
                  language: 'groovy',
              }),
              scriptContent: data.md5Code,
          },
          callback: (data) => {
              if(data) {
                  message.success("保存groovy脚本成功");
                  this.props.onChange && this.props.onChange(data);
              }
          }
      });
  };

  updataScript = (values) => {
    let { code, data} = this.state;
      this.props.dispatch({
          type: "rules/updateScript",
          data: {
              scriptEntity: JSON.stringify(Object.assign({},data,{
                  description: values.description
              })),
              scriptContent: code,
          },
          callback: (data) => {
             if(data) {
                 message.success("保存groovy脚本成功");
                 this.props.onChange && this.props.onChange(data);
             }
          }
      });
  };

  handleSubmit = () => {
    let { data } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.monaco) {
        let marker = this.monaco.editor.getModelMarkers({});
        if (marker.length > 0) {
          let _error = `请检查${marker[0].startLineNumber}行，位置${marker[0].startColumn}的语法，${marker[0].message}`;
          message.error(_error);
          return false;
        }

        if(data && data.id) {
            this.updataScript(values)
        }else {
            this.addScript(values);
        }

      } else {
        console.log(err);
      }
    });
  };

  onEditorChange = value => {
    this.setState(
      {
        code: value,
      },
      () => {
        this.props.form.setFieldsValue({
          md5Code: value,
        });
      }
    );
  };

  visibleHelp = () => {
    this.setState(
      {
        visible: !this.state.visible,
        helpLoading: true,
      },
      () => {
        this.loadHelp();
      }
    );
  };

  loadHelp() {
    // const path = gvMkdown;
    // fetch(path)
    //   .then(res => res.text())
    //   .then(text => {
    //     this.setState({
    //       helpLoading: false,
    //       helpHtml: text,
    //     });
    //   });
  }

  render() {
    const { loading, visible, helpLoading, helpHtml, data } = this.state;
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
    const options = {
      selectOnLineNumbers: true,
      contextmenu: false,
    };

    return (
      <div className="script-edit">
        <Form>
          <FormItem {...formItemLayout} label="脚本名称">
            {getFieldDecorator('name', {
              initialValue: data && data.name ? data.name : '',
              rules: [
                {
                  required: true,
                  message: '请填写脚本名称！',
                },
                {
                  max: 32,
                  message: '脚本名称不能超过32个字符！',
                }
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="编辑脚本">
            {getFieldDecorator('md5Code', {
              initialValue: this.state.code,
              rules: [
                {
                  required: true,
                  message: '请编辑脚本！',
                },
              ],
            })(
              <div className="model-monaco-editor">
                <div
                  className="engine-variable-help"
                  style={{
                    textAlign: 'right',
                    cursor: 'pointer',
                    color: '#2070e8',
                  }}
                  onClick={() => {
                    this.visibleHelp();
                  }}
                >
                  文档说明?
                </div>
                <Spin size="large" spinning={loading}>
                  <MonacoEditor
                    value={this.state.code}
                    width="100%"
                    height="300"
                    language={
                      this.props.language ? this.props.language : 'groovy'
                    }
                    theme="vs-dark"
                    onChange={this.onEditorChange}
                    options={options}
                    editorDidMount={this.editorDidMount}
                  />
                </Spin>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="脚本描述">
            {getFieldDecorator('description', {
              initialValue: data && data.description ? data.description : '',
              rules: [
                {
                  max: 512,
                  message: '脚本描述不能超过512个字符！',
                }
              ],
            })(
              <TextArea rows={2} maxLength={512} allowClear />
            )}
          </FormItem>
        </Form>
        <Drawer
          className="flow-api-drawer"
          title="帮助文档"
          placement="right"
          onClose={this.visibleHelp}
          visible={visible}
          zIndex={3010}
          width="700px"
        >
          <Spin spinning={helpLoading}>
            <div
              className="engine-api-code"
              dangerouslySetInnerHTML={{
                __html: helpHtml,
              }}
            />
          </Spin>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(AddScript);
