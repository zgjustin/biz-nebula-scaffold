/*
 * @Author: justin
 * @Date: 2020-07-28 19:52:36
 * @LastEditTime: 2020-11-26 11:51:55
 * @LastEditors: justin
 * @FilePath: /nebula.first/found/model/authenticate.ts
 * @Description: 鉴权数据托管
 */ 
import RESTFUL from '../restful'
import LoginInfo from '../data/loginInfo'
import {baseURL} from '../http'
import AuthorizationProvider from 'biz-nebula-ui/lib/_data/authorization'


/**
 * 拼接后端图片路径
 */
const appendImagePath=(url:string)=>{
    if(!url) return;
    return `${baseURL}/venus/images${url}`
}

export default {
    namespace: 'userAuth',
    state: {
        userInfo: {},
        userMenus:[],
        userButtons:[]
    },
    effects: {
         // 查找用户权限及菜单
        *findAuthAndMenu({ }, { put }) {
            //鉴权查询
            const userInfo = yield RESTFUL.GetApiPromise(RESTFUL.Nebula.UserFindByPrincipal);
            if(!userInfo) return;
            //重置缓存登录信息
            LoginInfo.update(userInfo);
            let authMenuPromise = [];
            authMenuPromise.push(RESTFUL.GetApiPromise(RESTFUL.Nebula.CompetencesViewItemFindByCurrentUser));
            authMenuPromise.push(RESTFUL.GetApiPromise(RESTFUL.Nebula.ButtonsFindByCurrentUser));
            authMenuPromise.push(RESTFUL.GetApiPromise(RESTFUL.Theme.FindTheme))
            //查询所有菜单和查询所有按钮权限
            const [menus,buttons,systemLayout] = yield Promise.all(authMenuPromise);
            const currAuthProvider = AuthorizationProvider.getInstance();
            if(systemLayout){
                const {logo,small_logo,background,system_icon} = systemLayout;
                systemLayout.system_icon = system_icon && appendImagePath(system_icon);
                systemLayout.background = background && appendImagePath(background);
                systemLayout.logo = logo && appendImagePath(logo);
                systemLayout.small_logo = small_logo && appendImagePath(small_logo);
            }
            //获取按钮和菜单权限并初始化数据缓存
            currAuthProvider.init(buttons,menus);
            let userMenus = currAuthProvider.getOwnTreeMenu();
            let userButtons = currAuthProvider.getAuths();
            const userData = {
                userInfo,
                userMenus:userMenus,
                userButtons:userButtons,
                systemLayout:systemLayout||{}
            }
            yield put({ type: "updateData", payload: userData });
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