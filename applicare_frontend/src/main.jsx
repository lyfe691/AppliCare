// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

// * now using toastify for easier notifications.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
      <App />
  </StrictMode>
);
