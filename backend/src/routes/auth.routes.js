import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import { verifyFirebaseIdToken } from '../utils/firebaseAdmin.js';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, displayName, passwordHash, role: 'player', lastActiveAt: new Date() });
    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Firebase Auth exchange (preferred when using Firebase SDK on frontend)
router.post('/firebase', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });
    const payload = await verifyFirebaseIdToken(idToken);
    const { uid, email, name, picture } = {
      uid: payload.user_id || payload.uid,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    if (!email) return res.status(400).json({ message: 'Invalid Firebase token' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        displayName: name || email.split('@')[0],
        googleId: uid || null,
        avatarUrl: picture || '',
        role: 'player',
        lastActiveAt: new Date(),
      });
    } else {
      let changed = false;
      if (!user.googleId && uid) { user.googleId = uid; changed = true; }
      if (picture && user.avatarUrl !== picture) { user.avatarUrl = picture; changed = true; }
      user.online = true; user.lastActiveAt = new Date();
      if (changed) await user.save(); else await user.save();
    }

    const token = signToken(user);
    return res.json({ token, user: sanitize(user) });
  } catch (e) {
    return res.status(401).json({ message: 'Firebase authentication failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    user.online = true;
    user.lastActiveAt = new Date();
    await user.save();
    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });
    const user = await User.findOne({ email });
    if (user) {
      user.online = false;
      user.lastActiveAt = new Date();
      await user.save();
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

function sanitize(u) {
  return {
    id: u._id.toString(),
    email: u.email,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    role: u.role,
    online: u.online,
    currentPuzzleId: u.currentPuzzleId,
    progressPercent: u.progressPercent,
    timeSpentSeconds: u.timeSpentSeconds,
    lastActiveAt: u.lastActiveAt,
  };
}

// Google OAuth exchange: client sends ID token from Google to backend
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload || {};
    if (!email || !sub) return res.status(400).json({ message: 'Invalid Google token' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        displayName: name || email.split('@')[0],
        googleId: sub,
        avatarUrl: picture || '',
        role: 'player',
        lastActiveAt: new Date(),
      });
    } else {
      // Update googleId/avatar if missing/outdated
      let changed = false;
      if (!user.googleId) { user.googleId = sub; changed = true; }
      if (picture && user.avatarUrl !== picture) { user.avatarUrl = picture; changed = true; }
      user.online = true; user.lastActiveAt = new Date();
      if (changed) await user.save(); else await user.save();
    }

    const token = signToken(user);
    return res.json({ token, user: sanitize(user) });
  } catch (e) {
    return res.status(401).json({ message: 'Google authentication failed' });
  }
});

export default router;
