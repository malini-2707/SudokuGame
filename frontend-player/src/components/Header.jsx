import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white sticky top-0 z-10 shadow">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-grape">BrainBlox</Link>
        <nav className="flex items-center gap-4">
          <Link to="/game" className="hover:opacity-80">Game</Link>
          <Link to="/leaderboard" className="hover:opacity-80">Leaderboard</Link>
          <Link to="/about" className="hover:opacity-80">About</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:opacity-80">Profile</Link>
              <span className="text-sm">Hi, <span className="font-bold">{user.displayName}</span></span>
              <button onClick={logout} className="px-3 py-1 bg-primary text-white rounded-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-primary text-white rounded-full">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-secondary text-white rounded-full">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

