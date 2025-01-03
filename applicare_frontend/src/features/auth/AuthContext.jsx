// src/features/auth/AuthContext.jsx

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from 'antd';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("appliCareUser");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(username, password) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: params,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const token = await res.text();
    const newUser = { username, token };
    setUser(newUser);
    localStorage.setItem("appliCareUser", JSON.stringify(newUser));
    navigate("/"); // redirect to home
  }

  async function registerUser(username, email, password) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("email", email);
    params.append("password", password);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: params,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.text();
  }

  async function forgotPassword(email) {
    const params = new URLSearchParams();
    params.append("email", email);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: params,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.text();
  }

  async function resetPassword(token, password) {
    const params = new URLSearchParams();
    params.append("token", token);
    params.append("password", password);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: params,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.text();
  }

  // logout modal -> remove item from localstorage
  function confirmLogout() {
    Modal.confirm({
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

  const value = {
    user,
    login,
    registerUser,
    forgotPassword,
    resetPassword,
    logout: confirmLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
