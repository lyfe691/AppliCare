import { Github, Linkedin, Globe } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a
            href="https://github.com/lyfe691"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="footer-icon" />
          </a>
          <a
            href="https://linkedin.com/in/yanis-sebastian-zürcher"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="footer-icon" />
          </a>
          <a
            href="https://ysz.life"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
          >
            <Globe className="footer-icon" />
          </a>
        </div>
        <p className="footer-text">&copy; {new Date().getFullYear()} AppliCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
