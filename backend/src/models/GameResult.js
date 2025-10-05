import mongoose from 'mongoose';

const GameResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  puzzleId: { type: String, required: true },
  timeSeconds: { type: Number, required: true },
  accuracyPercent: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('GameResult', GameResultSchema);
