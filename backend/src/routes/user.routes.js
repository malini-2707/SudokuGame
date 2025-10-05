import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/me', auth(), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json({
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    online: user.online,
    currentPuzzleId: user.currentPuzzleId,
    progressPercent: user.progressPercent,
    timeSpentSeconds: user.timeSpentSeconds,
    lastActiveAt: user.lastActiveAt,
  });
});

router.patch('/status', auth(), async (req, res) => {
  const { currentPuzzleId, progressPercent, deltaTimeSeconds } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (currentPuzzleId !== undefined) user.currentPuzzleId = currentPuzzleId;
  if (progressPercent !== undefined) user.progressPercent = Math.max(0, Math.min(100, progressPercent));
  if (deltaTimeSeconds) user.timeSpentSeconds += Math.max(0, Number(deltaTimeSeconds) || 0);
  user.online = true;
  user.lastActiveAt = new Date();
  await user.save();
  return res.json({ ok: true });
});

export default router;
