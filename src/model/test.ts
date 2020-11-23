/*
 * @Author: justin
 * @Date: 2020-07-28 19:52:36
 * @LastEditTime: 2020-11-23 14:17:21
 * @LastEditors: justin
 * @FilePath: /nebula.first/src/model/test.ts
 * @Description: 此文件为示例说明文件，没有实际意义
 */ 
import RESTFUL from 'restful'

export default {
    namespace: 'order1',
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