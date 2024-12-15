import React, { createContext, useState, useEffect, useContext } from "react";
import AuthModal from "../components/Auth/AuthModal";
import { notifySuccess, notifyError } from "../components/Toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// using localstorage so the user remains logged in.

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch session status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/status", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUsername(data.username);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("username", data.username);
        } else {
          logout(false); 
        }
      } catch (error) {
        console.error("Failed to fetch session status:", error);
        logout(false);
      }
    };
    

    checkAuthStatus();
  }, []);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setIsAuthenticated(true);
      setUsername(username);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", username);
      notifySuccess("Login successful.");
      closeAuthModal();
    } catch (error) {
      console.error("Login failed:", error.message);
      notifyError("Login failed: " + error.message);
    }
  };

  const logout = async (showNotification = true) => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      setUsername(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");

      if (showNotification) {
        notifySuccess("Bye.");
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
      if (showNotification) {
        notifyError("Logout failed: " + error.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, logout, openAuthModal }}
    >
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};
