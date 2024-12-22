// src/features/auth/pages/ResetPassword.jsx

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../../../css/Auth.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get token from query parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const password = formData.get("password");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      setLoading(true);
      const msg = await resetPassword(token, password);
      setSuccess(msg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="password"
            type="password"
            placeholder="New password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
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
