import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // close the menu when navigating to a new page.
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <div
        className={`nav-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      ></div>

      <nav className="nav-bar">
        <div className="nav-brand">
          <Link to="/" className="nav-logo-link" aria-label="Home">
            {/* the AppliCare logo */}
            <img src="/applicare.png" height={40} alt="AppliCare Logo" />
          </Link>
        </div>

        <button
          className={`nav-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="nav-list"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
