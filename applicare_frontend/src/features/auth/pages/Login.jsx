// src/features/auth/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setError(null);
    setLoading(true);
    try {
      await login(data.username, data.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "username", placeholder: "Username or Email", required: true },
    { name: "password", type: "password", placeholder: "Password", required: true }
  ];

  return (
    <AuthForm
      title="Login to AppliCare"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      buttonText={loading ? "Logging in..." : "Login"}
    >
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </AuthForm>
  );  
}

export default Login;