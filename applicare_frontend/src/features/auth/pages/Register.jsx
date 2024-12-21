// src/features/auth/pages/Register.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import "../../../css/Auth.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { registerUser } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const msg = await registerUser(username, email, password);
      setSuccess(msg);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register for AppliCare</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Register</button>
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
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
