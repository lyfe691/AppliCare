// src/features/auth/AuthContext.jsx

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from 'antd';
import api from '../../api/axios';

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
    const formData = new FormData();
    formData.append("usernameOrEmail", username);
    formData.append("password", password);
  
    const data = await api.post("/auth/login", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const newUser = {
      username: data.username,
      email: data.email,
      token: data.token,
    };
    setUser(newUser);
    localStorage.setItem("appliCareUser", JSON.stringify(newUser));
    navigate("/dashboard"); // redirect to dashboard instead of home
  }
  
  // REGISTER USER
  async function registerUser(username, email, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    return await api.post("/auth/register", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  // FORGOT PASSWORD
  async function forgotPassword(email) {
    const formData = new FormData();
    formData.append("email", email);

    return await api.post("/auth/forgot-password", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  // RESET PASSWORD
  async function resetPassword(token, password) {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    return await api.post("/auth/reset-password", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
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

  // cleanup without showing modal - for acc deletion
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
