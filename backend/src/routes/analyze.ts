import { Router, Request, Response, NextFunction } from 'express';
import { gameController } from '../controllers/gameController';

const router = Router();

// Helper function to wrap async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Analysis endpoints
router.post('/analyze', asyncHandler(gameController.analyzeGame));
router.post('/analyze/batch', asyncHandler(gameController.analyzeBatchGames));

// Search and discovery endpoints
router.get('/search', asyncHandler(gameController.searchGames));
router.get('/featured', asyncHandler(gameController.getFeaturedGames));
router.get('/top-games', asyncHandler(gameController.getTopGames));
router.get('/genres', asyncHandler(gameController.getAllGenres));
router.get('/genres/:genre', asyncHandler(gameController.getGamesByGenre));

// Individual data endpoints
router.get('/steam/:appId', asyncHandler(gameController.getSteamData));
router.get('/steamspy/:appId', asyncHandler(gameController.getSteamSpyData));

// Health check
router.get('/health', asyncHandler(gameController.healthCheck));

export default router; 