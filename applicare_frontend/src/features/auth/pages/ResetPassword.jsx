// src/features/auth/pages/ResetPassword.jsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

function ResetPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // get token from query parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!token) {
      setError("Invalid or missing reset token.");
      setLoading(false);
      return;
    }

    try {
      const msg = await resetPassword(token, data.password);
      setSuccess(msg);
      
      /* redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      */
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
      loading={loading}
      buttonText={loading ? "Resetting..." : "Reset Password"}
    >
      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </AuthForm>
  );
}

export default ResetPassword;