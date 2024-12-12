import { useEffect, useRef, useState } from "react";
import { X, Github, Globe } from "lucide-react"; // Importing icons

function AuthModal({ isOpen, onClose }) {
  const modalRef = useRef();
  const [isSignUp, setIsSignUp] = useState(false);

  // Focus trap: keep focus inside the modal and handle Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Trap focus inside modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements?.[0];
      const lastFocusable = focusableElements?.[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto"; // Restore scrolling
    };
  }, [isOpen, onClose]);

  // Close modal if user clicks outside content
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      onClick={handleClickOutside}
      role="dialog"
      aria-modal="true"
    >
      <div className="auth-modal" ref={modalRef}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
         &#x2715; {/* https://stackoverflow.com/questions/5353461/unicode-character-for-x-cancel-close */}
        </button>

        {/* Modal Content */}
        <div className="auth-modal-content">
          <h2 className="auth-modal-title">{isSignUp ? "Sign Up" : "Login"}</h2>

          {/* Social Login Buttons */}
          <div className="auth-modal-social">
            <button type="button" className="auth-social-button github-button">
              <Github size={20} />
              <span>Continue with GitHub</span>
            </button>
            <button type="button" className="auth-social-button google-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="#000000">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="auth-modal-divider">
            <span>OR</span>
          </div>

          {/* Auth Form */}
          <form className="auth-modal-form">
            <label htmlFor="email" className="auth-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="auth-form-input"
              required
            />

            <label htmlFor="password" className="auth-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="auth-form-input"
              required
            />

            {isSignUp && (
              <>
                <label htmlFor="confirm-password" className="auth-form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  className="auth-form-input"
                  required
                />
              </>
            )}

            <button type="submit" className="auth-submit-button">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="auth-modal-footer">
            {!isSignUp && (
              <a href="/forgot-password" className="auth-forgot-link">
                Forgot Password?
              </a>
            )}
            <p className="auth-signup-prompt">
              {isSignUp ? "Already have an account? " : "Don’t have an account? "}
              <a
                className="auth-toggle-link"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthModal;
