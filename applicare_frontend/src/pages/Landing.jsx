// src/pages/Landing.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import styles from '../css/Landing.module.css';
import { FaGithub, FaLinkedin, FaSun, FaMoon, FaChevronDown, FaGlobe } from 'react-icons/fa';

// landing page for the app,  its the first page the potential user sees.

function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(true);
    const [activeFAQ, setActiveFAQ] = useState(null); // For FAQ dropdown

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);



    const toggleTheme = () => {
        const newTheme = !isDark ? 'dark' : 'light';
        setIsDark(!isDark);
        document.documentElement.classList.toggle('light-mode');
        document.body.style.backgroundColor = !isDark ? '#ffffff' : '#1a1f2d';
        localStorage.setItem('theme', newTheme);
    };

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    return (
        <div className={`${styles.landing} ${isDark ? styles.dark : styles.light}`}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <img src="/applicare.png" alt="AppliCare" />
                    <span className={styles.logoText}>AppliCare</span>
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
                            aria-label="GitHub Repository"
                        >
                            <FaGithub size={20} />
                        </a>
                        <button 
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
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
                        Get Started - It's Free →
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
                                <li>Apply to Netflix</li>   
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

                <section className={styles.faqSection}>
                    <h2>FAQ</h2>
                    <div className={styles.faqList}>
                        <div className={`${styles.faqItem} ${activeFAQ === 1 ? styles.active : ''}`}>
                            <button 
                                className={styles.faqQuestion}
                                onClick={() => toggleFAQ(1)}
                                aria-expanded={activeFAQ === 1}
                            >
                                <span>What makes AppliCare different?</span>
                                <FaChevronDown />
                            </button>
                            <div className={styles.faqAnswer}>
                                AppliCare is a job application management tool that helps you stay organized and never miss an opportunity.
                            </div>
                        </div>
                        <div className={`${styles.faqItem} ${activeFAQ === 2 ? styles.active : ''}`}>
                            <button 
                                className={styles.faqQuestion}
                                onClick={() => toggleFAQ(2)}
                                aria-expanded={activeFAQ === 2}
                            >
                                <span>Is AppliCare really free?</span>
                                <FaChevronDown />
                            </button>
                            <div className={styles.faqAnswer}>
                                Yes! AppliCare is free to use as its in beta.
                            </div>
                        </div>
                        <div className={`${styles.faqItem} ${activeFAQ === 3 ? styles.active : ''}`}>
                            <button 
                                className={styles.faqQuestion}
                                onClick={() => toggleFAQ(3)}
                                aria-expanded={activeFAQ === 3}
                            >
                                <span>How secure is my data?</span>
                                <FaChevronDown />
                            </button>
                            <div className={styles.faqAnswer}>
                                Your data is encrypted and stored securely. I use industry-standard security measures and never share your information with third parties.
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerMain}>
                        <p className={styles.copyright}>&copy; {new Date().getFullYear()} Applicare</p>
                        <div className={styles.footerDivider}></div>
                        <div className={styles.socialLinks}>
                            <a 
                                href="https://github.com/lyfe691/AppliCare" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="GitHub"
                                className={styles.socialLink}
                            >
                                <FaGithub size={18} />
                            </a>
                            <a 
                                href="https://linkedin.com/in/yanis-sebastian-zürcher" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="LinkedIn"
                                className={styles.socialLink}
                            >
                                <FaLinkedin size={18} />
                            </a>
                            <a 
                                href="https://ysz.life" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Prs Website"
                                className={styles.socialLink}
                            >
                                <FaGlobe size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

}

export default Landing;
