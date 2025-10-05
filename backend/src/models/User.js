import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: true },
  passwordHash: { type: String, required: false, default: null },
  googleId: { type: String, default: null, index: true },
  role: { type: String, enum: ['player', 'admin'], default: 'player', index: true },
  online: { type: Boolean, default: false },
  currentPuzzleId: { type: String, default: null },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  timeSpentSeconds: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: null },
  avatarUrl: { type: String, default: '' },
  puzzlesSolved: { type: Number, default: 0 },
  fastestTimeSeconds: { type: Number, default: null },
  accuracyPercent: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
