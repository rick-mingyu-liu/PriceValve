import express from 'express';
import { dataController } from '../controllers/dataController';

const router = express.Router();

/**
 * @route GET /api/data/game/:appId
 * @desc Get comprehensive game data by app ID
 * @access Public
 */
router.get('/game/:appId', dataController.getGameData);

/**
 * @route POST /api/data/games
 * @desc Get multiple games data
 * @access Public
 */
router.post('/games', dataController.getMultipleGames);

/**
 * @route GET /api/data/search
 * @desc Search for games by name
 * @access Public
 */
router.get('/search', dataController.searchGames);

/**
 * @route GET /api/data/trending
 * @desc Get trending games
 * @access Public
 */
router.get('/trending', dataController.getTrendingGames);

/**
 * @route GET /api/data/cache/stats
 * @desc Get cache statistics
 * @access Public
 */
router.get('/cache/stats', dataController.getCacheStats);

/**
 * @route DELETE /api/data/cache
 * @desc Clear cache
 * @access Public
 */
router.delete('/cache', dataController.clearCache);

/**
 * @route GET /api/data/status
 * @desc Get data sources status
 * @access Public
 */
router.get('/status', dataController.getDataSourcesStatus);

export default router; 