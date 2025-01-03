// src/components/Nav.jsx

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Layout, Menu, Button, Space, Drawer } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from "react";
import "../css/Nav.css";

const { Header } = Layout;

function Nav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/manage',
      icon: <TableOutlined />,
      label: <Link to="/manage">Manage</Link>,
    },
  ];

  const selectedKey = menuItems.find(item => item.key === location.pathname)?.key || '/dashboard';

  const navigationMenu = (
    <Menu
      mode={isMobile ? "vertical" : "horizontal"}
      selectedKeys={[selectedKey]}
      items={menuItems}
      className="nav-menu"
    />
  );

  return (
    <Header className="app-header">
      <div className="logo-container">
        <Link to="/dashboard" className="logo-link">
          <img src="/applicare.png" height={32} alt="AppliCare Logo" />
          <span className="logo-text">AppliCare</span>
        </Link>
      </div>

      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="mobile-menu-button"
          />
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={250}
          >
            {navigationMenu}
            {user && (
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={logout}
                className="mobile-logout-button"
              >
                Logout
              </Button>
            )}
          </Drawer>
        </>
      ) : (
        <Space className="nav-content">
          {navigationMenu}
          {user && (
            <Button
              type="dashed" // lowk clean 
              icon={<LogoutOutlined />}
              onClick={logout}
              className="logout-button"
            >
              Logout
            </Button>
          )}
        </Space>
      )}
    </Header>
  );
}

export default Nav;
