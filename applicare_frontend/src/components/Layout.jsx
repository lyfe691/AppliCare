// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/Layout.css";

// this layout component is used to wrap the entire app

export default function Layout() {
  return (
    <div className="layout">
      <Nav />
      <main className="layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
