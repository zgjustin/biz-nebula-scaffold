import React,{PureComponent,ReactNode} from 'react'
import ConfigLocal from 'biz-nebula-ui/lib/config-provider'
import {PageLayout,PageLayoutType} from 'biz-nebula-ui/lib/layout'
import NavTabs from 'biz-nebula-ui/lib/nav-tabs'
import Router from '../../utils/router'
import UserInfo from '../user-info'
import LoginInfo from '../../data/loginInfo'
import TogglePosition from '../toggle-position'
import './style/index.less'
import {appendPath} from '../../utils/path'
import CacheTableProvider from 'biz-nebula-ui/lib/_data/cacheTableProvider'

const defaultLogo = require('../../assert/images/logo.png')
export interface LayoutMenuItem{
    /**
     * 路由
     */
    path:string
     /**
     * 菜单名称
     */
    title:string
    /**
     * 图标type
     */
    icon?:string
    /**
     * 子菜单
     */
    children?:Array<LayoutMenuItem>
}
/**
 * 布局框架props约束
 */
interface LayoutFrameworkProps{
    /**
     * 菜单项
     */
    menu:Array<LayoutMenuItem>
    /**
     * 当前路由
     */
    currPath?:string
    /**
     * 框架内容组件
     */
    children:ReactNode
    /**
     * 系统logo
     */
    logo?:string
    /**
     * 折叠菜单展示的小logo
     */
    smallLogo?:string
    /**
     * 布局类型
     */
    layoutType?:string
}
const rightCrumb = {
  title:'文档中心',
  onClick:()=>{
    Router.push('/markdown')
  }
}
/**
 * 布局框架 组件
 * by justin 2020-5-14
 */
export default class LayoutFramework extends PureComponent<LayoutFrameworkProps, any> {
  constructor(props){
    super(props);
    this.state={
       navLink:[],
       menuOpenKeys:[],
       changePath:true
    }
    this.clickMenu = this.clickMenu.bind(this);
    this.removeTabs = this.removeTabs.bind(this);
    this.clickTabs = this.clickTabs.bind(this);
    this.menuOpenChange = this.menuOpenChange.bind(this);
  }
  /**
   * 获取菜单key
   * @param tree
   * @param level
   */
  getMenuKey(tree:Array<any>,level?:string){
    return tree.map((v,i)=>{
      let curItem = {...v,key:`item${level||''}-${i+1}`}
      if(curItem.children){
        curItem.children = this.getMenuKey(curItem.children,`${level||''}-${i+1}`);
      }
      return curItem;
    })
  }
  /**
   * 获得菜单层级数据
   */
  getMenuLevel(tree:Array<any>,path:string,pathItem:Array<any>){
    tree.forEach((v)=>{
      if(pathItem.length>0) return;
      if(v.children){
        this.getMenuLevel(v.children,path,pathItem);
      }
      if(pathItem.length>0){
        pathItem.push(v);
      }
      //包含子集路由，由应用实现则跟随其路径
      if(path && v.path && (path===v.path||path.startsWith(v.path+'/'))){
        pathItem.push(v);
      }
    })
  }
  /**
   * 获得当前key的菜单项
   * @param key
   * @param currMenu
   */
  getCurrentMenu(tree:Array<any>, key:string,currMenu:any){
    tree.forEach((v)=>{
      if(currMenu.menu) return;
      if(v.children){
        this.getCurrentMenu(v.children, key,currMenu);
        return;
      }
      if(key===v.key){
        currMenu.menu=v;
      }
    })
  }
  /**
   * 点击菜单项对调
   * @param param0
   */
  clickMenu({key}){
    let currMenu:any={}
    const {menu} = this.props;
    const allMenu = this.getMenuKey(menu);
    this.getCurrentMenu(allMenu,key,currMenu);
    let newLinks = this.state.navLink.map(v=>({...v,active:false}))
    if(currMenu.menu){
      let currMenuItem = currMenu.menu;
      let oldMenu = newLinks.find(v=>v.id===key);
      if(oldMenu){
        oldMenu.active = true;
      }else{
        newLinks.push({id:currMenuItem.key,active:true,text:currMenuItem.title,to:currMenuItem.path,closable:true});
      }
      this.setState({
        navLink:newLinks,
        changePath:true
      },()=>{
        Router.push(currMenuItem.path);
      })
    }
  }
  /**
   * 获得当前路由对应的菜单层级数据
   */
  getPath(){
    const {menu,currPath='/'} = this.props;
    const allMenu = this.getMenuKey(menu);
    let pathItem = [];
    this.getMenuLevel(allMenu,currPath,pathItem);
    pathItem = pathItem.reverse();
    return {
      pathItem,
      crumbs:pathItem.map(v=>{
        let curItem:any = { title:v.title}
        if(v.path) curItem.onClick=()=>{Router.push(v.path)}
        return curItem;
      })
    };
  }
  /**
   * 移除Tabs
   * @param link
   */
  removeTabs(link:any){
    let {currPath} = this.props;
    let {navLink} = this.state;
    let newLink = navLink.map(v=>({...v,active:false}));
    let curLink = newLink.find(v=>v.to===currPath);
    let removeIndex = newLink.findIndex(v=>v.id===link.id);
    if(removeIndex!==-1){
      newLink.splice(removeIndex,1);
      CacheTableProvider.clearCache();
      let preLink = newLink[removeIndex>=newLink.length-1? newLink.length-1:removeIndex];
      if(curLink && curLink.id !== link.id) curLink.active = true;
      else if(preLink) preLink.active=true;
      this.setState({navLink:newLink},()=>{
        if(curLink && curLink.id !== link.id) return;
        if(preLink) {
          Router.push(preLink.to);
          return;
        }
        Router.push('/')
      });
    }
  }
  /**
   * 点击tabs
   * @param link
   */
  clickTabs(link:any){
    if(!link) return;
    let {navLink} = this.state;
    const newLink = navLink.map(v=>({...v,active:false}));
    const curTab = newLink.find(v=>v.id===link.id);
    if(!curTab) return;
    curTab.active = true;
    this.setState({navLink:newLink},()=>{
      CacheTableProvider.enable(appendPath(link.to));
      Router.push(link.to);
    })
  }
  /**
   * 菜单展开
   * @param openKeys 
   */
  menuOpenChange(openKeys:Array<string>){
    let newOpenKeys=[];
    if(openKeys.length>0){
      //保留最后一项以及包含最后一项前缀的key
      let curOpenKey = openKeys[openKeys.length-1];
      newOpenKeys = openKeys.filter(v=>v===curOpenKey||curOpenKey.indexOf(v+'-')>=0);
    }
    this.setState({menuOpenKeys:newOpenKeys,changePath:false});
  }
  /**
   * 跳转至首页
   */
  goHome(){
    Router.push('/');
  }
  render() {
    const {menu,children,logo,layoutType,smallLogo,currPath='/'} = this.props;
    let allMenu = this.getMenuKey(menu);
    let {navLink,menuOpenKeys,changePath} = this.state;
    let {crumbs,pathItem}= this.getPath();
    const loginData = LoginInfo.getUser();
    if(navLink.length<1){
      let curLink:any =pathItem[pathItem.length-1];
      if(curLink){
        //首页固定出现在第一个
        if(curLink.path!=='/'){
          let homeMenu:any = allMenu.find(v=>v.path==='/');
          if(homeMenu){
            navLink.push({id:homeMenu.key,text:homeMenu.title,to:homeMenu.path})
          }
        }
        navLink.push({id:curLink.key,active:true,text:curLink.title,to:curLink.path,closable:true})
      }
    }
    let selectMenuKeys,openMenuKeys = menuOpenKeys;
    if(pathItem && pathItem.length>0){
      selectMenuKeys = [pathItem[pathItem.length-1].key];
      //合并展开项 默认来源路由解析 点击展开菜单中的项
      openMenuKeys = changePath?pathItem.filter((_p,i:number)=>i<pathItem.length-1).map(v=>v.key):menuOpenKeys;
    }
    let crumbRightContext = rightCrumb;
    let homePageClassName='nebula-page-app';
    // 针对需要没有背景色的页面的处理
    if(currPath==='/'){
      crumbRightContext = undefined
      homePageClassName+=' nebula-page-home';
      crumbs = [];
    }else if(currPath==='/markdown'){
      crumbRightContext = undefined
      homePageClassName+=' nebula-page-doc';
      crumbs = [{title:'文档中心'}];
    }
    let pageLayoutType = PageLayoutType.LeftRight;
    if(layoutType==='mannered'){
      pageLayoutType=PageLayoutType.UpDown;
    }else if(layoutType==='excellent'){
      pageLayoutType = PageLayoutType.UpLeftRight
    }
    return <ConfigLocal>
            <PageLayout 
                logo={logo||defaultLogo}
                logoClick={this.goHome}
                smallLogo = {smallLogo}
                navTabs={<NavTabs links={navLink} deleteLink={this.removeTabs} clickLink={this.clickTabs} />}
                layoutType={pageLayoutType}
                crumbs={crumbs}
                rightCrumb={crumbRightContext}
                pageClassName={homePageClassName}
                menus={allMenu}
                menuOpenChange={this.menuOpenChange}
                selectedKeys={selectMenuKeys}
                openKeys={openMenuKeys}
                menuClick={this.clickMenu}
                headerUser={
                    <>
                    {/* 角色切换的选择 */}
                    <TogglePosition />
                    <UserInfo
                        // 当前登录人员的名称
                        userName={loginData.userName||''}
                        // 当前需要展示的子节点？
                        items={[
                        //
                        ]}
                    />
                    </>
                }>{children}</PageLayout>
      </ConfigLocal>
  }
}