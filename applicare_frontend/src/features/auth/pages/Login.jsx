// src/features/auth/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import "../../../css/Auth.css";

function Login() {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to AppliCare</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}
        <p>
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;