// src/features/auth/pages/ForgotPassword.jsx

import { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const msg = await forgotPassword(data.email);
      setSuccess(msg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "email", type: "email", placeholder: "Enter your email", required: true }
  ];

  return (
    <AuthForm
      title="Forgot Password"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      buttonText={loading ? "Sending..." : "Send Reset Link"}
    >
      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </AuthForm>
  );
}

export default ForgotPassword;
