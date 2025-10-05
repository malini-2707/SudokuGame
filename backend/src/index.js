import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { ensureDefaultAdmin } from './startup/ensureDefaultAdmin.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import gameRoutes from './routes/game.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import scoresRoutes from './routes/scores.routes.js';
import profileRoutes from './routes/profile.routes.js';
import aboutRoutes from './routes/about.routes.js';

const app = express();
// nodemon restart trigger to reload .env changes
// updating to pick up new CORS_ORIGIN values
  // CORS, security, parsing, logging
  const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').filter(Boolean);
app.use(cors({ origin: corsOrigins.length ? corsOrigins : true, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
// Rate limiter
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const maxReq = Number(process.env.RATE_LIMIT_MAX || 1000); // higher default for dev ergonomics
const limiter = rateLimit({ windowMs, max: maxReq, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

// Health check
// restart trigger after CORS_ORIGIN change
app.get('/health', (req, res) => res.json({ ok: true }));
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/about', aboutRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sudoku_kids';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  await ensureDefaultAdmin();
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}).catch(err => {
  console.error('Mongo connection error', err);
  process.exit(1);
});
