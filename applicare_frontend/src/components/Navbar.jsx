import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SettingsIcon } from "lucide-react";
import AuthModal from "./AuthModal"; 
function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const openAuthModal = () => {
    setIsModalOpen(true); 
  };

  const closeAuthModal = () => {
    setIsModalOpen(false); 
  };

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
          <li className="nav-item" style={{ "--i": 4 }}>
            {/* Login Button Opens Modal */}
            <button className="nav-auth-button" onClick={openAuthModal}>
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* authmodal temp */}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </>
  );
}

export default Navbar;
