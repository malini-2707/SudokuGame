import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

function secondsToHMS(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Members() {
  const { logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/admin/members');
      setMembers(data);
      setError('');
    } catch (e) {
      setError('Session expired. Please login again.');
    }
  };

  useEffect(() => {
    fetchMembers();
    const id = setInterval(fetchMembers, 5000);
    return () => clearInterval(id);
  }, []);

  const forceLogout = async (id) => {
    await api.post(`/admin/force-logout/${id}`);
    fetchMembers();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Members</h1>
        <button className="bg-gray-800 text-white px-3 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-6 gap-2 p-3 font-semibold bg-gray-50 border-b">
          <div>Email</div>
          <div>Name</div>
          <div>Status</div>
          <div>Puzzle</div>
          <div>Progress</div>
          <div>Actions</div>
        </div>
        <AnimatePresence>
          {members.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-6 gap-2 p-3 border-b last:border-b-0">
              <div className="truncate" title={m.email}>{m.email}</div>
              <div className="truncate" title={m.displayName}>{m.displayName}</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${m.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {m.online ? 'Online' : 'Offline'}
                </span>
                <div className="text-xs text-gray-500">Last: {m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleString() : '-'}</div>
                <div className="text-xs text-gray-500">Time: {secondsToHMS(m.timeSpentSeconds||0)}</div>
              </div>
              <div>{m.currentPuzzleId || '-'}</div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-primary rounded" style={{ width: `${m.progressPercent||0}%` }} />
                  </div>
                  <span className="text-sm font-semibold">{m.progressPercent||0}%</span>
                </div>
              </div>
              <div>
                <button onClick={()=>forceLogout(m.id)} className="px-3 py-1 bg-red-500 text-white rounded">Force Logout</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
