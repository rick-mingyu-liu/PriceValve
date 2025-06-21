import { Router } from 'express';
import { steamApiService } from '../services/steamApi';
import { steamService } from '../services/steamService';
import { ApiResponse, SteamGame, SteamUserProfile, SteamPriceData } from '../types';

const router = Router();

/**
 * GET /api/steam/app/:appId
 * Get detailed information about a specific game
 */
router.get('/app/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    const result = await steamApiService.getAppDetails(appId);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error || 'Game not found' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: result.data 
    } as ApiResponse);
  })().catch(error => {
    console.error('Error in app details route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch app details' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/games/:steamId
 * Get user's owned games
 */
router.get('/games/:steamId', (req, res) => {
  (async () => {
    const steamId = req.params.steamId;
    const includeAppInfo = req.query.includeAppInfo === 'true';
    
    if (!steamId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Steam ID is required' 
      } as ApiResponse);
    }

    if (!steamApiService.isApiKeyConfigured()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Steam API key is required for this endpoint' 
      } as ApiResponse);
    }

    const result = await steamApiService.getUserGames(steamId, includeAppInfo);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error || 'User games not found' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: result.data 
    } as ApiResponse);
  })().catch(error => {
    console.error('Error in user games route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user games' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/competitors/:appId
 * Find similar/competitor games
 */
router.get('/competitors/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    if (limit < 1 || limit > 50) {
      return res.status(400).json({ 
        success: false, 
        error: 'Limit must be between 1 and 50' 
      } as ApiResponse);
    }

    const result = await steamApiService.findSimilarGames(appId, limit);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error || 'Failed to find similar games' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: result.data 
    } as ApiResponse);
  })().catch(error => {
    console.error('Error in competitors route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to find competitor games' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/players/:appId
 * Get current player count for a game
 */
router.get('/players/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    const result = await steamApiService.getPlayerCount(appId);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error || 'Player count not available' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: result.data 
    } as ApiResponse);
  })().catch(error => {
    console.error('Error in player count route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch player count' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/reviews/:appId
 * Get review summary for a game
 */
router.get('/reviews/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    const result = await steamApiService.getReviewSummary(appId);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error || 'Review data not available' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: result.data 
    } as ApiResponse);
  })().catch(error => {
    console.error('Error in reviews route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch review data' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/rate-limits
 * Get current rate limit information
 */
router.get('/rate-limits', (req, res) => {
  try {
    const rateLimits = steamApiService.getRateLimitInfo();
    const apiKeyConfigured = steamApiService.isApiKeyConfigured();
    
    res.json({ 
      success: true, 
      data: {
        rateLimits,
        apiKeyConfigured
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Error in rate limits route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch rate limit information' 
    } as ApiResponse);
  }
});

// Legacy routes for backward compatibility
/**
 * GET /api/steam/game/:appId
 * Get game details by Steam App ID (legacy)
 */
router.get('/game/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    const game = await steamService.getGameDetails(appId);
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        error: 'Game not found' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: game 
    } as ApiResponse<SteamGame>);
  })().catch(error => {
    console.error('Error in game details route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch game details' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/user/:steamId
 * Get user profile by Steam ID (legacy)
 */
router.get('/user/:steamId', (req, res) => {
  (async () => {
    const steamId = req.params.steamId;
    
    if (!steamId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Steam ID is required' 
      } as ApiResponse);
    }

    const user = await steamService.getUserProfile(steamId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      } as ApiResponse);
    }

    res.json({ 
      success: true, 
      data: user 
    } as ApiResponse<SteamUserProfile>);
  })().catch(error => {
    console.error('Error in user profile route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user profile' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/price/:appId
 * Get price data for a game (legacy)
 */
router.get('/price/:appId', (req, res) => {
  (async () => {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid app ID' 
      } as ApiResponse);
    }

    const priceData = await steamService.getGamePrice(appId);
    res.json({ 
      success: true, 
      data: priceData 
    } as ApiResponse<SteamPriceData>);
  })().catch(error => {
    console.error('Error in price route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch price data' 
    } as ApiResponse);
  });
});

/**
 * POST /api/steam/games
 * Get multiple games by their app IDs
 */
router.post('/games', (req, res) => {
  (async () => {
    const { appIds } = req.body;
    
    if (!Array.isArray(appIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'appIds must be an array' 
      } as ApiResponse);
    }

    if (appIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'appIds array cannot be empty' 
      } as ApiResponse);
    }

    if (appIds.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot request more than 50 games at once' 
      } as ApiResponse);
    }

    const games = await steamService.getMultipleGames(appIds);
    res.json({ 
      success: true, 
      data: games 
    } as ApiResponse<SteamGame[]>);
  })().catch(error => {
    console.error('Error in multiple games route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch games' 
    } as ApiResponse);
  });
});

/**
 * GET /api/steam/search
 * Search for games (placeholder - would need third-party service)
 */
router.get('/search', (req, res) => {
  (async () => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      } as ApiResponse);
    }

    const games = await steamService.searchGames();
    res.json({ 
      success: true, 
      data: games 
    } as ApiResponse<SteamGame[]>);
  })().catch(error => {
    console.error('Error in search route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search games' 
    } as ApiResponse);
  });
});

export { router as steamRoutes }; 