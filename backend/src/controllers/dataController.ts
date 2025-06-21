import { Request, Response } from 'express';
import { dataFetchingService, FetchOptions } from '../services/dataFetchingService';
import { Game } from '../types/game';

/**
 * Data Controller for PriceValve
 * Handles data fetching requests from Steam and SteamSpy APIs
 */

export class DataController {
  /**
   * Get comprehensive game data by app ID
   */
  async getGameData(req: Request, res: Response): Promise<void> {
    try {
      const { appId } = req.params;
      const {
        includeReviews = false,
        includePlayerCount = false,
        includeSalesHistory = false,
        forceRefresh = false
      } = req.query;

      const appIdNum = parseInt(appId);
      if (isNaN(appIdNum)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID provided',
          message: 'App ID must be a valid number'
        });
        return;
      }

      const options: FetchOptions = {
        includeReviews: includeReviews === 'true',
        includePlayerCount: includePlayerCount === 'true',
        includeSalesHistory: includeSalesHistory === 'true',
        forceRefresh: forceRefresh === 'true'
      };

      console.log(`Fetching data for game ${appIdNum} with options:`, options);

      const result = await dataFetchingService.fetchGameData(appIdNum, options);

      if (result.success && result.data) {
        res.json({
          success: true,
          data: result.data,
          sources: result.sources,
          timestamp: result.timestamp,
          message: 'Game data fetched successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: result.error || 'Game not found',
          sources: result.sources,
          timestamp: result.timestamp,
          message: 'Failed to fetch game data'
        });
      }

    } catch (error) {
      console.error('Error in getGameData:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch game data'
      });
    }
  }

  /**
   * Get multiple games data
   */
  async getMultipleGames(req: Request, res: Response): Promise<void> {
    try {
      const { appIds, includeReviews, includePlayerCount, includeSalesHistory, forceRefresh } = req.body;

      if (!appIds || !Array.isArray(appIds)) {
        res.status(400).json({
          success: false,
          error: 'App IDs array is required',
          message: 'Please provide an array of app IDs'
        });
        return;
      }

      if (appIds.length > 50) {
        res.status(400).json({
          success: false,
          error: 'Too many app IDs',
          message: 'Maximum 50 app IDs allowed per request'
        });
        return;
      }

      const options: FetchOptions = {
        includeReviews: includeReviews || false,
        includePlayerCount: includePlayerCount || false,
        includeSalesHistory: includeSalesHistory || false,
        forceRefresh: forceRefresh || false
      };

      console.log(`Fetching data for ${appIds.length} games with options:`, options);

      const results = await dataFetchingService.fetchMultipleGames(appIds, options);

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      res.json({
        success: true,
        data: {
          games: successful.map(r => r.data).filter(Boolean),
          failed: failed.map(r => ({ error: r.error, sources: r.sources })),
          summary: {
            total: appIds.length,
            successful: successful.length,
            failed: failed.length
          }
        },
        message: `Fetched data for ${successful.length} games, ${failed.length} failed`
      });

    } catch (error) {
      console.error('Error in getMultipleGames:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch multiple games data'
      });
    }
  }

  /**
   * Search for games
   */
  async searchGames(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = 10 } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
          message: 'Please provide a search query'
        });
        return;
      }

      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
        res.status(400).json({
          success: false,
          error: 'Invalid limit',
          message: 'Limit must be between 1 and 50'
        });
        return;
      }

      console.log(`Searching for games with query: "${query}"`);

      const games = await dataFetchingService.searchGames(query, limitNum);

      res.json({
        success: true,
        data: {
          games,
          query,
          total: games.length
        },
        message: `Found ${games.length} games matching "${query}"`
      });

    } catch (error) {
      console.error('Error in searchGames:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search games'
      });
    }
  }

  /**
   * Get trending games
   */
  async getTrendingGames(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;

      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        res.status(400).json({
          success: false,
          error: 'Invalid limit',
          message: 'Limit must be between 1 and 100'
        });
        return;
      }

      console.log(`Fetching ${limitNum} trending games`);

      const games = await dataFetchingService.getTrendingGames(limitNum);

      res.json({
        success: true,
        data: {
          games,
          total: games.length
        },
        message: `Fetched ${games.length} trending games`
      });

    } catch (error) {
      console.error('Error in getTrendingGames:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch trending games'
      });
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = dataFetchingService.getCacheStats();

      res.json({
        success: true,
        data: stats,
        message: 'Cache statistics retrieved successfully'
      });

    } catch (error) {
      console.error('Error in getCacheStats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get cache statistics'
      });
    }
  }

  /**
   * Clear cache
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      dataFetchingService.clearCache();

      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });

    } catch (error) {
      console.error('Error in clearCache:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to clear cache'
      });
    }
  }

  /**
   * Get data sources status
   */
  async getDataSourcesStatus(req: Request, res: Response): Promise<void> {
    try {
      // Test both APIs with a known game (Counter-Strike 2)
      const testAppId = 730;
      
      const [steamTest, steamSpyTest] = await Promise.allSettled([
        dataFetchingService.fetchGameData(testAppId, { includeReviews: false }),
        dataFetchingService.fetchGameData(testAppId, { includeReviews: false })
      ]);

      const status = {
        steam: {
          available: steamTest.status === 'fulfilled' && steamTest.value.sources.steam,
          lastTest: new Date(),
          error: steamTest.status === 'rejected' ? steamTest.reason : null
        },
        steamSpy: {
          available: steamSpyTest.status === 'fulfilled' && steamSpyTest.value.sources.steamSpy,
          lastTest: new Date(),
          error: steamSpyTest.status === 'rejected' ? steamSpyTest.reason : null
        },
        cache: dataFetchingService.getCacheStats()
      };

      res.json({
        success: true,
        data: status,
        message: 'Data sources status retrieved successfully'
      });

    } catch (error) {
      console.error('Error in getDataSourcesStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get data sources status'
      });
    }
  }
}

export const dataController = new DataController();
export default dataController; 