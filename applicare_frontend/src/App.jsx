// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import { ThemeProvider } from "./context/theme/ThemeContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Settings from "./features/settings/pages/Settings";
import Manage from "./pages/Manage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AppConfigProvider from "./components/ConfigProvider";
import NoticeBar from "./components/notice/NoticeBar";
import "./App.css";
import "./index.css";

// this is the main app component that sets up the routes and renders the layout
// its called AppComponent to avoid confusion with the App function from Ant Design in main.jsx

export default function AppComponent() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppConfigProvider>
            <NoticeBar />
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* auth routes - these pages dont use the main layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* main app routes - these use the layout with nav and footer */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/manage" element={
                  <ProtectedRoute>
                    <Manage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Route>

              {/* catch all - redr to '/' */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppConfigProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
