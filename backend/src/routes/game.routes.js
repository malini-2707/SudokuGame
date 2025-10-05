import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import GameResult from '../models/GameResult.js';
import { generatePuzzle, findOneHint } from '../utils/sudoku.js';

const router = Router();

// Get my current game status
router.get('/status', auth(), async (req, res) => {
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ message: 'Not found' });
  res.json({
    currentPuzzleId: u.currentPuzzleId,
    progressPercent: u.progressPercent,
    timeSpentSeconds: u.timeSpentSeconds,
    lastActiveAt: u.lastActiveAt,
    puzzlesSolved: u.puzzlesSolved,
    fastestTimeSeconds: u.fastestTimeSeconds,
    accuracyPercent: u.accuracyPercent,
  });
});

// Log puzzle completion
router.post('/complete', auth(), async (req, res) => {
  const { puzzleId, timeSeconds, accuracyPercent } = req.body;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ message: 'Not found' });

  const result = await GameResult.create({
    userId: u._id,
    puzzleId: puzzleId || u.currentPuzzleId || 'unknown',
    timeSeconds: Math.max(0, Number(timeSeconds) || 0),
    accuracyPercent: Math.max(0, Math.min(100, Number(accuracyPercent) || 100)),
  });

  u.puzzlesSolved += 1;
  if (!u.fastestTimeSeconds || result.timeSeconds < u.fastestTimeSeconds) {
    u.fastestTimeSeconds = result.timeSeconds;
  }
  u.accuracyPercent = Math.round(((u.accuracyPercent + result.accuracyPercent) / 2));
  u.progressPercent = 100;
  u.lastActiveAt = new Date();
  await u.save();

  res.json({ ok: true, resultId: result._id.toString() });
});

export default router;

// Get a new random puzzle
router.get('/new', auth(), async (req, res) => {
  const level = String(req.query.level || 'medium').toLowerCase();
  const grid = generatePuzzle(level);
  const puzzleId = `preset-${Date.now()}`;
  // Optionally store current puzzle on user
  const u = await User.findById(req.user.id);
  if (u) { u.currentPuzzleId = puzzleId; u.progressPercent = 0; await u.save(); }
  res.json({ puzzleId, level, grid });
});

// Compute a hint for current board
router.post('/hint', auth(), async (req, res) => {
  const { board } = req.body; // 9x9 numbers with 0 as empty
  if (!Array.isArray(board) || board.length !== 9 || !board.every(r => Array.isArray(r) && r.length === 9)) {
    return res.status(400).json({ message: 'Invalid board' });
  }
  const hint = findOneHint(board);
  if (!hint) return res.status(204).send();
  return res.json(hint);
});
