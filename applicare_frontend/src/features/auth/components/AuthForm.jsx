// src/features/auth/components/AuthForm.jsx

import { Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from "../../../css/Auth.module.css";
import PasswordInput from './PasswordInput';

const { Title, Text } = Typography;

function AuthForm({
  title,
  fields = [],
  onSubmit,
  error,
  success,
  buttonText = "Submit",
  loading = false,
  children,
}) {
  const [form] = Form.useForm();

  // the matching title for each auth page
  const getSecondaryText = (title) => {
    if (!title) return "";
    
    if (title.includes("Login")) {
      return "Welcome back! Please enter your details";
    } else if (title.includes("Register")) {
      return "Create your account to get started";
    } else if (title.includes("Forgot Password")) {
      return "Enter your email to receive a reset link";
    } else if (title.includes("Reset Password")) {
      return "Enter your new password below";
    }
    return "";
  };

  async function handleSubmit(values) {
    onSubmit && onSubmit(values);
  }

  const getIcon = (type) => {
    switch (type) {
      case 'email':
        return <MailOutlined className="auth-icon" />;
      case 'password':
        return <LockOutlined className="auth-icon" />;
      default:
        return <UserOutlined className="auth-icon" />;
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          {title && (
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ fontSize: '24px', margin: 0 }}>
                {title}
              </Title>
              <Text type="secondary">
                {getSecondaryText(title)}
              </Text>
            </div>
          )}
          
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            disabled={loading}
            size="large"
            requiredMark={false}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%', display: 'flex' }}>
              {fields.map((f, i) => (
                <Form.Item
                  key={i}
                  name={f.name}
                  label={f.placeholder}
                  rules={[
                    { 
                      required: f.required, 
                      message: `Please enter your ${f.placeholder.toLowerCase()}`
                    }
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  {f.type === "password" ? (
                    <PasswordInput
                      prefix={getIcon(f.type)}
                      placeholder={`Enter your ${f.placeholder.toLowerCase()}`}
                      autoComplete={f.name === "password" ? "current-password" : "new-password"}
                    />
                  ) : (
                    <Input
                      prefix={getIcon(f.type)}
                      type={f.type || "text"}
                      placeholder={`Enter your ${f.placeholder.toLowerCase()}`}
                      autoComplete={f.type === "email" ? "email" : "username"}
                    />
                  )}
                </Form.Item>
              ))}

              <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                <Button
                  type='primary'
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {buttonText}
                </Button>
              </Form.Item>
            </Space>
          </Form>

          {children}

          {(error || success) && (
            <Space direction="vertical" style={{ width: '100%' }}>
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                />
              )}
              {success && (
                <Alert
                  message={success}
                  type="success"
                  showIcon
                />
              )}
            </Space>
          )}
        </Space>
      </div>
    </div>
  );
}

export default AuthForm;
