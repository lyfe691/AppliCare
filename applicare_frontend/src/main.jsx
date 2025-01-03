// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppComponent from "./App.jsx";
import { App } from "antd";

createRoot(document.getElementById("root")).render(
  <App>
    <StrictMode>
        <AppComponent />
    </StrictMode>
  </App>
);
