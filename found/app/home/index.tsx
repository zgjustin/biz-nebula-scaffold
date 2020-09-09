import React,{PureComponent} from 'react';
import Button from 'nebula-ui/lib/button'
import "./style/index.less";
import Router from '../../utils/router'
const img1 = require('../../assert/images/dashboard/1.png')
const img2 = require('../../assert/images/dashboard/2.png')
const img3 = require('../../assert/images/dashboard/3.png')
const img4 = require('../../assert/images/dashboard/4.png')
const img5 = require('../../assert/images/dashboard/5.png')
const img6 = require('../../assert/images/dashboard/6.png')
const ank = require('../../assert/images/dashboard/ank.png')


/***
 * 首页面板
 * by justin 2019-11-19
 */

class Home extends PureComponent<any,any>{
  PersionalSettingModal!:any;
  submitPosition() {

  }
  
  linkTo(_pathName) {
    // message.info('此功能于5.27日与产品沟通后暂不开发！')
  }

  render(){
    return (
      <div className="home">
        {/* 第一行 */}
        <ul>
          <li>
            <DivContent
              title="配置中心"
              detail="对业务系统的全局配置，例如本模块提供的样式配置功能可以对业务系统的所有页面样式细节进行精细化配置。本模块的功能还包括，系统全局参数、定时任务配置等。"
              img={img1}
              imgClassName="img1"
              onClick={() => this.linkTo("themeManage") }
            >
              <p>系统主题/工具包</p>
            </DivContent>
          </li>
          <li>
            <img className="ankhoz right" src={ank} alt="向右箭头"/>
          </li>
          <li>
            <DivContent
              title="权限中心"
              detail="配置用户对页面资源、按钮资源的访问授权。在遵循RBAC 3.0的授权规范下，通过业务构建平台建立的业务系统，用户的访问授权可精细管理到页面按钮级别。"
              img={img2}
              imgClassName="img2"
              onClick={() => this.linkTo("roleManagement") }
            >
              <p>角色/角色关系</p>
            </DivContent>
          </li>
          <li>
            <img className="ankhoz right" src={ank} alt="向右箭头"/>
          </li>
          <li>
            <DivContent
              title="用户中心"
              detail="用户信息可以是管理者创建的，用户自行注册的，也可能是来源于中台架构中的其它系统传递。用户身份体系除了用户基本信息外，还包含用户组信息、组织机构信息、岗位信息等。"
              img={img3}
              imgClassName="img3"
              onClick={() => this.linkTo("accountManagement") }
            >
              <p>用户/岗位/组织机构</p>
            </DivContent>
          </li>
        </ul>
        {/* 第二行 */}
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        {/* 第三行 */}
        <ul>
          <li>
            <DivContent
              title="数据中心"
              detail="通过数据视图、远端调用源、数据字典、服务源等功能汇聚、结构化下层数据，以便表单、列表、流程中绑定使用这些数据。数据权限还可对数据进行多维度的显示过滤。"
              img={img6}
              imgClassName="img6"
              onClick={() => this.linkTo("dataviewsourcemanage") }
            >
              <p>数据视图/数据字典</p>
            </DivContent>
          </li>
          <li>
            <img className="ankhoz right" src={ank} alt="向右箭头"/>
          </li>
          <li>
            <DivContent
              title="页面引擎"
              detail="基于约定优于配置、配置优于编码的原则，通过表单引擎、列表引擎、页面流聚合实现业务功能的低代码开发。直接节约30%以上开发时间、直接降低50%以上需求修改成本。"
              img={img5}
              imgClassName="img5"
              onClick={() => this.linkTo("template") }
            >
              <p>表单配置/列表配置</p>
            </DivContent>
          </li>
          <li>
            <img className="ankhoz right" src={ank} alt="向右箭头"/>
          </li>
          <li>
            <DivContent
              title="流程引擎"
              detail="满足BPMN 2.0规范的业务流程管理模块，提供分支、聚合、并行、单一选择、多项选择、会签、转办、代办、撤回、撤销、退会等流程管理要求在内的流程功能。"
              img={img4}
              imgClassName="img4"
              onClick={() => this.linkTo("flowcontrol") }
            >
              <p>流程模版/流程配置</p>
            </DivContent>
          </li>
        </ul>
        {/* 操作按钮 */}
        <div className="btnGroup">
          <Button onClick={()=>Router.push('/themeManage')}>系统风格配置</Button>
          <Button onClick={()=>Router.push('/markdown')}>查看帮助文档</Button>
        </div>
      </div>
    )
  }
}

export default Home


// 展示对应的元素
const DivContent = (props) => {
  const {
    title,
    children,
    img,
    detail,
    imgClassName
  } = props;
  return (
    <div className="item">
      {/* 左侧展示的提示信息 */}
      <div className="left">
        <h1>{title}</h1>
        {
          children
        }
      </div>
      {/* 右侧展示的图片 */}
      <div className="right">
        <img className={imgClassName} src={img} alt={title}/>
      </div>
      {/* 遮罩层 */}
      <div className="mask">
        <p>
          {
            detail
          }
        </p>
        {/* <Button onClick={()=> onClick }>立即前往</Button> */}
      </div>
    </div>
  )
}
