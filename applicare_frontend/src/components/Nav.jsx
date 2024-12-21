// src/components/Nav.jsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext"; 
import "../css/Nav.css";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // access user + logout

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    setIsOpen(false); // close mobile menu when route changes
  }, [location]);

  return (
    <>
      {/* Overlay for mobile menu */}
      <div
        className={`nav-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      ></div>

      {/* Navbar */}
      <nav className="nav-bar">
        <div className="nav-brand">
          <Link to="/" className="nav-logo-link" aria-label="Home">
            <img src="/applicare.png" height={40} alt="AppliCare Logo" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className={`nav-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-list ${isOpen ? "is-open" : ""}`} id="nav-list">
          <li className="nav-item" style={{ "--i": 1 }}>
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item" style={{ "--i": 2 }}>
            <Link
              to="/test-mongo"
              className={`nav-link ${
                location.pathname === "/test-mongo" ? "active" : ""
              }`}
            >
              Test Mongo
            </Link>
          </li>
          <li className="nav-item" style={{ "--i": 3 }}>
            <Link
              to="/long-page"
              className={`nav-link ${
                location.pathname === "/long-page" ? "active" : ""
              }`}
            >
              Long Page
            </Link>
          </li>

          {/* Auth button logic */}
          <li className="nav-item" style={{ "--i": 4 }}>
            {user ? (
              <button className="nav-auth-button" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-btn">
                <button className="nav-auth-button">Login</button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
