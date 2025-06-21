"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.steamRoutes = void 0;
const express_1 = require("express");
const steamApi_1 = require("../services/steamApi");
const steamService_1 = require("../services/steamService");
const router = (0, express_1.Router)();
exports.steamRoutes = router;
/**
 * GET /api/steam/app/:appId
 * Get detailed information about a specific game
 */
router.get('/app/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        const result = yield steamApi_1.steamApiService.getAppDetails(appId);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error || 'Game not found'
            });
        }
        res.json({
            success: true,
            data: result.data
        });
    }))().catch(error => {
        console.error('Error in app details route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch app details'
        });
    });
});
/**
 * GET /api/steam/games/:steamId
 * Get user's owned games
 */
router.get('/games/:steamId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const steamId = req.params.steamId;
        const includeAppInfo = req.query.includeAppInfo === 'true';
        if (!steamId) {
            return res.status(400).json({
                success: false,
                error: 'Steam ID is required'
            });
        }
        if (!steamApi_1.steamApiService.isApiKeyConfigured()) {
            return res.status(400).json({
                success: false,
                error: 'Steam API key is required for this endpoint'
            });
        }
        const result = yield steamApi_1.steamApiService.getUserGames(steamId, includeAppInfo);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error || 'User games not found'
            });
        }
        res.json({
            success: true,
            data: result.data
        });
    }))().catch(error => {
        console.error('Error in user games route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user games'
        });
    });
});
/**
 * GET /api/steam/competitors/:appId
 * Find similar/competitor games
 */
router.get('/competitors/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        const limit = parseInt(req.query.limit) || 10;
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        if (limit < 1 || limit > 50) {
            return res.status(400).json({
                success: false,
                error: 'Limit must be between 1 and 50'
            });
        }
        const result = yield steamApi_1.steamApiService.findSimilarGames(appId, limit);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error || 'Failed to find similar games'
            });
        }
        res.json({
            success: true,
            data: result.data
        });
    }))().catch(error => {
        console.error('Error in competitors route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find competitor games'
        });
    });
});
/**
 * GET /api/steam/players/:appId
 * Get current player count for a game
 */
router.get('/players/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        const result = yield steamApi_1.steamApiService.getPlayerCount(appId);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error || 'Player count not available'
            });
        }
        res.json({
            success: true,
            data: result.data
        });
    }))().catch(error => {
        console.error('Error in player count route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch player count'
        });
    });
});
/**
 * GET /api/steam/reviews/:appId
 * Get review summary for a game
 */
router.get('/reviews/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        const result = yield steamApi_1.steamApiService.getReviewSummary(appId);
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error || 'Review data not available'
            });
        }
        res.json({
            success: true,
            data: result.data
        });
    }))().catch(error => {
        console.error('Error in reviews route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch review data'
        });
    });
});
/**
 * GET /api/steam/rate-limits
 * Get current rate limit information
 */
router.get('/rate-limits', (req, res) => {
    try {
        const rateLimits = steamApi_1.steamApiService.getRateLimitInfo();
        const apiKeyConfigured = steamApi_1.steamApiService.isApiKeyConfigured();
        res.json({
            success: true,
            data: {
                rateLimits,
                apiKeyConfigured
            }
        });
    }
    catch (error) {
        console.error('Error in rate limits route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch rate limit information'
        });
    }
});
// Legacy routes for backward compatibility
/**
 * GET /api/steam/game/:appId
 * Get game details by Steam App ID (legacy)
 */
router.get('/game/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        const game = yield steamService_1.steamService.getGameDetails(appId);
        if (!game) {
            return res.status(404).json({
                success: false,
                error: 'Game not found'
            });
        }
        res.json({
            success: true,
            data: game
        });
    }))().catch(error => {
        console.error('Error in game details route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch game details'
        });
    });
});
/**
 * GET /api/steam/user/:steamId
 * Get user profile by Steam ID (legacy)
 */
router.get('/user/:steamId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const steamId = req.params.steamId;
        if (!steamId) {
            return res.status(400).json({
                success: false,
                error: 'Steam ID is required'
            });
        }
        const user = yield steamService_1.steamService.getUserProfile(steamId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }))().catch(error => {
        console.error('Error in user profile route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    });
});
/**
 * GET /api/steam/price/:appId
 * Get price data for a game (legacy)
 */
router.get('/price/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid app ID'
            });
        }
        const priceData = yield steamService_1.steamService.getGamePrice(appId);
        res.json({
            success: true,
            data: priceData
        });
    }))().catch(error => {
        console.error('Error in price route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch price data'
        });
    });
});
/**
 * POST /api/steam/games
 * Get multiple games by their app IDs
 */
router.post('/games', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const { appIds } = req.body;
        if (!Array.isArray(appIds)) {
            return res.status(400).json({
                success: false,
                error: 'appIds must be an array'
            });
        }
        if (appIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'appIds array cannot be empty'
            });
        }
        if (appIds.length > 50) {
            return res.status(400).json({
                success: false,
                error: 'Cannot request more than 50 games at once'
            });
        }
        const games = yield steamService_1.steamService.getMultipleGames(appIds);
        res.json({
            success: true,
            data: games
        });
    }))().catch(error => {
        console.error('Error in multiple games route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch games'
        });
    });
});
/**
 * GET /api/steam/search
 * Search for games (placeholder - would need third-party service)
 */
router.get('/search', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const games = yield steamService_1.steamService.searchGames(q);
        res.json({
            success: true,
            data: games
        });
    }))().catch(error => {
        console.error('Error in search route:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search games'
        });
    });
});
//# sourceMappingURL=steam.js.map