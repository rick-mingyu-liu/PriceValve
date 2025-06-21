import { Request, Response } from 'express';
import { dataFetchingService, FetchOptions } from '../services/dataFetchingService';

/**
 * Simple API Controller for PriceValve
 * One endpoint to rule them all - just fetch data!
 */

export class ApiController {
  /**
   * Main data fetching endpoint
   * Handles everything: single game, multiple games, trending, search
   */
  async fetchData(req: Request, res: Response): Promise<void> {
    try {
      const { 
        appId, 
        appIds, 
        query, 
        type = 'single',
        includeReviews = true,
        includePlayerCount = true,
        includeSalesHistory = true,
        limit = 20
      } = req.body;

      // Log the operation with a descriptive name
      const operationName = this.getOperationName(type, appId, appIds, query);
      console.log(`🎮 ${operationName}: ${req.method} ${req.originalUrl}`);

      let result: any = { success: false };

      switch (type) {
        case 'single':
          if (!appId) {
            console.log(`❌ ${operationName}: Missing appId parameter`);
            res.status(400).json({
              success: false,
              error: 'App ID is required for single game fetch',
              message: 'Please provide an appId'
            });
            return;
          }
          result = await this.fetchSingleGame(parseInt(appId), {
            includeReviews: includeReviews === true,
            includePlayerCount: includePlayerCount === true,
            includeSalesHistory: includeSalesHistory === true
          });
          break;

        case 'multiple':
          if (!appIds || !Array.isArray(appIds)) {
            console.log(`❌ ${operationName}: Missing or invalid appIds array`);
            res.status(400).json({
              success: false,
              error: 'App IDs array is required for multiple games fetch',
              message: 'Please provide an appIds array'
            });
            return;
          }
          result = await this.fetchMultipleGames(appIds, {
            includeReviews: includeReviews === true,
            includePlayerCount: includePlayerCount === true,
            includeSalesHistory: includeSalesHistory === true
          });
          break;

        case 'trending':
          result = await this.fetchTrendingGames(parseInt(limit));
          break;

        case 'search':
          if (!query) {
            console.log(`❌ ${operationName}: Missing query parameter`);
            res.status(400).json({
              success: false,
              error: 'Search query is required',
              message: 'Please provide a query'
            });
            return;
          }
          result = await this.searchGames(query, parseInt(limit));
          break;

        default:
          console.log(`❌ ${operationName}: Invalid type '${type}'`);
          res.status(400).json({
            success: false,
            error: 'Invalid fetch type',
            message: 'Type must be: single, multiple, trending, or search'
          });
          return;
      }

      if (result.success) {
        console.log(`✅ ${operationName}: Success`);
      } else {
        console.log(`❌ ${operationName}: Failed - ${result.error}`);
      }

      res.json(result);

    } catch (error) {
      console.error('❌ Error in fetchData:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch data'
      });
    }
  }

  /**
   * Get a descriptive operation name for logging
   */
  private getOperationName(type: string, appId?: number, appIds?: number[], query?: string): string {
    switch (type) {
      case 'single':
        return `fetch-single-game-${appId}`;
      case 'multiple':
        return `fetch-multiple-games-${appIds?.length || 0}`;
      case 'trending':
        return 'fetch-trending-games';
      case 'search':
        return `search-games-${query}`;
      default:
        return `fetch-unknown-${type}`;
    }
  }

  /**
   * Fetch single game data
   */
  private async fetchSingleGame(appId: number, options: FetchOptions) {
    const result = await dataFetchingService.fetchGameData(appId, options);
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        sources: result.sources,
        timestamp: result.timestamp,
        message: 'Game data fetched successfully'
      };
    } else {
      return {
        success: false,
        error: result.error || 'Game not found',
        sources: result.sources,
        timestamp: result.timestamp,
        message: 'Failed to fetch game data'
      };
    }
  }

  /**
   * Fetch multiple games data
   */
  private async fetchMultipleGames(appIds: number[], options: FetchOptions) {
    const results = await dataFetchingService.fetchMultipleGames(appIds, options);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return {
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
    };
  }

  /**
   * Fetch trending games
   */
  private async fetchTrendingGames(limit: number) {
    const games = await dataFetchingService.getTrendingGames(limit);
    
    return {
      success: true,
      data: {
        games,
        total: games.length
      },
      message: `Fetched ${games.length} trending games`
    };
  }

  /**
   * Search games
   */
  private async searchGames(query: string, limit: number) {
    const games = await dataFetchingService.searchGames(query, limit);
    
    return {
      success: true,
      data: {
        games,
        query,
        total: games.length
      },
      message: `Found ${games.length} games matching "${query}"`
    };
  }

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    try {
      console.log(`🏥 health-check: ${req.method} ${req.originalUrl}`);
      
      const cacheStats = dataFetchingService.getCacheStats();
      
      // Quick API test
      const testAppId = 730; // Counter-Strike 2
      const testResult = await dataFetchingService.fetchGameData(testAppId, { 
        includeReviews: false 
      });

      res.json({
        success: true,
        data: {
          server: {
            status: 'running',
            timestamp: new Date(),
            version: '1.0.0'
          },
          apis: {
            steam: testResult.sources.steam,
            steamSpy: testResult.sources.steamSpy
          },
          cache: cacheStats
        },
        message: 'PriceValve API is healthy'
      });

      console.log(`✅ health-check: Success`);

    } catch (error) {
      console.error('❌ Health check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Health check failed',
        message: 'API is not healthy'
      });
    }
  }

  /**
   * Clear cache endpoint
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      console.log(`🗑️  clear-cache: ${req.method} ${req.originalUrl}`);
      
      dataFetchingService.clearCache();

      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });

      console.log(`✅ clear-cache: Success`);

    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache',
        message: 'Internal server error'
      });
    }
  }
}

export const apiController = new ApiController();
export default apiController; 