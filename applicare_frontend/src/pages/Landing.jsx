// src/pages/Landing.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import styles from '../css/Landing.module.css';

function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('light-mode');
        document.body.style.backgroundColor = isDark ? '#ffffff' : '#1a1f2d';
    };

    return (
        <div className={`${styles.landing} ${isDark ? styles.dark : styles.light}`}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <img src="/applicare.png" alt="AppliCare" />
                    <span>AppliCare</span>
                </div>
                <div className={styles.navButtons}>
                    <div className={styles.authButtons}>
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
                    <div className={styles.separator}></div>
                    <div className={styles.iconButtons}>
                        <a 
                            href="https://github.com/lyfe691/AppliCare" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.githubLink}
                        >
                            <svg height="24" viewBox="0 0 16 16" width="24">
                                <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                        </a>
                        <button 
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5"/>
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.main}>
                <div className={styles.heroContent}>
                    <h1>AppliCare</h1>
                    <p className={styles.subtitle}>
                        Manage your job applications with ease
                    </p>
                    <button 
                        className={styles.ctaButton}
                        onClick={() => navigate('/register')}
                    >
                        View full features →
                    </button>
                </div>

                <div className={styles.demoSection}>
                    <div className={styles.demoCard}>
                        <div className={styles.statsCard}>
                            <div className={styles.date}>
                                <span>{new Date().toLocaleString('default', { month: 'long' })}</span>
                                <h2>{new Date().getDate()}</h2>
                                <span>{new Date().getFullYear()}</span>
                            </div>
                        </div>
                        <div className={styles.todoCard}>
                            <h3>My Tasks</h3>
                            <ul>
                                <li>Follow up with Google</li>
                                <li>Update Resume</li>
                                <li>Prepare for Interview</li>
                            </ul>
                        </div>
                        <div className={styles.metricsCard}>
                            <div className={styles.graph}>
                                <h3>Applications</h3>
                                <div className={styles.graphContent}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerTop}>
                        <div className={styles.footerLogo}>
                            <img src="/applicare.png" alt="AppliCare" />
                            <span>AppliCare</span>
                        </div>
                        <p></p>
                    </div>
                    <div className={styles.footerBottom}>
                        <p>&copy; {new Date().getFullYear()} AppliCare. All rights reserved.</p>
                        <div className={styles.socialLinks}>
                            <a href="https://github.com/lyfe691/AppliCare" target="_blank" rel="noopener noreferrer">
                                <svg height="20" viewBox="0 0 16 16" width="20">
                                    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com/in/yanis-sebastian-zürcher" target="_blank" rel="noopener noreferrer">
                                <svg height="20" width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing; 