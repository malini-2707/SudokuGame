import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Public leaderboard (top players)
router.get('/', async (req, res) => {
  const top = await User.find({ role: 'player' })
    .sort({ puzzlesSolved: -1, fastestTimeSeconds: 1, accuracyPercent: -1 })
    .limit(50);
  res.json(top.map((u, idx) => ({
    rank: idx + 1,
    id: u._id.toString(),
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    puzzlesSolved: u.puzzlesSolved,
    fastestTimeSeconds: u.fastestTimeSeconds,
    accuracyPercent: u.accuracyPercent,
  })));
});

export default router;
