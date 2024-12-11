import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
