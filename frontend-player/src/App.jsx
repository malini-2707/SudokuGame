import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Game from './pages/Game.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import About from './pages/About.jsx';
import Header from './components/Header.jsx';
import BackgroundLayer from './components/BackgroundLayer.jsx';
import Home from './pages/Home.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative">
        <BackgroundLayer />
        <Header />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

