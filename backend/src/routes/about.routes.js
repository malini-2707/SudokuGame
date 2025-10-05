import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: 'About BrainBlox',
    description: 'BrainBlox is a playful, kid-friendly Sudoku experience that builds logic and focus with colorful visuals and animations.',
    highlights: [
      'Bright, accessible UI for kids',
      'Smooth animations and confetti on wins',
      'Profiles, scores, and leaderboard',
    ],
  });
});

export default router;
