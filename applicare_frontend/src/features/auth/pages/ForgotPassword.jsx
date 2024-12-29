// src/features/auth/pages/ForgotPassword.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import AuthForm from "../components/AuthForm";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
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
      buttonText={loading ? "Sending..." : "Send Reset Link"}
    >
      <p>
        <a href="/login">Back to Login</a>
      </p>
    </AuthForm>
  );
}

export default ForgotPassword;