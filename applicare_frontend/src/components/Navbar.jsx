import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // call auth (now with useState for direct apporach and instant update..)
  const { isAuthenticated, openAuthModal, logout } = useAuth();

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
          <li className="nav-item" style={{ "--i": 4 }}>
            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <button className="nav-auth-button" onClick={logout}>
                Logout
              </button>
            ) : (
              <button className="nav-auth-button" onClick={openAuthModal}>
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
