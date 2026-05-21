import React, { createContext, useContext, useState, useEffect } from 'react';
import AppLoader from '../components/common/AppLoader';

const AuthContext = createContext();

// const API = 'http://localhost:5000'; // Change to your Render URL for production
const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
// How long to wait for backend ping before giving up (ms)
const PING_TIMEOUT = 60000; // 60 seconds for Render cold start

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Step 1: Wake up backend (handles Render cold start)
      await pingBackend();

      // Step 2: Restore session if token exists
      await restoreSession();

      setInitializing(false);
    };

    initApp();
  }, []);

  // Ping backend until it responds
  const pingBackend = async () => {
    const startTime = Date.now();

    while (Date.now() - startTime < PING_TIMEOUT) {
      try {
        const res = await fetch(`${BASE_URL}/`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          setBackendReady(true);
          return; // Backend is awake
        }
      } catch {
        // Backend not ready yet, wait and retry
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    // Timeout — proceed anyway (might still work)
    setBackendReady(true);
  };

  const restoreSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
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
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
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

  // Show loader while backend is waking up or session is restoring
  if (initializing) {
    return <AppLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);