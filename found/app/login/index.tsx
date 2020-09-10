import React from 'react';
import Icon, { IconLib } from 'biz-nebula-ui/lib/icon'
import message from 'biz-nebula-ui/lib/message'
import BgAnimation from './bgAnimation'
import RestFul from '../../restful'
import './assert/index.less'
import {HistoryInstance} from 'biz-nebula-ui/lib/_data/historyStore'
import {appendPath} from '../../utils/path'

/**
 * 用户登录界面
 */
class Login extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      passWord: '',
      logining: false,
    };
    this.userNameChange = this.userNameChange.bind(this);
    this.passWordChange = this.passWordChange.bind(this);
    this.toLogin = this.toLogin.bind(this);
  }
  userNameChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }
  passWordChange(e) {
    this.setState({
      passWord: e.target.value,
    });
  }
  toLogin() {
    let { userName, passWord, logining } = this.state;
    if (logining) return;
    if (!userName) {
      message.error('用户名不能为空');
      return false;
    }
    if (!passWord) {
      message.error('密码不能为空');
      return false;
    }
    this.setState({ logining: true },()=>{
      let {userName,passWord} = this.state;
      RestFul.GetApiPromise(RestFul.Rbac.Login,{username:userName,password: passWord},null,null).then(result=>{
        if(result){
          this.setState({ logining: false });
          // Router.push('/');
          //获取上一页浏览地址
          let prevUrl = HistoryInstance.getHistoryCurrPageUrl();
          let currUrl = HistoryInstance.getHistoryPrePageUrl();
          if(!prevUrl || prevUrl===appendPath('/login')){
            prevUrl = currUrl === appendPath('/login') ?'':currUrl;
          }
          window.location.href = prevUrl || appendPath('/');
        }else{
          this.setState({ logining: false });
        }
      }).catch(()=>{
        this.setState({ logining: false });
      })
    });
  }
  render() {
    let { userName, passWord, logining } = this.state;
    return (
      <div className="Login">
        <div className="Login-content">
          <BgAnimation />
          <div className="Login-content-form">
            <div className="Login-content-logo" />
            <div className="Login-content-title">Nebula业务构建平台</div>
            <div className="Login-content-box">
              <Input
                icon="geren"
                placeholder="请输入账号"
                onChange={this.userNameChange}
                type="text"
                value={userName}
                login={this.toLogin}
              />
              <Input
                icon="mima"
                placeholder="请输入密码"
                onChange={this.passWordChange}
                type="password"
                value={passWord}
                login={this.toLogin}
              />
              <button onClick={this.toLogin.bind(this)}>
                {logining ? (
                  <span>
                    <Icon type="loading" style={{ marginRight: '10px' }} />
                    正在登录...
                  </span>
                ) : (
                  <span>登录</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function Input({ icon, placeholder, onChange, type, value, login }) {
  return (
    <div className="form-input">
      <span>
        <Icon lib={IconLib.Nebula} type={icon} />
      </span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={e => onChange(e)}
        onKeyUp={e => {
          if (e.keyCode === 13) {
            login();
          }
        }}
      />
    </div>
  );
}

export default Login
