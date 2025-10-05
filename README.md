# Sudoku Kids – Full Stack App

A colorful, kid-friendly Sudoku game with animated gameplay and a secure admin panel with live member status.

## Stack
- **Frontend (Player)**: React + Vite + Tailwind CSS + Framer Motion
- **Frontend (Admin)**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Auth**: JWT (players and admin), passwords hashed with bcrypt
- **DB**: MongoDB via Mongoose

## Monorepo Structure
- `backend/` – Express API and MongoDB models
- `frontend-player/` – Player app (gameplay, sounds/animations)
- `frontend-admin/` – Admin app (live member status, force logout)

## Quick Start

### 1) Backend
1. Create `backend/.env` from `.env.example`:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/sudoku_kids
JWT_SECRET=change_me_to_a_long_random_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_DISPLAY_NAME=Game Master
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```
2. Install and run:
```
cd backend
npm install
npm run dev
```
- Health: `GET http://localhost:4000/health`
- Admin user is auto-seeded from env on first boot.

### 2) Player Frontend
1. Create `frontend-player/.env` from `.env.example`:
```
VITE_API_URL=http://localhost:4000/api
```
2. Install and run:
```
cd frontend-player
npm install
npm run dev
```
3. Open: `http://localhost:5173`

### 3) Admin Frontend
1. Create `frontend-admin/.env` from `.env.example`:
```
VITE_API_URL=http://localhost:4000/api
```
2. Install and run:
```
cd frontend-admin
npm install
npm run dev
```
3. Open: `http://localhost:5174`

## Features

### Player App
- Bright, colorful Sudoku board designed for kids.
- Animated cell taps and confetti on solve.
- Tracks player status with periodic updates:
  - Online/Offline
  - Current puzzle ID
  - Progress %
  - Time spent
  - Last active time
- Email/password register & login; JWT stored in localStorage.

### Admin App
- Secure admin login (JWT; separate token storage).
- Live members view (polling every 5s):
  - Email, display name
  - Online/Offline
  - Current puzzle ID
  - Progress %
  - Time played (H:M:S)
  - Last active time
- Force logout any user.
- Animated table row transitions.

## API Endpoints (Summary)
- `POST /api/auth/register` { email, password, displayName }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/logout` { email }
- `GET /api/user/me` (Bearer)
- `PATCH /api/user/status` (Bearer) { currentPuzzleId, progressPercent, deltaTimeSeconds }
- `POST /api/admin/login` { email, password }
- `GET /api/admin/members` (Bearer admin)
- `POST /api/admin/force-logout/:id` (Bearer admin)

## Security Notes
- Use a strong `JWT_SECRET` in production.
- Restrict `CORS_ORIGIN` to known frontends.
- HTTPS: terminate TLS at a reverse proxy (e.g., Nginx) or use a managed platform.
- Role-based access enforced in `backend/src/middleware/auth.js` via `auth('admin')`.

## Database
- MongoDB via Mongoose, no migrations required.
- Models in `backend/src/models/` (`User.js`).
- Default admin seeded from env in `backend/src/startup/ensureDefaultAdmin.js`.

## Developer Tips
- Player polling interval for status updates is 5s; adjust in `frontend-player/src/pages/Game.jsx`.
- Add more puzzles and difficulty later in `frontend-player/src/utils/`.
- Add avatars/badges easily on the player profile and award on puzzle complete (hooks already in place in `SudokuBoard.jsx` via `onSolved`).

## Scripts
- Backend: `npm run dev` (nodemon), `npm start` (node)
- Frontends: `npm run dev`, `npm run build`, `npm run preview`

## Next Enhancements (Optional)
- Theme switcher and fun avatars.
- Reward system (badges, stars).
- WebSocket presence updates for real-time instead of polling.
- Sound effects toggle (muted by default for browsers’ autoplay policies).
