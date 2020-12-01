import React,{PureComponent} from 'react'
import LayoutFramework from '../../components/layout-framework'
import RouteSetting from '../../config/route.js'
import Home from '../home'
import Error404 from '../../components/error-page/page404'
import DynamicLoading from '../../components/dynamic-loading'
import Router from '../../utils/router'
import * as LoadScriptHelper from '../../utils/loadApp'
import {connect} from 'dva'
import ThemeManage from '../../data/theme'
import CodeEditor from '../../components/code-editor'
import { appendPath } from'../../utils/path'
import {UtilsBox} from 'biz-nebula-ui'
import {baseURL} from '../../http'
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
    this.getComponent = this.getComponent.bind(this);
  }
  /**
   * 根据路由获取组件
   * @param pathName 当前的路由地址
   */
  async getComponent(pathName:string){
    if(pathName===appendPath('/login')){
      Router.push('/login');
      return;
    }
    if(pathName===appendPath('/')||pathName==='/'){
      let {systemLayout={}} = this.props;
      // let systemLayout = {system_default_path:'http://www.baidu.com'}
      //从主题配置中拿取用户自定义首页
      let systemRootPath = systemLayout['system_default_path'];
      if(!systemRootPath||systemRootPath==='/'||systemRootPath===appendPath('/')){
        let background = systemLayout['background'];
        if(background){
          this.setState({Component:()=><img id='homeBackground' width='100%' height='100%' src={`${baseURL + '/venus/images' + background}`} alt='首页' />});
          return;
        }
        // 设置当前的根目录组件
        this.setState({Component:Home});
        return;
      }
      //自定义域名页面 嵌入iframe
      if(/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(systemRootPath)||systemRootPath.startsWith('/custom?')){
        if(systemRootPath.startsWith('/custom?')){
          systemRootPath = systemRootPath.replace('/custom?','');
        }
        this.setState({
          Component:()=>{return <iframe src={systemRootPath} width='100%' height='100%' frameBorder={0} onLoad={()=>{this.setState({loadingPage:false})}}/>},
          loadingPage:true
        })
        return;
      }
      pathName = systemRootPath;
    }
    let {definedComponent}=this.props;
    if(definedComponent){
      this.setState({Component:definedComponent});
      return;
    }
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
      LoadScriptHelper.loadChunks(['nebulaLib','nebula'],()=>{
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
   * 预加载 所有的应用
   * 用于缓存数据
   */
  preLoadApps(){
    LoadScriptHelper.loadChunks(['nebulaLib','nebula'],()=>{
      //加载account应用
      LoadScriptHelper.loadExecScript('account','index')
      //加载page应用
      LoadScriptHelper.loadExecScript('page','index')
      //加载数据中心应用
      LoadScriptHelper.loadExecScript('datasource','index')
    })
  }
  /**
   * 获取当前登录人初始信息
   */
  async getInitData(){
    const {location,dispatch} = this.props;
    await dispatch({type:'userAuth/findAuthAndMenu'});
    if(process.env.NODE_ENV!=='production'){
      ThemeManage.loadSystemLayout(this.props.systemLayout);
    }
    const {pathname='/'} = location;
    this.getComponent(pathname);
  }
  componentDidMount(){
    this.preLoadApps();
    this.getInitData();
    //动态加载代码编辑器
    if(!window['nebulaLib-codeEditor']){
      window['nebulaLib-codeEditor'] = CodeEditor;
    }
    if(!window['nebulaLib-react']){
      window['nebulaLib-react'] = React;
    }
  }
  /**
   * 遍历所有的route.js中的配置信息 找到当前路径的配置
   * @param pathName 
   */
  getCurrPathData(pathName:string){
    // 遍历所有的route.js中的配置信息 找到当前路径的配置
    const curPathRoute = RouteSetting.find(v=>{
      // 截取当前路径中的请求参数
      let paramStartIndex = pathName.indexOf('?');
      let comparePath = paramStartIndex>=0?pathName.substring(0,paramStartIndex):pathName;
      return appendPath(v.path)===comparePath
    });
    return curPathRoute;
  }
  render() {
    let {systemLayout={},location,userMenus=[],history,framework} = this.props;
    let {Component,loadingPage} = this.state;
    let theme = systemLayout.color||{};
    let themeColor = theme && theme.variables && theme.variables['@primary-color']
    themeColor = themeColor||'#0091FF';
    let menus = userMenus;
    let appRoute = {
      path:location.pathname+location.search||''+location.hash||'',
      rootPath:appendPath(''),
      push:(url:string)=>{
        Router.push(url);
      }
    }
    let currPath = this.getCurrPathData(location.pathname||'/');
    if(typeof framework === 'undefined'){
      framework  = typeof (currPath && currPath.framework) === 'undefined'?true:(currPath && currPath.framework);
    }
    return  (
      framework
      ?
        <LayoutFramework menu={menus} currPath={appRoute.path} smallLogo={systemLayout.small_logo} logo={systemLayout.logo} layoutType={systemLayout.frame}>
          <DynamicLoading isComplate={!loadingPage}>
            {Component?<Component themeColor={themeColor} history={history} route={appRoute}/>:<div style={{width:'100%',height:'100%'}}></div>}
          </DynamicLoading>
          <UtilsBox/>
        </LayoutFramework>
      :
      <DynamicLoading isComplate={!loadingPage}>
        {Component?<Component themeColor={themeColor} history={history} route={appRoute}/>:<div style={{width:'100%',height:'100%'}}></div>}
      </DynamicLoading>
    )
  }
}
export default connect((state)=>{
  const {userAuth={}} = state;
  return userAuth;
})(InnerPage)