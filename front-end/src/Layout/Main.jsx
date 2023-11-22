import { useContext, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { MdSell } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthProvider";

const { Header, Sider, Content } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logOut, user } = useContext(AuthContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className="max-w-[96rem] mx-auto">
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {collapsed ? (
            <div className="demo-logo-vertical mt-6 mb-12">
              <h1 className="text-2xl text-white text-center font-bold">FR</h1>
            </div>
          ) : (
            <div className="demo-logo-vertical mt-6 mb-12">
              <h1 className="text-2xl text-white text-center font-bold">
                Food Republic
              </h1>
            </div>
          )}
          <Menu
            className="text-xl py-1"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname}
          >
            <Menu.Item
              title="Home"
              key={"/"}
              icon={<AiFillHome className="h-4 w-4" />}
            >
              <Link to={"/"}>Home</Link>
            </Menu.Item>
            <Menu.Item
              title="Sell"
              key={"/sell"}
              icon={<MdSell className="h-4 w-4" />}
            >
              <Link to={"/sell"}>Sell</Link>
            </Menu.Item>
            <Menu.Item
              title="Dashboard"
              key={"/dashboard"}
              icon={<MdDashboard className="h-4 w-4" />}
            >
              <Link to={"/dashboard"}>Dashboard</Link>
            </Menu.Item>
            {user ? (
              <Menu.Item
                onClick={() => logOut()}
                key={"/logout"}
                title="Logout"
                icon={<FiLogOut className="h-4 w-4" />}
              >
                <Link>Logout</Link>
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "14px 8px",
              padding: 12,
              minHeight: 100,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Main;
