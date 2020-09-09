
const LoginInfoKey = Symbol('login-info-key');
/**
 * 缓存登录信息
 * by justin 2020-5-24
 */
class LoginInfo{
    /**
     * 用户信息
     */
    private userInfo:any;
    /**
     * 获得实例
     */
    static getInstance():LoginInfo{
        if(!LoginInfo[LoginInfoKey])
            LoginInfo[LoginInfoKey] = new LoginInfo();
        return LoginInfo[LoginInfoKey];
    }
    /**
     * 修改用户信息
     * @param userInfo 
     */
    update(userInfo:any){
        this.userInfo = userInfo;
    }
    /**
     * 获得用户信息
     */
    getUser():any{
        return this.userInfo||{};
    }
}

export default LoginInfo.getInstance();