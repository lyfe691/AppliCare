import React, { createContext, useState } from "react";
import AuthModal from "../components/Auth/AuthModal";

const AuthContext = createContext();

// ! GLOBAL AUTH OBJECT FOR DIRECT ACCESS.
export const auth = {
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  openAuthModal: () => {},
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Functions to update state
  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const login = () => {
    auth.isAuthenticated = true;
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const logout = () => {
    auth.isAuthenticated = false;
    setIsAuthenticated(false);
  };

  // sync the global auth object
  auth.isAuthenticated = isAuthenticated;
  auth.login = login;
  auth.logout = logout;
  auth.openAuthModal = openAuthModal;

  return (
    <AuthContext.Provider value={{}}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};
