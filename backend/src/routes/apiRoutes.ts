import express from 'express';
import { apiController } from '../controllers/apiController';

const router = express.Router();

/**
 * @route POST /api/fetch
 * @desc Main data fetching endpoint - handles everything!
 * @access Public
 */
router.post('/fetch', apiController.fetchData);

/**
 * @route GET /api/health
 * @desc Health check and system status
 * @access Public
 */
router.get('/health', apiController.health);

/**
 * @route DELETE /api/cache
 * @desc Clear the cache
 * @access Public
 */
router.delete('/cache', apiController.clearCache);

export default router; 