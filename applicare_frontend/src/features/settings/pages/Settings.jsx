// src/features/settings/pages/Settings.jsx

import React, { useState } from 'react';
import { Card, Menu, Form, Input, Button, Avatar, Upload, Switch, Divider, message, Select, Space, Tooltip, Typography, Modal } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, UploadOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './Settings.module.css';

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;



{/*TODO: use regex from the backend not here.*/}
{/*TODO: avatar upload - with backend. also update the avatar in the whole app eg. Nav.jsx*/}

const Settings = () => {
  const { user, logout, cleanupAndRedirect } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('profile');
  const navigate = useNavigate();

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/profile?username=${encodeURIComponent(values.username)}&email=${encodeURIComponent(values.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Response status:', response.status);
        console.log('Error details:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Success response:', data);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Full error:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/password?currentPassword=${encodeURIComponent(values.currentPassword)}&newPassword=${encodeURIComponent(values.newPassword)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      message.success('Password updated successfully');
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete your account?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All your data will be permanently deleted.',
      okText: 'Yes, delete my account',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          const response = await fetch('/api/user/account', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }

          message.success('Account deleted successfully');
          cleanupAndRedirect();
        } catch (error) {
          message.error(error.message || 'Failed to delete account');
        }
      },
    });
  };

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
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <Avatar size={96} icon={<UserOutlined />} className={styles.avatar} />
                  <Upload>
                    <Button icon={<UploadOutlined />} className={styles.uploadButton}>
                      Change Photo
                    </Button>
                  </Upload>
                </div>
                <div className={styles.avatarInfo}>
                  <p className={styles.avatarHelp}>JPG, PNG. Max size 2MB</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                  
                    { required: true, message: 'Please enter your username' },
                    { min: 3, message: 'Username must be at least 3 characters' },
                    { max: 20, message: 'Username must be less than 20 characters' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                  ]}
                >
                  <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
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
          <>nothing here yet. might add themes and notifications</>
        );

      case 'security':
        return (
          <Card className={styles.sectionCard} title="Security Settings">
            <div className={styles.securitySection}>
              <Form 
                layout="vertical" 
                className={styles.securityForm}
                onFinish={handlePasswordUpdate}
              >
                <div className={styles.formGrid}>
                  <Form.Item
                    name="currentPassword"
                    label="1. Current Password"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password placeholder="Enter your current password" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="2. New Password"
                    rules={[
                      { required: true, message: 'Please enter a new password' },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password placeholder="Enter a new password" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="3. Confirm New Password"
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm your new password" />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update Password
                  </Button>
                </Form.Item>
              </Form>

              <Divider className={styles.sectionDivider} />

              <div className={styles.dangerZone}>
                <h3>Danger Zone</h3>
                <div className={styles.dangerItem}>
                  <div>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <Button danger onClick={showDeleteConfirm}>Delete Account</Button>
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

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