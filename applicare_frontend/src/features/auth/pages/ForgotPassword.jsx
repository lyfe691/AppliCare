// src/features/auth/pages/ForgotPassword.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import "../../../css/Auth.css";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const email = formData.get("email");

    try {
      const msg = await forgotPassword(email);
      setSuccess(msg);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" required />
          <button type="submit">Send Reset Link</button>
        </form>
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}
        {success && (
          <div className="success-container">
            <p className="success-message">{success}</p>
          </div>
        )}
        <p>
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}
