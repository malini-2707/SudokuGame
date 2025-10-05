import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { auth, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(admin);
  return res.json({ token, admin: { id: admin._id.toString(), email: admin.email, displayName: admin.displayName } });
});

router.get('/members', auth('admin'), async (req, res) => {
  const users = await User.find({ role: 'player' }).sort({ online: -1, lastActiveAt: -1 });
  return res.json(users.map(u => ({
    id: u._id.toString(),
    email: u.email,
    displayName: u.displayName,
    online: u.online,
    currentPuzzleId: u.currentPuzzleId,
    progressPercent: u.progressPercent,
    timeSpentSeconds: u.timeSpentSeconds,
    lastActiveAt: u.lastActiveAt,
  })));
});

router.post('/force-logout/:id', auth('admin'), async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.online = false;
  user.lastActiveAt = new Date();
  await user.save();
  return res.json({ ok: true });
});

export default router;
