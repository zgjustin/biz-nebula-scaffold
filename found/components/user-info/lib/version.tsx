// 获取所有的默认信息
import AppJson from '../../../../app.json'
import React from 'react'
import message from 'biz-nebula-ui/lib/message'

/**
 * @description 存放当前版本号的组件
 * @author yangrongxin
 * @date 2020-04-23
 * @returns
 */
function Version() {
  
  // 点击进行版本号提示的事件
  const click = () => {
    message.info(`当前版本号${AppJson.version}`)
  }
  
  return (
    <div onClick={ click }>
      当前版本号：{ AppJson.version }
    </div>
  )
}

export default Version