import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import GoogleSignIn from '../components/GoogleSignIn.jsx';

export default function Register() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { email, displayName, password });
      login(data.token, data.user);
      navigate('/game');
    } catch (e) { setError('Registration failed'); }
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md border-4 border-sky">
        <h1 className="text-3xl font-bold text-secondary mb-4">Join the fun!</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-3 rounded border" placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
          <input className="w-full p-3 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-secondary text-white py-3 rounded-full hover:opacity-90">Register</button>
        </form>
        <p className="mt-3 text-sm">Have an account? <Link className="text-primary underline" to="/login">Login</Link></p>
        <GoogleSignIn />
      </motion.div>
    </div>
  );
}
