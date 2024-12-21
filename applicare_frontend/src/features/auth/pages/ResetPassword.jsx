// src/features/auth/pages/ResetPassword.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import "../../../css/Auth.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const token = formData.get("token");
    const password = formData.get("password");

    try {
      const msg = await resetPassword(token, password);
      setSuccess(msg);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input name="token" placeholder="Reset Token" required />
          <input
            name="password"
            type="password"
            placeholder="New password"
            required
          />
          <button type="submit">Reset Password</button>
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
          <a href="/login">Never mind, take me back</a>
        </p>
      </div>
    </div>
  );
}
