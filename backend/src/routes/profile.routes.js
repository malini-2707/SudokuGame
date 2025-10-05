import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import GameResult from '../models/GameResult.js';

const router = Router();

router.get('/:id', auth(), async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const recent = await GameResult.find({ userId: id }).sort({ createdAt: -1 }).limit(20);
  res.json({
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    puzzlesSolved: user.puzzlesSolved,
    fastestTimeSeconds: user.fastestTimeSeconds,
    accuracyPercent: user.accuracyPercent,
    recentResults: recent.map(r => ({ id: r._id.toString(), puzzleId: r.puzzleId, timeSeconds: r.timeSeconds, accuracyPercent: r.accuracyPercent, completedAt: r.completedAt })),
  });
});

export default router;
