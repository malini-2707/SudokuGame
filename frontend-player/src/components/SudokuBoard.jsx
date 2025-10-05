import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { isValid, percentComplete } from '../utils/sudoku.js';

export default function SudokuBoard({ initial, onProgress, onSolved, incomingHint, triggerCandidates, onCandidatesShown }) {
  const given = useMemo(() => initial.map(row => row.map(v => v!==0)), [initial]);
  const [board, setBoard] = useState(() => initial.map(r=>[...r]));
  const [selected, setSelected] = useState([0,0]);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [candidatesAt, setCandidatesAt] = useState(null); // { r, c }

  // simple sound effects using Web Audio API
  const beep = (freq=880, dur=0.08, type='sine', vol=0.05) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
      g.gain.value = vol; o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, dur*1000);
    } catch {}
  };

  // apply incoming hint and glow
  useEffect(() => {
    if (!incomingHint) return;
    const { r, c, val } = incomingHint;
    if (r==null || c==null || val==null) return;
    if (given[r][c]) return;
    setBoard(prev => {
      if (prev[r][c] !== 0) return prev;
      const next = prev.map(row=>[...row]);
      next[r][c] = val;
      return next;
    });
    const el = document.getElementById(`cell-${r}-${c}`);
    if (el) {
      el.animate([
        { boxShadow: '0 0 0px 0px rgba(255,215,0,0.0)', background: '#fffbe6' },
        { boxShadow: '0 0 12px 6px rgba(255,215,0,0.7)', background: '#fff3bf' },
        { boxShadow: '0 0 0px 0px rgba(255,215,0,0.0)', background: 'white' },
      ], { duration: 700, easing: 'ease-in-out' });
    }
  }, [incomingHint]);

  // trigger candidates overlay for currently selected empty cell
  useEffect(() => {
    if (triggerCandidates == null) return;
    const [r, c] = selected;
    if (given[r][c] || board[r][c] !== 0) {
      setCandidates([]);
      setCandidatesAt(null);
      onCandidatesShown?.(0);
      return;
    }
    const opts = [];
    for (let v=1; v<=9; v++) if (isValid(board, r, c, v)) opts.push(v);
    setCandidates(opts);
    setCandidatesAt({ r, c });
    const el = document.getElementById(`cell-${r}-${c}`);
    if (el) {
      el.animate([
        { boxShadow: '0 0 0px 0px rgba(100,181,246,0.0)', background: '#eef7ff' },
        { boxShadow: '0 0 10px 5px rgba(100,181,246,0.7)', background: '#e3f2fd' },
        { boxShadow: '0 0 0px 0px rgba(100,181,246,0.0)', background: 'white' },
      ], { duration: 600, easing: 'ease-in-out' });
    }
    onCandidatesShown?.(opts.length);
  }, [triggerCandidates]);

  useEffect(() => { onProgress?.(board, percentComplete(board)); }, [board]);

  // reset board when a new initial is received
  useEffect(() => {
    setBoard(initial.map(r=>[...r]));
  }, [initial]);

  useEffect(() => {
    const pct = percentComplete(board);
    if (pct===100) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const accuracy = attempts>0 ? Math.max(0, Math.round(((attempts - wrongAttempts)/attempts)*100)) : 100;
      onSolved?.({ attempts, wrongAttempts, accuracyPercent: accuracy });
    }
  }, [board]);

  const setCell = (r,c,val) => {
    if (given[r][c]) return;
    const v = Number(val);
    if (v<1 || v>9) return;
    setAttempts(a => a+1);
    if (!isValid(board, r, c, v)) {
      setMessage('Oops! Try another number.');
      setTimeout(()=>setMessage(''), 800);
      pulseCell(r,c);
      setWrongAttempts(w => w+1);
      beep(200, 0.08, 'square');
      return;
    }
    beep(880, 0.06, 'sine');
    setBoard(prev => {
      const next = prev.map(row=>[...row]);
      next[r][c] = v;
      return next;
    });
  };

  const clearCell = (r,c) => {
    if (given[r][c]) return;
    setBoard(prev => {
      const next = prev.map(row=>[...row]);
      next[r][c] = 0;
      return next;
    });
  };

  const pulseCell = (r,c) => {
    const el = document.getElementById(`cell-${r}-${c}`);
    if (!el) return;
    el.animate([
      { transform: 'scale(1)', background: '#ffe5e5' },
      { transform: 'scale(1.05)', background: '#ffcccc' },
      { transform: 'scale(1)', background: 'white' },
    ], { duration: 300 });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-9 bg-white border-8 border-primary rounded-xl overflow-hidden shadow-2xl">
        {board.map((row,r) => row.map((val,c) => (
          <motion.button
            id={`cell-${r}-${c}`}
            key={`${r}-${c}`}
            onClick={()=>setSelected([r,c])}
            className={`w-12 h-12 md:w-14 md:h-14 border text-xl md:text-2xl font-bold ${given[r][c] ? 'bg-secondary/20' : 'bg-white'} ${ (r%3===2&&c!==8 ? 'border-r-4' : '')}`}
            style={{ borderColor: (r%3===2||c%3===2)?'#ddd':'#eee' }}
            whileTap={{ scale: 0.92 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {val!==0 ? (
                <span>{val}</span>
              ) : (
                candidatesAt && candidatesAt.r===r && candidatesAt.c===c && candidates.length>0 ? (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 text-xs text-gray-500">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <div key={n} className={`flex items-center justify-center ${candidates.includes(n)?'text-sky-600':'opacity-20'}`}>{n}</div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </motion.button>
        )))}
      </div>

      <div className="flex gap-2">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <motion.button key={n} onClick={()=>setCell(selected[0], selected[1], n)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-grape text-white font-bold" whileTap={{ scale: 0.9 }}>{n}</motion.button>
        ))}
        <motion.button onClick={()=>clearCell(selected[0], selected[1])} className="w-16 h-10 md:h-12 rounded-full bg-sky text-white font-bold" whileTap={{ scale: 0.9 }}>Clear</motion.button>
      </div>
      {message && <div className="text-red-600 text-sm">{message}</div>}
    </div>
  );
}
