// src/features/auth/pages/Register.jsx

import { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom"

function Register() {
  const { registerUser } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const msg = await registerUser(data.username, data.email, data.password);
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
    { name: "username", placeholder: "Username", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    { name: "password", type: "password", placeholder: "Password", required: true }
  ];

  return (
    <AuthForm
      title="Register for AppliCare"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      buttonText={loading ? "Registering..." : "Register"}
    >
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </AuthForm>
  );
}

export default Register;