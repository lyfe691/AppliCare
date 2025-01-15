// src/features/settings/pages/Settings.jsx

import React, { useState } from 'react';
import { Card, Menu, Form, Input, Button, Switch, Divider, Select, Space, Tooltip, Typography, Modal, App, Radio } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, UploadOutlined, SettingOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth/AuthContext';
import PasswordInput from '../../auth/components/PasswordInput';
import { useTheme } from '../../../context/theme/ThemeContext';
import styles from './Settings.module.css';
import api from '../../../api/axios';

// there is a current fast refresh issue with the AuthContext,
// itll need to get fixed.
// it causes the username to not update in the frontend after refreshing the page
// however, the username is updated in the backend.
// but it can cause confussion for the user.

const { Option } = Select;
const { Title } = Typography;

const Settings = () => {
  const { user, cleanupAndRedirect } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('profile');
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { theme, setTheme } = useTheme();

  // this function is called when the user submits the profile update form
  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);

      await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Full error:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // this function is called when the user submits the password update form
  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("currentPassword", values.currentPassword);
      formData.append("newPassword", values.newPassword);

      await api.put('/user/password', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      message.success('Password updated successfully');
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // this function is called when the user clicks the delete account button
  const showDeleteConfirm = () => {
    modal.confirm({
      title: 'Are you sure you want to delete your account?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All your data will be permanently deleted.',
      okText: 'Yes, delete my account',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await api.delete('/user/account');
          message.success('Account deleted successfully');
          cleanupAndRedirect();
        } catch (error) {
          message.error(error.message || 'Failed to delete account');
        }
      },
    });
  };

  // this function is called when the user changes the theme preference
  const handleThemeChange = (value) => {
    setTheme(value);
     // remove message for now.
     // message.success('Theme preference updated');
  };

  // menu items for the settings page
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'preferences',
      icon: <SettingOutlined />,
      label: 'Preferences',
    },
    {
      key: 'security',
      icon: <LockOutlined />,
      label: 'Security',
    },
  ];

  // renders the content based on the selected menu item
  const renderContent = () => {
    switch (selectedKey) {
      case 'profile':
        return (
          <Card className={styles.sectionCard} title="Profile Settings">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileUpdate}
              initialValues={{
                username: user?.username || '',
                email: user?.email || '',
              }}
            >
              <div className={styles.formGrid}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter your username' }
                  ]}
                >
                  <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' }
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );

      case 'preferences':
        return (
          <Card title="Preferences" className={styles.sectionCard}>
            <Form layout="vertical">
              <Form.Item label="Theme">
                <Radio.Group value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value="light">Light</Radio>
                    <Radio value="dark">Dark (beta)</Radio>
                    <Radio value="system">Use System Settings</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              
              <Divider className={styles.sectionDivider} />
              
            </Form>
          </Card>
        );

      case 'security':
        return (
          <Card title="Security" className={styles.sectionCard}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePasswordUpdate}
              className={styles.securityForm}
            >
              <div className={styles.formGrid}>
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: 'Please enter your current password' }]}
                >
                  <PasswordInput placeholder="Enter your current password" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[{ required: true, message: 'Please enter your new password' }]}
                >
                  <PasswordInput placeholder="Enter your new password" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Please confirm your new password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <PasswordInput placeholder="Confirm your new password" />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Password
              </Button>
            </Form>

            <Divider className={styles.sectionDivider} />

            <div className={styles.dangerZone}>
              <h3>Danger Zone</h3>
              <div className={styles.dangerItem}>
                <div>
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all data</p>
                </div>
                <Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // render the overall settings page
  return (
    <div className={styles.settings}>
      <div className={styles.settingsHeader}>
        <Title level={3}>Settings</Title>
      </div>
      <div className={styles.settingsLayout}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          className={styles.settingsMenu}
        />
        <div className={styles.settingsContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;