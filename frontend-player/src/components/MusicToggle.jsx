import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Simple floating music toggle. Uses env var VITE_BG_MUSIC_URL or a soft default loop.
export default function MusicToggle() {
  const url = useMemo(
    () => import.meta.env.VITE_BG_MUSIC_URL || 'https://cdn.pixabay.com/download/audio/2021/09/30/audio_6e0a5f61be.mp3?filename=happy-kids-112334.mp3',
    []
  );
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const audioRef = useRef(null);

  useEffect(() => {
    const a = new Audio(url);
    a.loop = true;
    a.volume = volume;
    audioRef.current = a;
    return () => { a.pause(); a.src = ''; };
  }, [url]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (enabled) {
      a.play().catch(() => setEnabled(false));
    } else {
      a.pause();
    }
  }, [enabled]);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <motion.button
        aria-label={enabled ? 'Pause background music' : 'Play background music'}
        onClick={() => setEnabled(v => !v)}
        whileTap={{ scale: 0.92 }}
        className={`rounded-full px-4 py-3 shadow-lg border text-white font-bold ${enabled ? 'bg-green-500/90 border-white/30' : 'bg-gray-800/70 border-white/20'}`}
      >
        {enabled ? '🔊 Music On' : '🔈 Music Off'}
      </motion.button>

      <div className="hidden sm:flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full shadow border">
        <span className="text-xs font-semibold text-gray-700">Vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="accent-sky-500"
        />
      </div>
    </div>
  );
}

