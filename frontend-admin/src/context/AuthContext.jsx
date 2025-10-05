import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token); else localStorage.removeItem('admin_token');
  }, [token]);

  const login = (t) => setToken(t);
  const logout = () => setToken(null);

  api.setTokenGetter(() => token);

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
