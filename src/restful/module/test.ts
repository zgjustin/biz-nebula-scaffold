/*
 * @Author: justin
 * @Date: 2020-08-10 16:09:26
 * @LastEditTime: 2020-08-10 16:23:54
 * @LastEditors: justin
 * @FilePath: /biz.nebula/nebula.scaffold/src/restful/module/test.ts
 * @Description: 此文件只是一个Demo，没有实际意义，对脚手架中的restful加以说明
 */ 
import RestFulDecorator,{RestFulMethod,RestFulContentType,RestFulBase} from 'biz-nebula-ui/lib/_restful/decorator'
/**
 * 业务中 API接口定义
 * @RestFulDecorator.RestFul 参数限定后端接口模块 比如订单模块下的 以 /order/为前缀 则指定order 实质是一个 url拼接
 * 
 */
@RestFulDecorator.RestFul('orders')
export default class Order extends RestFulBase{
  /**
   * @description 查看订单明细
   * @RestFulDecorator.Method(RestFulMethod.GET) 指定Api的method类型 参数为枚举值 可以查看ts声明文件
   * @RestFulDecorator.ContentType(RestFulContentType.URLENCODE) 指定API的request请求的content-type类型 参数为枚举值 可以查看ts声明文件
   * @RestFulDecorator.Header({}) 指定API的request请求头  参数为对象
   * 配合 RESTFUL.GetApiPromise(RESTFUL.Order.FindById,{id:xxx}) 最终输入 /v1/orders/findById
   */
  @RestFulDecorator.Method(RestFulMethod.GET)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  FindById: string ='/findById'
  /**
   * @description 创建订单
   * 其他说明同上
   */
  @RestFulDecorator.Method(RestFulMethod.POST)
  @RestFulDecorator.ContentType(RestFulContentType.JSON)
  Create: string = '/create'
  
  /**
   * @description 修改订单
   * 其他说明同上
   */
  @RestFulDecorator.Method(RestFulMethod.PATCH)
  @RestFulDecorator.ContentType(RestFulContentType.JSON)
  Update: string = '/update'

  /**
   * @description 删除订单
   * 其他说明同上
   */
  @RestFulDecorator.Method(RestFulMethod.DELETE)
  @RestFulDecorator.ContentType(RestFulContentType.URLENCODE)
  Delete: string = '/delete'
}