import { Router } from 'express';
import GameController from '../controllers/gameController';

const router = Router();

/**
 * Game Analysis Routes
 */

// GET /api/analyze/:appId - Analyze a specific game
router.get('/analyze/:appId', GameController.analyzeGame);

// GET /api/games/search - Search for games (future enhancement)
router.get('/search', (req, res) => {
  res.json({
    success: false,
    error: 'Game search endpoint not yet implemented'
  });
});

// GET /api/games/popular - Get popular games (future enhancement)
router.get('/popular', (req, res) => {
  res.json({
    success: false,
    error: 'Popular games endpoint not yet implemented'
  });
});

export default router; 