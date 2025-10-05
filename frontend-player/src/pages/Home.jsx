import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleSignIn from '../components/GoogleSignIn.jsx';
import TutorialModal from '../components/TutorialModal.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const [openTutorial, setOpenTutorial] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const buttons = [
    { to: '/game', label: 'Play Game', emoji: '🧩', color: 'from-pink-300 via-purple-300 to-blue-300', onClick: () => navigate('/game') },
    { to: null, label: 'Tutorial', emoji: '🧠', color: 'from-sky-300 via-cyan-300 to-emerald-300', onClick: () => setOpenTutorial(true) },
    { to: '/leaderboard', label: 'Leaderboard', emoji: '🏆', color: 'from-amber-300 via-orange-300 to-rose-300', onClick: () => navigate('/leaderboard') },
    { to: user ? '/profile' : '/login', label: 'Profile', emoji: '👤', color: 'from-violet-300 via-fuchsia-300 to-pink-300', onClick: () => navigate(user ? '/profile' : '/login') },
    { to: '/about', label: 'About Us', emoji: 'ℹ️', color: 'from-teal-300 via-emerald-300 to-lime-300', onClick: () => navigate('/about') },
  ];

  return (
    <div className="relative">
      {/* Soft floating colored blobs for extra playfulness */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-pink-300/40"
          initial={{ x: -100, y: -80, opacity: 0.6 }}
          animate={{ x: 40, y: -40, opacity: 0.9 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
        />
        <motion.div
          className="absolute right-0 top-20 w-80 h-80 rounded-full bg-sky-300/40"
          initial={{ x: 80, y: 0, opacity: 0.6 }}
          animate={{ x: -40, y: 40, opacity: 0.9 }}
          transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror' }}
        />
        <motion.div
          className="absolute left-1/3 bottom-10 w-64 h-64 rounded-full bg-violet-300/40"
          initial={{ y: 30, opacity: 0.6 }}
          animate={{ y: -30, opacity: 0.9 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror' }}
        />
      </div>

      <main className="container mx-auto px-4 py-10 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-slate-900">
              🎮 BrainBlox: Play, Learn, and Think!
            </span>
          </motion.h1>
          <p className="text-slate-800 text-lg md:text-xl max-w-2xl mx-auto">
            Sharpen your mind one puzzle at a time!
          </p>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
            {buttons.map((b, idx) => (
              <motion.button
                key={b.label}
                onClick={b.onClick}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl px-5 py-4 font-bold text-slate-900 shadow-lg bg-gradient-to-r ${b.color} border border-white/20`}
              >
                <span className="text-xl mr-2">{b.emoji}</span>{b.label}
              </motion.button>
            ))}
          </div>

          {/* Google Sign-in */}
          <div className="max-w-md mx-auto w-full">
            <GoogleSignIn onSuccessRedirect="/game" />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-10 text-slate-700 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} BrainBlox • v1.0 • Built with love for young minds 💖</p>
        </motion.footer>
      </main>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {openTutorial && (
          <TutorialModal open={openTutorial} onClose={() => setOpenTutorial(false)} />)
        }
      </AnimatePresence>

      {/* Background music toggle */}
      <MusicToggle />
    </div>
  );
}
