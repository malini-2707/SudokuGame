import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Members from './pages/Members.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/members" element={<PrivateRoute><Members /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
