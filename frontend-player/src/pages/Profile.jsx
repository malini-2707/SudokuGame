import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

function secondsToHMS(sec) {
  if (sec == null) return '-';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetcher = async () => {
      try {
        const { data } = await api.get(`/profile/${user.id}`);
        if (alive) { setData(data); setLoading(false); }
      } catch (e) { setLoading(false); }
    };
    fetcher();
    return () => { alive = false; };
  }, [user?.id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load profile.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow">
        <div className="flex items-center gap-4">
          {data.avatarUrl ? <img src={data.avatarUrl} className="w-16 h-16 rounded-full" /> : <div className="w-16 h-16 rounded-full bg-accent" />}
          <div>
            <div className="text-2xl font-bold">{data.displayName}</div>
            <div className="text-sm text-gray-600">{data.email}</div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">Puzzles Solved</div>
          <div className="text-2xl font-extrabold text-primary">{data.puzzlesSolved ?? 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Fastest Time</div>
          <div className="text-2xl font-extrabold text-secondary">{secondsToHMS(data.fastestTimeSeconds)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Accuracy</div>
          <div className="text-2xl font-extrabold text-grape">{data.accuracyPercent ?? 0}%</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow">
        <div className="text-lg font-semibold mb-2">Recent Games</div>
        <div className="grid grid-cols-4 gap-2 font-semibold bg-gray-50 p-2 rounded">
          <div>Puzzle</div>
          <div>Time</div>
          <div>Accuracy</div>
          <div>Completed</div>
        </div>
        <div className="divide-y">
          {data.recentResults?.map(r => (
            <div key={r.id} className="grid grid-cols-4 gap-2 p-2">
              <div>{r.puzzleId}</div>
              <div>{secondsToHMS(r.timeSeconds)}</div>
              <div>{r.accuracyPercent}%</div>
              <div>{new Date(r.completedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
