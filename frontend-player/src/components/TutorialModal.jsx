import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function normalizeVideoUrl(url) {
  if (!url) return '';
  try {
    // Convert youtu.be/<id> or youtube.com/watch?v=<id> to embed URL
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      // already embed or shorts
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) {
        const id2 = u.pathname.split('/')[2];
        if (id2) return `https://www.youtube.com/embed/${id2}`;
      }
    }
  } catch {}
  return url;
}

export default function TutorialModal({ open, onClose, videoUrl = (import.meta.env.VITE_TUTORIAL_URL || 'https://www.youtube.com/embed/8QKQG8s3SBM') }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-modal
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <div className="p-5 border-b bg-gradient-to-r from-primary/10 to-sky/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-extrabold text-primary">How to Play Sudoku 🎲</h2>
                <button onClick={onClose} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
                {videoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={normalizeVideoUrl(videoUrl)}
                    title="Sudoku Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : null}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[{
                  title: 'Learn the Rules', emoji: '🧠', text: 'Each row, column, and 3x3 box must contain numbers 1–9 with no repeats.'
                },{
                  title: 'Start Filling In', emoji: '✏️', text: 'Use logic and process of elimination to place numbers.'
                },{
                  title: 'Use Hints', emoji: '💡', text: 'Click “Hint” if you get stuck. Hints will fill a correct number.'
                },{
                  title: 'Finish the Puzzle', emoji: '🏆', text: 'Complete the grid to win! Aim for speed and accuracy.'
                }].map((s, idx) => (
                  <motion.div
                    key={s.title}
                    className="p-4 rounded-xl bg-sky-50 border border-sky-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <div className="text-lg font-bold text-sky-700 flex items-center gap-2">
                      <span className="text-xl">{s.emoji}</span> {s.title}
                    </div>
                    <p className="text-sky-900/80 mt-1 text-sm">{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
