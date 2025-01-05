// src/features/settings/pages/Settings.jsx

import React, { useState } from 'react';
import { Card, Menu, Form, Input, Button, Avatar, Upload, Switch, Divider, message, Select, Space, Tooltip, Typography } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import styles from './Settings.module.css';

const { Option } = Select;
const { Title } = Typography;

const Settings = () => {
  const {user} = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('profile');

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      // TODO: IMPLEMENT PORIFLE UPDATE LOGIC
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
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
                  rules={[{ required: true, message: `Please enter your username` }]}
                  // regex should be the same as in AuthService
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
          <>nothing here yet. might add themes and notificaitons</>
        );

      case 'security':
        return (
          <Card className={styles.sectionCard} title="Security Settings">
            <div className={styles.securitySection}>
              <Form layout="vertical" className={styles.securityForm}>
                <div className={styles.formGrid}>
                  <Form.Item
                    name="currentPassword"
                    label=" 1. Current Password"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password placeholder="Enter your current password" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="2. New Password"
                    rules={[
                      { required: true, message: 'Please enter a new password' },
                       
                      // should use same regex as in AuthService in the backend
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

                    {/* maybe also a forgot password link -> creating a new forgot password page that the user can access when authenticated. */}
                  </Form.Item>

                  
                </div>

                <Form.Item>
                  <Button type="primary">Update Password</Button>
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
                  <Button  danger>Delete Account</Button>
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
        <Title level={3}>Settings (placeholder, functionality will be implemented later on)</Title>
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