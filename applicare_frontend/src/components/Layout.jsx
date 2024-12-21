// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/Layout.css";

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
