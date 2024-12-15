import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; 
import { ToastContainer } from "react-toastify";

// * now using toastify for easier notifications.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <ToastContainer />
      <App />
    </AuthProvider>
  </StrictMode>
);
