import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import GoogleSignIn from '../components/GoogleSignIn.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/game');
    } catch (e) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md border-4 border-secondary">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome back!</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-3 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-primary text-white py-3 rounded-full hover:opacity-90">Login</button>
        </form>
        <p className="mt-3 text-sm">No account? <Link className="text-sky underline" to="/register">Register</Link></p>
        <GoogleSignIn />
      </motion.div>
    </div>
  );
}
