import React, { Component } from "react";
import Dropdown from "nebula-ui/lib/dropdown/antDropdown";
import Menu from "nebula-ui/lib/menu/antMenu";
import Icon, { IconLib } from "nebula-ui/lib/icon";
import { Version, SelfSetting, ChangePassword, Logout } from "./lib";
import "./style/index.less";

interface MenuItem {
  label: string;
  onClick?: (params: any) => void;
}

interface UserInfoProps {
  userName: string;
  avatar?: string;
  items: MenuItem[];
}

interface UserInfoState {}

export default class UserInfo extends Component<UserInfoProps, UserInfoState> {
  constructor(props: UserInfoProps) {
    super(props);
  }

  getMenu() {
    return (
      <Menu>
        <Menu.Item>
          <Version />
        </Menu.Item>
        <Menu.Item>
          <SelfSetting />
        </Menu.Item>
        <Menu.Item>
          <ChangePassword />
        </Menu.Item>
        <Menu.Item>
          <Logout />
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { userName, avatar, children } = this.props;
    return (
      <div className="head-config">
        <Dropdown
          overlayClassName="head-menu-box"
          overlay={this.getMenu()}
          trigger={["click"]}
        >
          <div className="head-user-box">
            <span className="sp1">
              <Icon type="user" lib={IconLib.Antd} />
            </span>
            {avatar && <img className="head-user-avatar" src={avatar} />}
            <span className="sp2" title={userName}>
              {userName && userName.length > 7
                ? userName.substr(0, 7) + "..."
                : userName}
            </span>
            <span className="sp3">
              <Icon type="caret-down" lib={IconLib.Antd} />
            </span>
          </div>
        </Dropdown>
        {children}
      </div>
    );
  }
}
