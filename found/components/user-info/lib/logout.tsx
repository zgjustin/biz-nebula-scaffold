import React from 'react'
import Modal from 'nebula-ui/lib/modal'
import Restful from '../../../restful'
/**
 * @description 登录组件
 * @author yangrongxin
 * @date 2020-04-23
 * @returns
 */
function Logout () {
  // 点击进行退出登录
  const click = () => {
    const modal = Modal.confirm({
      title: '您将要退出登录',
      content: '确认继续?',
      okText: '确认',
      cancelText: '取消',
      onCancel: () => {
        modal.destroy()
      },
      onOk: async() => {
        // 退出登录
        const response = await Restful.GetApiPromise(Restful.Rbac.Logout,null,null,null,{backResponse:true});
        const result = response.data;
        if(result && result.success){
          //获取到返回的message信息 跳转到对应的指定页面 默认跳转到登录页
          window.location.href = result.message||'/login';
        }
      }
    })
  }
  
  return (
    <div onClick={ click }>
      退出登录
    </div>
  )
}

export default Logout