// src/features/auth/AuthContext.jsx

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from 'antd';
import api from '../../api/axios';

// This context provides authentication related functionalities such as login, 
// registration, password reset, and logout. It uses reacts context api to 
// share the authentication state and functions across the application.
// example: useAuth hook to access the user object and authentication functions etc

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("appliCareUser");
    return stored ? JSON.parse(stored) : null;
  });

  // LOGIN
  async function login(username, password) {
    try {
      const formData = new URLSearchParams();
      formData.append("usernameOrEmail", username);
      formData.append("password", password);
    
      const response = await api.post("/auth/login", formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { token, username: responseUsername, email } = response;
      
      if (!token || !responseUsername || !email) {
        throw new Error('Invalid response data received from server');
      }

      const newUser = {
        username: responseUsername,
        email: email,
        token: token,
      };
      
      setUser(newUser);
      localStorage.setItem("appliCareUser", JSON.stringify(newUser));
      navigate("/dashboard"); 
    } catch (error) {
      throw error;
    }
  }
  
  // REGISTER USER
  async function registerUser(username, email, password) {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      const response = await api.post("/auth/register", formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  // FORGOT PASSWORD
  async function forgotPassword(email) {
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await api.post("/auth/forgot-password", formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset link. Please try again.');
    }
  }

  // RESET PASSWORD
  async function resetPassword(token, password) {
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("password", password);

      const response = await api.post("/auth/reset-password", formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Password reset failed. Please try again.');
    }
  }

  // logout modal -> remove item from localstorage
  function confirmLogout() {
    modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        setUser(null);
        localStorage.removeItem("appliCareUser");
        navigate("/login");
      }
    });
  }

  // cleanup without showing modal - for acc deletion mainly
  function cleanupAndRedirect() {
    setUser(null);
    localStorage.removeItem("appliCareUser");
    navigate("/login");
  }

  const value = {
    user,
    login,
    registerUser,
    forgotPassword,
    resetPassword,
    logout: confirmLogout,
    cleanupAndRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}

