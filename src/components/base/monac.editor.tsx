import React, { Component } from 'react';
import ReactMonacEditor from 'react-monaco-editor'
interface MonacoEditorProps {
  width?: string,
  height?: string,
  language?: string,
  theme?: string,
  value?: any,
}
interface MonacoEditorState {
  editorComponent?:any
}

class MonacoEditor extends Component<MonacoEditorProps, MonacoEditorState> {
  constructor(props) {
    super(props);
    this.state = {
      editorComponent: ReactMonacEditor,
    };
  }
  static preLoad = callback => {
    // 引入monaco-editor code编辑插件  插件过大使用异步加载
    import(/* webpackChunkName: "monaco-editor" */ 'react-monaco-editor')
      .then(m => m.default)
      .then(editor => {
        if (!callback) {
          console.info(`Component react-monaco-editor preLoad finished`);
        } else {
          callback(editor);
        }
      })
      .catch(err => {
        // message.error('编辑器加载失败!');
        console.error(`Cannot load component react-monaco-editor`, err);
      });
  };
  // componentDidMount() {
  //   MonacoEditor.preLoad(editor => {
  //     this.setState({ editorComponent: editor });
  //   });
  // }

  render() {
    let Editor = this.state.editorComponent;
    if (!Editor) return <span>正在加载编辑器...</span>;
    return <Editor {...this.props} />;
  }
}

export default MonacoEditor;
