import React, { createContext, useContext, useState, useEffect } from 'react';
import AppLoader from '../components/common/AppLoader';

const AuthContext = createContext();

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const PING_TIMEOUT = 60000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await pingBackend();
      await restoreSession();
      setInitializing(false);
    };
    initApp();
  }, []);

  const pingBackend = async () => {
    const startTime = Date.now();
    while (Date.now() - startTime < PING_TIMEOUT) {
      try {
        const res = await fetch(`${API}/`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) return;
      } catch {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  };

  const restoreSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Session restore failed:', err.message);
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (initializing) return <AppLoader />;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);