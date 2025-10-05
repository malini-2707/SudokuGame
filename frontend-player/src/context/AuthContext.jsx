import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  const login = (t, u) => { setToken(t); setUser(u); };
  const logout = async () => {
    try { if (user?.email) await api.post('/auth/logout', { email: user.email }); } catch {}
    setToken(null); setUser(null);
  };

  api.setTokenGetter(() => token);

  return (
    <AuthCtx.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
