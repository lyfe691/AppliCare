// src/pages/Landing.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import styles from '../css/Landing.module.css';

function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className={styles.landing}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <img src="/applicare.png" alt="AppliCare Logo" height={40} />
                </div>
                <div className={styles.navButtons}>
                    <button 
                        className={styles.loginButton}
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                    <button 
                        className={styles.registerButton}
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1>Track Your Job Applications with Ease</h1>
                    <p className={styles.subtitle}>
                        Keep all your job applications organized in one place. 
                        Never miss a follow-up or deadline again.
                    </p>
                    <button 
                        className={styles.ctaButton}
                        onClick={() => navigate('/register')}
                    >
                        Start Tracking Now
                    </button>
                </section>

                <section className={styles.features}>
                    <div className={styles.feature}>
                        <h3>Organize</h3>
                        <p>Keep all your applications in one place</p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Track</h3>
                        <p>Monitor the status of each application</p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Succeed</h3>
                        <p>Improve your job search success rate</p>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} AppliCare. All rights reserved.</p>
                <div className={styles.footerLinks}>
                    <a href="https://github.com/lyfe691" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/yanis-sebastian-zürcher" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                    <a href="https://ysz.life" target="_blank" rel="noopener noreferrer">
                        Portfolio
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default Landing; 