// src/features/auth/pages/Register.jsx

import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function Register() {
  const { registerUser } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(data) {
    setError(null);
    setSuccess(null);

    try {
      const msg = await registerUser(data.username, data.email, data.password);
      setSuccess(msg);

      // redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
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
      buttonText="Register"
    >
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </AuthForm>
  );
}

export default Register;