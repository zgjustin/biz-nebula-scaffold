import React from 'react'
import FormModal from 'biz-nebula-ui/lib/modal'
import Input from 'biz-nebula-ui/lib/input'
import message from 'biz-nebula-ui/lib/message'
import LoginInfo from '../../../data/loginInfo'
import RESTFUL from '../../../restful'

/**
 * 修改密码的校验弹窗配置
 */
const changePasswordFormSetting = [
  {control:Input,name:'account',label:"账户名称",required:true,placeholder:"请输入账户名称",disabled:true},
  {control:Input,name:'oldPassword',label:"旧密码",required:true,type:"password",placeholder:"请输入旧密码"},
  {control:Input,name:'password',label:"新密码",required:true,type:"password",placeholder:"请输入新密码"},
  {control:Input,name:'agePassword',label:"再次输入",required:true,type:"password",placeholder:"请再次输入新密码"},
];

/**
 * @description 修改密码的弹窗
 * @author yangrongxin
 * @date 2020-04-23
 * @class ChangePassword
 * @extends {React.Component}
 */
class ChangePassword extends React.Component {
  modalRef: any

  constructor(props) {
    super(props)
    this.state = {

    }
    this.modalRef = null
    this.showModal = this.showModal.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  /**
   * @description 修改当前登录人的账户密码
   * @author yangrongxin
   * @date 2020-04-23
   * @memberof ChangePassword
   */
  async changePassword(formData) {
    const userInfo = LoginInfo.getUser();
    if ( formData.password !== formData.agePassword ) {
      return new Promise((resolve, reject) => { reject(message.error('两次输入的密码不一致')) })
    }
    await RESTFUL.GetApiPromise( RESTFUL.User.Users_UpdatePassword, {}, {
      userId: userInfo.id,
      oldPassword: formData.oldPassword,
      newPassword: formData.password
    })
  }

  /**
   * @description 展示对应的弹窗
   * @author yangrongxin
   * @date 2020-04-23
   * @memberof ChangePassword
   */
  showModal() {
    const userInfo = LoginInfo.getUser();
    if(!this.modalRef){
      this.modalRef = FormModal.form({
        key:'userinfo-change-password',
        title:'修改密码',
        save: this.changePassword,
        controls:changePasswordFormSetting
      })
    }
    this.modalRef.showModal && this.modalRef.showModal({
      account: userInfo.account || ''
    })
  }

  render() {
    return <div onClick={ this.showModal }>修改密码</div>
  }
}

export default ChangePassword