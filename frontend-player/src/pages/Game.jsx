import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import SudokuBoard from '../components/SudokuBoard.jsx';
import TutorialModal from '../components/TutorialModal.jsx';

export default function Game() {
  const { user, setUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const start = useRef(Date.now());
  const totalElapsed = useRef(0);
  const [puzzleId, setPuzzleId] = useState('');
  const [grid, setGrid] = useState(null);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [incomingHint, setIncomingHint] = useState(null);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loadingNew, setLoadingNew] = useState(false);
  const [candidatesTick, setCandidatesTick] = useState(null);
  const [candidatesInfo, setCandidatesInfo] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const progressRef = useRef(0);
  const [level, setLevel] = useState(() => {
    try { return localStorage.getItem('sudoku_level') || 'medium'; } catch { return 'medium'; }
  });
  const [showTutorial, setShowTutorial] = useState(() => {
    try { return localStorage.getItem('sudoku_tutorial_viewed') ? false : false; } catch { return false; }
  });
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    try { localStorage.setItem('sudoku_level', level); } catch {}
  }, [level]);

  // Load puzzle on mount and whenever level changes (new game at selected difficulty)
  useEffect(() => {
    (async () => {
      setLoadingNew(true);
      setIncomingHint(null);
      setCurrentBoard(null);
      setCandidatesInfo('');
      setCandidatesTick(null);
      try {
        const { data } = await api.get(`/game/new`, { params: { level } });
        setPuzzleId(data.puzzleId);
        setGrid(data.grid);
        setHintsLeft(3);
        setProgress(0);
        totalElapsed.current = 0;
        start.current = Date.now();
      } catch {}
      setLoadingNew(false);
    })();
  }, [level]);

  // Heartbeat status interval; rebind only when puzzleId changes
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor((Date.now() - start.current)/1000);
      start.current = Date.now();
      totalElapsed.current += delta;
      api.patch('/user/status', {
        currentPuzzleId: puzzleId || 'starter-1',
        progressPercent: progressRef.current,
        deltaTimeSeconds: delta,
      }).catch(()=>{});
    }, 5000);
    return () => clearInterval(interval);
  }, [puzzleId]);

  const onProgress = (board, pct) => {
    setProgress(pct);
    setCurrentBoard(board);
    setUser(u => u ? { ...u, progressPercent: pct, currentPuzzleId: puzzleId || 'starter-1' } : u);
  };

  const onSolved = async ({ accuracyPercent }) => {
    setUser(u => u ? { ...u, progressPercent: 100 } : u);
    // Add remaining elapsed since last tick
    const delta = Math.floor((Date.now() - start.current)/1000); totalElapsed.current += delta; start.current = Date.now();
    try {
      await api.post('/game/complete', {
        puzzleId: puzzleId || 'starter-1',
        timeSeconds: totalElapsed.current,
        accuracyPercent: accuracyPercent ?? 100,
      });
    } catch {}
  };

  const resetPuzzle = async () => {
    setLoadingNew(true);
    setIncomingHint(null);
    setCurrentBoard(null);
    setCandidatesInfo('');
    setCandidatesTick(null);
    try {
      const { data } = await api.get('/game/new', { params: { level } });
      setPuzzleId(data.puzzleId);
      setGrid(data.grid);
      setHintsLeft(3);
      setProgress(0);
      totalElapsed.current = 0;
      start.current = Date.now();
    } catch {}
    setLoadingNew(false);
  };

  const requestHint = async () => {
    if (!currentBoard || hintsLeft <= 0 || hintLoading) return;
    setHintLoading(true);
    try {
      const { data } = await api.post('/game/hint', { board: currentBoard });
      if (data && typeof data.r === 'number') {
        setIncomingHint({ r: data.r, c: data.c, val: data.val });
        setHintsLeft(h => Math.max(0, h - 1));
      }
    } catch {}
    setHintLoading(false);
  };

  const showCandidates = () => {
    // trigger candidates overlay for selected cell
    setCandidatesTick(Date.now());
  };

  const openTutorial = () => setShowTutorial(true);
  const closeTutorial = () => { setShowTutorial(false); try { localStorage.setItem('sudoku_tutorial_viewed', '1'); } catch {} };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg">Puzzle: <span className="font-bold">{puzzleId || 'Loading...'}</span></div>
            <div className="text-sm">Progress: <span className="font-bold text-primary">{progress}%</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm">Player: <span className="font-bold text-grape">{user?.displayName}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Level:</span>
              <div className="flex bg-gray-100 rounded-full p-1">
                {[
                  { key: 'easy', label: 'Easy', emoji: '🟢' },
                  { key: 'medium', label: 'Medium', emoji: '🟡' },
                  { key: 'hard', label: 'Hard', emoji: '🔴' },
                ].map(opt => (
                  <motion.button
                    key={opt.key}
                    onClick={() => setLevel(opt.key)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-full text-sm font-bold ${level===opt.key ? 'bg-white text-primary shadow' : 'text-gray-600'}`}
                    aria-pressed={level===opt.key}
                  >{opt.emoji} {opt.label}</motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <motion.button onClick={resetPuzzle} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-secondary text-white font-bold">
          {loadingNew ? 'Loading...' : 'Reset'}
        </motion.button>
        <motion.button onClick={requestHint} disabled={hintsLeft<=0||hintLoading} whileTap={{ scale: 0.95 }} className={`px-4 py-2 rounded-full ${(hintsLeft>0&&!hintLoading)?'bg-sky':'bg-gray-400'} text-white font-bold`}>
          {hintLoading? 'Hint…' : `Hint (${hintsLeft})`}
        </motion.button>
        <motion.button onClick={showCandidates} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-primary text-white font-bold">
          Candidates
        </motion.button>
        <motion.button onClick={openTutorial} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-amber-500 text-white font-bold">
          Tutorial
        </motion.button>
      </div>

      {candidatesInfo && (
        <div className="text-sm text-sky-700">{candidatesInfo}</div>
      )}

      <AnimatePresence mode="wait">
        {grid && (
          <motion.div
            key={`${level}-${puzzleId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <SudokuBoard initial={grid} onProgress={onProgress} onSolved={onSolved} incomingHint={incomingHint}
              triggerCandidates={candidatesTick}
              onCandidatesShown={(count)=> setCandidatesInfo(count?`Possible numbers: ${count}`:'')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TutorialModal open={showTutorial} onClose={closeTutorial} videoUrl="https://youtu.be/8zRXDsGydeQ?si=R5k_-Ck0cmC4dsgk" />
    </div>
  );
}
