// src/features/auth/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import AuthForm from "../components/AuthForm";

function Login() {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  async function handleSubmit(data) {
    setError(null);
    try {
      await login(data.username, data.password);
    } catch (err) {
      setError(err.message);
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
      buttonText="Login"
    >
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
    </AuthForm>
  );  
}

export default Login;