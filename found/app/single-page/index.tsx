import React,{PureComponent} from 'react'
import RouteSetting from '../../config/route'
import Error404 from '../../components/error-page/page404'
import DynamicLoading from '../../components/dynamic-loading'
import Router from '../../utils/router'
import * as LoadScriptHelper from '../../utils/loadApp'
import {connect} from 'dva'
import ThemeManage from '../../data/theme'
import CodeEditor from '../../components/code-editor'
import { appendPath } from'../../utils/path'
/**
 * 基础home页面
 * by justin 2019-11-19
 */
class InnerPage extends PureComponent<any, any> {
  constructor(props){
    super(props);
    this.state={
      Component:null,
      loadingPage:false,
      apps:[]
    }
    this.getComponent = this.getComponent.bind(this)
  }
  /**
   * 根据路由获取组件
   * @param pathName 当前的路由地址
   */
  async getComponent(pathName:string){
    let routePath = RouteSetting;
    // 遍历所有的route.js中的配置信息 找到当前路径的配置
    const curPathRoute = routePath.find(v=>{
      // 截取当前路径中的请求参数
      let paramStartIndex = pathName.indexOf('?');
      let comparePath = paramStartIndex>=0?pathName.substring(0,paramStartIndex):pathName;
      return appendPath(v.path)===comparePath
    });
    if(curPathRoute){
      // 展示当前路由加载的状态
      this.setState({loadingPage:true})
      // 得到当前路由所属的模块
      let curApp = curPathRoute.app;
      LoadScriptHelper.loadChunks(['dva','nebula','lodash'],()=>{
        LoadScriptHelper.loadExecScript(curApp,'index',null,(module)=>{
          this.setState({loadingPage:false,Component:module});
        })
      })
      return;
    }
    this.setState({Component:Error404,loadingPage:false})
  }
  UNSAFE_componentWillReceiveProps(props){
    if(props.location.pathname!==this.props.location.pathname){
      this.getComponent(props.location.pathname||'/');
    }
  }
  /**
   * 获取当前登录人初始信息
   */
  async getInitData(){
    const {location,dispatch} = this.props;
    await dispatch({type:'userAuth/findAuthAndMenu'});
    ThemeManage.loadSystemLayout(this.props.systemLayout);
    const {pathname='/'} = location;
    this.getComponent(pathname);
  }
  componentDidMount(){
    this.getInitData();
    //动态加载代码编辑器
    if(!window['nebulaLib-codeEditor']){
      window['nebulaLib-codeEditor'] = CodeEditor;
    }
    if(!window['nebulaLib-react']){
      window['nebulaLib-react'] = React;
    }
  }
  
  render() {
    let {location,history} = this.props;
    let {Component,loadingPage} = this.state;
    let appRoute = {
      path:location.pathname+location.search||''+location.hash||'',
      rootPath:appendPath(''),
      push:(url:string)=>{
        Router.push(url);
      }
    }
    return <DynamicLoading isComplate={!loadingPage}>
        {Component?<Component history={history} route={appRoute}/>:<div style={{width:'100%',height:'100%'}}></div>}
    </DynamicLoading>
  }
}
export default connect((state)=>{
  const {userAuth} = state;
  return userAuth;
})(InnerPage)