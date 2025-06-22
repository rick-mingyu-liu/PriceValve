import express from 'express';
import { apiController } from '../controllers/apiController';

const router = express.Router();

/**
 * API Routes for PriceValve
 * All endpoints are prefixed with /api
 */

// Main data fetching endpoint
router.post('/fetch', apiController.fetch);

// Health check endpoint
router.get('/health', apiController.health);

// Cache management endpoint
router.delete('/cache', apiController.clearCache);

export default router; 