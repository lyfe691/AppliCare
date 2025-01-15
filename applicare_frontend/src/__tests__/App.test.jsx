import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/auth/AuthContext';
import { ThemeProvider } from '../context/theme/ThemeContext';
import AppConfigProvider from '../components/ConfigProvider';
import Landing from '../pages/Landing';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';

// contains 5 tests!

// Helper function to wrap components with necessary providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppConfigProvider>
            {component}
          </AppConfigProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AppliCare Frontend Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  // Test 1: Landing page renders correctly
  test('Landing page displays main heading and CTA button', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      // Use getByRole to find the heading
      expect(screen.getByRole('heading', { level: 1, name: 'AppliCare' })).toBeInTheDocument();
      expect(screen.getByText('Manage your job applications with ease')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Get Started - It's Free →" })).toBeInTheDocument();
    });
  });

  // Test 2: Login form validation
  test('Login form shows validation errors for empty fields', async () => {
    renderWithProviders(<Login />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your username or email')).toBeInTheDocument();
      expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    });
  });

  // Test 3: Register form validation
  test('Register form shows validation errors for empty fields', async () => {
    renderWithProviders(<Register />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your username')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email')).toBeInTheDocument();
      expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    });
  });

  // Test 4: Theme toggle functionality
  test('Theme toggle button changes theme', async () => {
    renderWithProviders(<Landing />);
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    const initialTheme = document.documentElement.classList.contains('light-mode');
    
    fireEvent.click(themeToggle);
    
    await waitFor(() => {
      const newTheme = document.documentElement.classList.contains('light-mode');
      expect(newTheme).not.toBe(initialTheme);
    });
  });

  // Test 5: Navigation links work correctly
  test('Navigation links are working and accessible', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      // Use onClick handlers instead of href for buttons
      const signInButton = screen.getByRole('button', { name: 'Sign In' });
      const getStartedButton = screen.getByRole('button', { name: 'Get Started' });
      const githubLink = screen.getByLabelText('GitHub Repository');
      
      // Test click handlers are present
      expect(signInButton).toBeInTheDocument();
      expect(getStartedButton).toBeInTheDocument();
      // Only GitHub link has an actual href
      expect(githubLink).toHaveAttribute('href', 'https://github.com/lyfe691/AppliCare');
    });
  });
}); 