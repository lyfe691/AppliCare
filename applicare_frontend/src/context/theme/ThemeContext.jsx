import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function getInitialTheme() {
    // tries to get the theme from local storage, default to system if not found
    return localStorage.getItem('theme') || 'system';
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);
    const [effectiveTheme, setEffectiveTheme] = useState(
        theme === 'system' 
            ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            : theme
    );

    // update local storage whenever theme chnages
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                setEffectiveTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    // updates the effective theme whenever the theme changes
    useEffect(() => {
        setEffectiveTheme(
            theme === 'system'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                : theme
        );
    }, [theme]);

    // updates the body class when the effective theme changes
    useEffect(() => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${effectiveTheme}-theme`);
    }, [effectiveTheme]);

    const value = {
        theme,
        setTheme,
        effectiveTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 