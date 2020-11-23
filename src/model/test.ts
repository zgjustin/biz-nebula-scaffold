/*
 * @Author: justin
 * @Date: 2020-07-28 19:52:36
 * @LastEditTime: 2020-08-10 16:34:50
 * @LastEditors: justin
 * @FilePath: /biz.nebula/nebula.scaffold/src/model/test.ts
 * @Description: 此文件为示例说明文件，没有实际意义
 */ 
import RESTFUL from 'restful'

export default {
    namespace: 'order',
    state: {
        data: {}
    },
    effects: {
         // 查找用户权限及菜单
        *findAuthAndMenu({ }, { put }) {
            //鉴权查询
            const orderData = yield RESTFUL.GetApiPromise(RESTFUL.Test.FindById,{id:'123'});
            yield put({ type: "updateData", payload: {data:orderData} });
        },
    },
    reducers: {
        updateData(state, action) {
            return {
              ...state,
              ...action.payload
            }
        }
    }
    
}