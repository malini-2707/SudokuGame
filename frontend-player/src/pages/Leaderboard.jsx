import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client.js';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetcher = async () => {
      try { const { data } = await api.get('/leaderboard'); if (alive) { setRows(data); setLoading(false); } } catch { setLoading(false); }
    };
    fetcher();
    const id = setInterval(fetcher, 10000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Leaderboard</h1>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="grid grid-cols-6 gap-2 p-3 font-semibold bg-gray-50 border-b">
            <div>Rank</div>
            <div>Player</div>
            <div>Solved</div>
            <div>Fastest</div>
            <div>Accuracy</div>
            <div>Badge</div>
          </div>
          <AnimatePresence>
            {rows.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`grid grid-cols-6 gap-2 p-3 border-b last:border-b-0 ${r.rank===1?'bg-yellow-50': r.rank===2?'bg-slate-50': r.rank===3?'bg-orange-50':''}`}>
                <div className="font-bold">#{r.rank}</div>
                <div className="flex items-center gap-2">
                  {r.avatarUrl ? <img src={r.avatarUrl} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-accent" />}
                  <span className="truncate" title={r.displayName}>{r.displayName}</span>
                </div>
                <div>{r.puzzlesSolved ?? 0}</div>
                <div>{r.fastestTimeSeconds!=null ? r.fastestTimeSeconds+'s' : '-'}</div>
                <div>{r.accuracyPercent ?? 0}%</div>
                <div>{r.rank===1?'🥇': r.rank===2?'🥈': r.rank===3?'🥉': ''}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
