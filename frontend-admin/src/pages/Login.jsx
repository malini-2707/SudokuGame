import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      login(data.token);
      navigate('/members');
    } catch (e) {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-4">Admin Login</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-3 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full p-3 rounded border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-primary text-white py-3 rounded">Login</button>
        </form>
      </motion.div>
    </div>
  );
}
