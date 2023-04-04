import React, { Fragment, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Button, Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import styled from "styled-components";

const Container = styled.div``;

export default function Layout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const isLoading = useSelector((state) => {
    return state?.global?.isLoading;
  });
  const dispatch = useDispatch();

  return (
    <Fragment>
      {isLoading && <div className="loading"></div>}
      {/* <div className="loading"></div> */}

      <div className="container">{props.children}</div>
      <div className={`side-menu ${collapsed && "active"}`}>
        <div className="blur" onClick={() => setCollapsed(false)}></div>
        <Button
          size="small"
          className="toggle"
          type="primary"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </Button>
        <Menu
          width={300}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          // inlineCollapsed={collapsed}
        >
          <Menu.Item icon={<AppstoreOutlined />}>
            <Link href={"/"}>追蹤碼測試</Link>
          </Menu.Item>
          <Menu.Item icon={<AppstoreOutlined />}>
            {" "}
            <Link href={"/form"}>表單測試</Link>
          </Menu.Item>
        </Menu>
      </div>
    </Fragment>
  );
}
