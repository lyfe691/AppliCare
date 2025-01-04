// src/features/auth/pages/ResetPassword.jsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AuthForm from "../components/AuthForm";

function ResetPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from query parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      setLoading(true);
      const msg = await resetPassword(token, data.password);
      setSuccess(msg);
      
      // redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "password", type: "password", placeholder: "New password", required: true }
  ];

  return (
    <AuthForm
      title="Reset Password"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      buttonText={loading ? "Resetting..." : "Reset Password"}
      disabled={loading}
    >
      <p>
        <a href="/login">Never mind, take me back</a>
      </p>
    </AuthForm>
  );
}

export default ResetPassword;