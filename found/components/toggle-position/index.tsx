import React from 'react';
import Dropdown from 'nebula-ui/lib/dropdown/antDropdown'
import Icon, { IconLib } from 'nebula-ui/lib/icon'
import Menu from 'nebula-ui/lib/menu/antMenu'
import message from 'nebula-ui/lib/message'
// 引入存储操作
import LoginInfo from '../../data/loginInfo'
import RESTFUL from '../../restful'
import Router from '../../utils/router'

/**
 * @description 岗位切换组件的props声明
 * @author yangrongxin
 * @date 2020-04-23
 * @interface IToggleProps
 */
interface IToggleProps {
  items?: Array<any>
  dispatch?: Function
}

/**
 * @description 岗位切换组件的状态声明
 * @author yangrongxin
 * @date 2020-04-23
 * @interface IToggleState
 */
interface IToggleState {
  // 存储当前登录者的岗位列表
  roleList: Array<any>
}


/**
 * @description 岗位切换组件
 * @author yangrongxin
 * @date 2020-04-23
 * @class TogglePosition
 * @extends {React.Component<IToggleProps, IToggleState>}
 */
class TogglePosition extends React.Component<IToggleProps, IToggleState>{
  constructor(props) {
    super(props)
    this.state = {
      roleList: []
    }
    this.togglePosition = this.togglePosition.bind(this)
    this.getMenu = this.getMenu.bind(this)
  }

  /**
   * @description 切换当前的岗位
   * @author yangrongxin
   * @date 2020-04-23
   * @param {*} item 当前选中的岗位
   * @memberof TogglePosition
   */
  togglePosition(item) {
    //TODO: 切换当前岗位 等待后端接口
    // console.log('args', args)
    if ( !item.id ) {
      message.warning('当前岗位选择不正确，请检查！')
      return
    }
    const userInfo = LoginInfo.getUser();
    if ( !userInfo || !userInfo.id ) {
      message.warning('当前登录用户信息已失效!请重新登录!')
      return
    }
    RESTFUL.GetApiPromise(RESTFUL.Position.Position_ChangePosition, {}, {
        positionId: item.id,
        userId: userInfo.id
      }).then(result=>{
        if(result.success){
            message.success('切换岗位成功！')
            LoginInfo.update(result);
            Router.push('/');
        }else{
            message.error('切换失败！')
        }
      }).catch(()=>{
          message.error('网络延迟,请联系管理员');
      })
  }

  /**
   * @description 获取当前需要进行展示的菜单
   * @author yangrongxin
   * @date 2020-04-24
   * @memberof TogglePosition
   */
  getMenu() {
    const userInfo = LoginInfo.getUser();
    // 渲染对应的岗位切换菜单
    if ( userInfo && Array.isArray(userInfo.positions) ) {
      const currentPosition = userInfo.positions.sort((b, a) => b.createTime - a.createTime)
      return (
        <Menu
          selectedKeys={[userInfo.mainPosition]}
        >
          {
            currentPosition.map(item => {
              return (
                <Menu.Item
                  key={item.id}
                  onClick={ () => this.togglePosition(item) }
                >
                  {item.name}
                </Menu.Item>
              )
            })
          }
        </Menu>
      )
    } else {
      return <></>
    }
  }

  render() {
    return (
      <Dropdown
        overlay={this.getMenu}
        trigger={['click']}
      >
        <span className='nebula-header-changeposition' title="岗位切换"><Icon lib={IconLib.Engine} type="menu-position"/></span>
      </Dropdown>
    )
  }
}

export default TogglePosition
