import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import GameResult from '../models/GameResult.js';

const router = Router();

// Get my scores and aggregates
router.get('/', auth(), async (req, res) => {
  const results = await GameResult.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  const total = results.length;
  const best = results.reduce((min, r) => (min === null || r.timeSeconds < min ? r.timeSeconds : min), null);
  const avgAcc = results.length ? Math.round(results.reduce((s, r) => s + (r.accuracyPercent || 0), 0) / results.length) : 0;
  res.json({
    total,
    bestTimeSeconds: best,
    averageAccuracyPercent: avgAcc,
    results: results.map(r => ({
      id: r._id.toString(),
      puzzleId: r.puzzleId,
      timeSeconds: r.timeSeconds,
      accuracyPercent: r.accuracyPercent,
      completedAt: r.completedAt,
    })),
  });
});

export default router;
