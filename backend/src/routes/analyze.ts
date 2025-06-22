import { Router } from 'express';
import { gameController } from '../controllers/gameController';

const router = Router();

// Analysis endpoints
router.post('/analyze', gameController.analyzeGame);
router.post('/analyze/batch', gameController.analyzeBatchGames);

// Search and discovery endpoints
router.get('/search', gameController.searchGames);
router.get('/featured', gameController.getFeaturedGames);
router.get('/top-games', gameController.getTopGames);
router.get('/genres', gameController.getAllGenres);
router.get('/genres/:genre', gameController.getGamesByGenre);

// Individual data endpoints
router.get('/steam/:appId', gameController.getSteamData);
router.get('/steamspy/:appId', gameController.getSteamSpyData);

// Health check
router.get('/health', gameController.healthCheck);

export default router; 