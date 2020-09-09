import React from 'react';
import FormModal from 'nebula-ui/lib/modal'
import Input from 'nebula-ui/lib/input'
import RESTFUL from '../../../restful'
import LoginInfo from '../../../data/loginInfo';
/**
 * @description 进行个人设置的内容
 * @author yangrongxin
 * @date 2020-04-23
 * @class EditSetting
 * @extends {FormModal}
 */
const changeUserInfoFormSetting=[
  {control:Input,name:'account',label:"账户名称",placeholder:"请输入账户名称",disabled:true},
  {control:Input,name:'userName',label:"姓名",required:true,placeholder:"请输入姓名"},
  {control:Input,name:'phone',label:"手机号",required:true,placeholder:"请输入手机号"}
]


class SelfSetting extends React.Component{
  modalRef: any

  constructor(props) {
    super(props)
    this.state = {

    }
    // 对应的弹窗对象
    this.modalRef = null
    this.showModal = this.showModal.bind(this);
    this.changeSelfSetting = this.changeSelfSetting.bind(this);
  }

  /**
   * @description 展示个人设置配置页面
   * @author yangrongxin
   * @date 2020-04-23
   * @memberof SelfSetting
   */
  showModal() {
    const userInfo = LoginInfo.getUser();
    //打开弹框
    if(!this.modalRef){
      this.modalRef = FormModal.form({
        key:'userinfo-change-user',
        title:'个人设置',
        save: this.changeSelfSetting,
        controls:changeUserInfoFormSetting
      })
    }
    this.modalRef.showModal && this.modalRef.showModal({
      userName: userInfo.userName || '',
      account: userInfo.account || '',
      phone: userInfo.phone || ''
    })
  }

  /**
   * @description 修改个人设置
   * @author yangrongxin
   * @date 2020-04-23
   * @param {*} formData 个人设置数据
   * @memberof SelfSetting
   */
  async changeSelfSetting ( formData ) {
    const userInfo = LoginInfo.getUser();
    await RESTFUL.GetApiPromise(RESTFUL.User.Users_ChangeSettings, {
      ...formData,
      id: userInfo.id
    }).then(() => {
      //重置缓存用户信息
      LoginInfo.update({...userInfo,...formData});
    })
  }

  render() {
    return <div onClick={ this.showModal }>个人设置</div>
  }
}

export default SelfSetting