import { createContext, useState, useContext, useEffect } from 'react';

// ✅ Define API base URL using environment variable (fallback to localhost for dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Check stored token/user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // 🔑 Login function
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // 📝 Register function
  const register = async (username, password, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // 🚪 Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
