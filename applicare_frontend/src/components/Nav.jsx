import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import {
  Layout,
  Menu,
  Button,
  Space,
  Drawer,
  Dropdown,
  Avatar,
  Divider,
  Typography,
} from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import "../css/Nav.css";

const { Header } = Layout;
const { Text } = Typography;

function Nav() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const currentPath = location.pathname;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // consts for truncation
  const MAX_EMAIL_LOCAL_LENGTH = 10;
  const MAX_USERNAME_LENGTH = 15;
  const DEFAULT_EMAIL = "no email";
  const DEFAULT_USERNAME = "no username";

  const truncateEmail = (email) => {
    if (!email) return DEFAULT_EMAIL;
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    if (localPart.length > MAX_EMAIL_LOCAL_LENGTH) {
      return `${localPart.slice(0, MAX_EMAIL_LOCAL_LENGTH)}...@${domain}`;
    }
    return email;
  };

  const truncateUsername = (username) => {
    if (!username) return DEFAULT_USERNAME;
    if (username.length > MAX_USERNAME_LENGTH) {
      return `${username.slice(0, MAX_USERNAME_LENGTH)}...`;
    }
    return username;
  };

  // main nav items
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard" onClick={() => setDrawerVisible(false)}>Dashboard</Link>, 
    },
    {
      key: '/manage',
      icon: <TableOutlined />,
      label: <Link to="/manage" onClick={() => setDrawerVisible(false)}>Manage</Link>,
    },
  ];

  // profile menu items
  const profileMenuItems = [
    {
      key: "user-info",
      disabled: true,
      label: (
        <div style={{ cursor: "default", maxWidth: "200px" }}>
          <Text strong style={{ 
            display: "block",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}>
            {truncateUsername(user?.username)}
          </Text>
          <Text type="secondary" style={{ 
            fontSize: "0.85rem",
            display: "block",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}>
            {truncateEmail(user?.email)}
          </Text>
        </div>
      ),
    },
    { type: "divider" },
    
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings" onClick={() => setDrawerVisible(false)}>Settings</Link>,
    },
  ];

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
            <Menu
              mode="vertical"
              items={menuItems}
              className="nav-menu"
              selectedKeys={[currentPath]}
            />

            {user && (
              <>
                <Divider />

                <Dropdown
                  menu={{ items: profileMenuItems }}
                  trigger={["click"]}
                >
                  <Button
                    icon={<UserOutlined />}
                    className="mobile-profile-button"
                    style={{ margin: "16px", marginBottom:"auto", width: "calc(100% - 32px)" }}
                  >
                    {truncateUsername(user?.username)}
                  </Button>
                </Dropdown>

                <Button
                  type="primary"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  className="mobile-logout-button"
                >
                  Logout
                </Button>
              </>
            )}
          </Drawer>
        </>
      ) : (
        <Space className="nav-content">
          <Menu
            mode="horizontal"
            items={menuItems}
            className="nav-menu"
            selectedKeys={[currentPath]}
          />

          {user && (
            <>
              <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>
                <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              </Dropdown>
              <Button
                type="dashed"
                icon={<LogoutOutlined />}
                onClick={logout}
                className="logout-button"
              >
                Logout
              </Button>
            </>
          )}
        </Space>
      )}
    </Header>
  );
}

export default Nav;
