// src/components/Footer.jsx

import { Github, Linkedin, Globe } from 'lucide-react';
import '../css/Footer.css';
import { Link} from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-branding">
            <span className="footer-logo">AppliCare<sup className="beta-tag">beta</sup></span>
            <span className="footer-tagline">Manage your job applications with ease.</span>
            <span className="footer-tagline">A project made with <span className="heart">❤️</span> by <Link to="https://ysz.life">Yanis Sebastian Zürcher</Link></span>
          </div>
          
          <div className="footer-links">
            <a
              href="https://github.com/lyfe691"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-link"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/yanis-sebastian-zürcher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-link"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://ysz.life"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="footer-link"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} AppliCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
