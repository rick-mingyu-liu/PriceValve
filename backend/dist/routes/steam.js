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
const steamService_1 = require("../services/steamService");
const router = (0, express_1.Router)();
exports.steamRoutes = router;
/**
 * GET /api/steam/game/:appId
 * Get game details by Steam App ID
 */
router.get('/game/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({ error: 'Invalid app ID' });
        }
        const game = yield steamService_1.steamService.getGameDetails(appId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.json(game);
    }))().catch(error => {
        console.error('Error in game details route:', error);
        res.status(500).json({ error: 'Failed to fetch game details' });
    });
});
/**
 * GET /api/steam/user/:steamId
 * Get user profile by Steam ID
 */
router.get('/user/:steamId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const steamId = req.params.steamId;
        if (!steamId) {
            return res.status(400).json({ error: 'Steam ID is required' });
        }
        const user = yield steamService_1.steamService.getUserProfile(steamId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }))().catch(error => {
        console.error('Error in user profile route:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    });
});
/**
 * GET /api/steam/price/:appId
 * Get price data for a game
 */
router.get('/price/:appId', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const appId = parseInt(req.params.appId);
        if (isNaN(appId)) {
            return res.status(400).json({ error: 'Invalid app ID' });
        }
        const priceData = yield steamService_1.steamService.getGamePrice(appId);
        res.json(priceData);
    }))().catch(error => {
        console.error('Error in price route:', error);
        res.status(500).json({ error: 'Failed to fetch price data' });
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
            return res.status(400).json({ error: 'appIds must be an array' });
        }
        if (appIds.length === 0) {
            return res.status(400).json({ error: 'appIds array cannot be empty' });
        }
        if (appIds.length > 50) {
            return res.status(400).json({ error: 'Cannot request more than 50 games at once' });
        }
        const games = yield steamService_1.steamService.getMultipleGames(appIds);
        res.json(games);
    }))().catch(error => {
        console.error('Error in multiple games route:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
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
            return res.status(400).json({ error: 'Search query is required' });
        }
        const games = yield steamService_1.steamService.searchGames(q);
        res.json(games);
    }))().catch(error => {
        console.error('Error in search route:', error);
        res.status(500).json({ error: 'Failed to search games' });
    });
});
//# sourceMappingURL=steam.js.map