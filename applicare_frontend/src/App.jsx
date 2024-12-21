// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import TestConnection from "./pages/TestConnection";
import LongPage from "./pages/LongPage";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/test-mongo" element={<TestConnection />} />
            <Route path="/long-page" element={<LongPage />} />
          </Route>

          {/* for pages without the layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
