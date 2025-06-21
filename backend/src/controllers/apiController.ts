import { Request, Response } from 'express';
import gameDataService from '../services/gameDataService';
import { FetchOptions } from '../services/dataFetchingService';

/**
 * API Controller for PriceValve
 * Handles data fetching and uploading operations
 */

export class ApiController {
  /**
   * Main data fetching and uploading endpoint
   * Handles everything: single game, multiple games, trending, search
   */
  fetchData = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if request body exists
      if (!req.body) {
        console.log('❌ fetchData: Request body is undefined');
        res.status(400).json({
          success: false,
          error: 'Request body is required',
          message: 'Please send a JSON body with your request',
          example: {
            type: 'single',
            appId: 730,
            includeReviews: true,
            uploadToDb: true
          }
        });
        return;
      }

      const { 
        appId, 
        appIds, 
        query, 
        type = 'single',
        includeReviews = true,
        includeSalesHistory = true,
        uploadToDb = true,
        limit = 20
      } = req.body;

      // Log the operation with a descriptive name
      const operationName = this.getOperationName(type, appId, appIds, query);
      console.log(`🎮 ${operationName}: ${req.method} ${req.originalUrl}`);
      console.log(`📦 Request body:`, req.body);

      let result: any = { success: false };

      const options: FetchOptions = {
        includeReviews: includeReviews === true,
        includeSalesHistory: includeSalesHistory === true
      };

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
          result = await this.fetchSingleGame(parseInt(appId), options, uploadToDb);
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
          result = await this.fetchMultipleGames(appIds, options, uploadToDb);
          break;

        case 'trending':
          result = await this.fetchTrendingGames(parseInt(limit), options, uploadToDb);
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
          result = await this.searchGames(query, parseInt(limit), options, uploadToDb);
          break;

        case 'genre':
          if (!query) {
            console.log(`❌ ${operationName}: Missing genre parameter`);
            res.status(400).json({
              success: false,
              error: 'Genre is required',
              message: 'Please provide a genre'
            });
            return;
          }
          result = await this.fetchGamesByGenre(query, parseInt(limit), options, uploadToDb);
          break;

        case 'tag':
          if (!query) {
            console.log(`❌ ${operationName}: Missing tag parameter`);
            res.status(400).json({
              success: false,
              error: 'Tag is required',
              message: 'Please provide a tag'
            });
            return;
          }
          result = await this.fetchGamesByTag(query, parseInt(limit), options, uploadToDb);
          break;

        default:
          console.log(`❌ ${operationName}: Invalid type '${type}'`);
          res.status(400).json({
            success: false,
            error: 'Invalid fetch type',
            message: 'Type must be: single, multiple, trending, search, genre, or tag'
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
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      case 'genre':
        return `fetch-games-by-genre-${query}`;
      case 'tag':
        return `fetch-games-by-tag-${query}`;
      default:
        return `fetch-unknown-${type}`;
    }
  }

  /**
   * Fetch single game data
   */
  private async fetchSingleGame(appId: number, options: FetchOptions, uploadToDb: boolean) {
    console.log(`Fetching game [appId=${appId}] with options:`, options);
  
    let result;
    if (uploadToDb) {
      result = await gameDataService.fetchAndUploadGame(appId, options);
    } else {
      // Just fetch without uploading - we'll need to import the dataFetchingService directly
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const fetchResult = await dataFetchingService.fetchGameData(appId, options);
      result = {
        success: fetchResult.success,
        game: fetchResult.data,
        error: fetchResult.error,
        fetchResult,
        timestamp: fetchResult.timestamp
      };
    }
  
    console.log('Fetch result:', result);
  
    if (result.success && result.game) {
      return {
        success: true,
        data: result.game,
        gameId: result.gameId,
        isNew: result.isNew,
        sources: result.fetchResult?.sources,
        timestamp: result.timestamp,
        message: uploadToDb ? 'Game data fetched and uploaded successfully' : 'Game data fetched successfully'
      };
    } else {
      return {
        success: false,
        error: result.error || 'Game not found',
        sources: result.fetchResult?.sources,
        timestamp: result.timestamp,
        message: 'Failed to fetch game data'
      };
    }
  }

  /**
   * Fetch multiple games data
   */
  private async fetchMultipleGames(appIds: number[], options: FetchOptions, uploadToDb: boolean) {
    let result;
    if (uploadToDb) {
      result = await gameDataService.fetchAndUploadGames(appIds, options);
    } else {
      // Just fetch without uploading
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const fetchResults = await dataFetchingService.fetchMultipleGames(appIds, options);
      const successful = fetchResults.filter(r => r.success);
      const failed = fetchResults.filter(r => !r.success);
      
      result = {
        success: true,
        results: fetchResults.map(r => ({
          success: r.success,
          game: r.data,
          error: r.error,
          fetchResult: r,
          timestamp: r.timestamp
        })),
        summary: {
          total: appIds.length,
          successful: successful.length,
          failed: failed.length,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: failed.length,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }
    
    const successful = result.results.filter((r: any) => r.success);
    const failed = result.results.filter((r: any) => !r.success);

    return {
      success: result.success,
      data: {
        games: successful.map((r: any) => r.game).filter(Boolean),
        failed: failed.map((r: any) => ({ error: r.error, sources: r.fetchResult?.sources })),
        summary: result.summary
      },
      message: `Processed ${successful.length} games, ${failed.length} failed`
    };
  }

  /**
   * Fetch trending games
   */
  private async fetchTrendingGames(limit: number, options: FetchOptions, uploadToDb: boolean) {
    let result;
    if (uploadToDb) {
      result = await gameDataService.fetchAndUploadTrendingGames(limit, options);
    } else {
      // Just fetch without uploading
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const games = await dataFetchingService.getTrendingGames(limit);
      result = {
        success: true,
        results: games.map(game => ({
          success: true,
          game,
          timestamp: new Date()
        })),
        summary: {
          total: games.length,
          successful: games.length,
          failed: 0,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 0,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }

    return {
      success: result.success,
      data: {
        games: result.results.filter((r: any) => r.success).map((r: any) => r.game),
        summary: result.summary
      },
      message: `Fetched ${result.summary.successful} trending games`
    };
  }

  /**
   * Search games
   */
  private async searchGames(query: string, limit: number, options: FetchOptions, uploadToDb: boolean) {
    let result;
    if (uploadToDb) {
      result = await gameDataService.searchAndUploadGames(query, limit, options);
    } else {
      // Just fetch without uploading
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const games = await dataFetchingService.searchGames(query, limit);
      result = {
        success: true,
        results: games.map(game => ({
          success: true,
          game,
          timestamp: new Date()
        })),
        summary: {
          total: games.length,
          successful: games.length,
          failed: 0,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 0,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }

    return {
      success: result.success,
      data: {
        games: result.results.filter((r: any) => r.success).map((r: any) => r.game),
        summary: result.summary
      },
      message: `Found ${result.summary.successful} games matching "${query}"`
    };
  }

  /**
   * Fetch games by genre
   */
  private async fetchGamesByGenre(genre: string, limit: number, options: FetchOptions, uploadToDb: boolean) {
    let result;
    if (uploadToDb) {
      result = await gameDataService.fetchAndUploadGamesByGenre(genre, limit, options);
    } else {
      // Just fetch without uploading
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const games = await dataFetchingService.searchGames(genre, limit);
      result = {
        success: true,
        results: games.map(game => ({
          success: true,
          game,
          timestamp: new Date()
        })),
        summary: {
          total: games.length,
          successful: games.length,
          failed: 0,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 0,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }

    return {
      success: result.success,
      data: {
        games: result.results.filter((r: any) => r.success).map((r: any) => r.game),
        summary: result.summary
      },
      message: `Fetched ${result.summary.successful} games in genre "${genre}"`
    };
  }

  /**
   * Fetch games by tag
   */
  private async fetchGamesByTag(tag: string, limit: number, options: FetchOptions, uploadToDb: boolean) {
    let result;
    if (uploadToDb) {
      result = await gameDataService.fetchAndUploadGamesByTag(tag, limit, options);
    } else {
      // Just fetch without uploading
      const dataFetchingService = (await import('../services/dataFetchingService')).default;
      const games = await dataFetchingService.searchGames(tag, limit);
      result = {
        success: true,
        results: games.map(game => ({
          success: true,
          game,
          timestamp: new Date()
        })),
        summary: {
          total: games.length,
          successful: games.length,
          failed: 0,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 0,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }

    return {
      success: result.success,
      data: {
        games: result.results.filter((r: any) => r.success).map((r: any) => r.game),
        summary: result.summary
      },
      message: `Fetched ${result.summary.successful} games with tag "${tag}"`
    };
  }

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    try {
      console.log('🏥 Health check requested');

      const healthStatus = await gameDataService.healthCheck();
      const serviceStats = await gameDataService.getServiceStats();

      const response = {
        success: true,
        status: 'healthy',
        timestamp: new Date(),
        services: {
          dataFetching: healthStatus.dataFetching,
          mongoUpload: healthStatus.mongoUpload,
          steamSpy: healthStatus.steamSpy,
          steamReview: healthStatus.steamReview
        },
        stats: serviceStats,
        message: 'All services are operational'
      };

      // Check if all services are healthy
      const allHealthy = Object.values(healthStatus).every(status => 
        typeof status === 'boolean' ? status : true
      );

      if (!allHealthy) {
        response.status = 'degraded';
        response.message = 'Some services are experiencing issues';
      }

      console.log('✅ Health check completed:', response);
      res.json(response);

    } catch (error) {
      console.error('❌ Health check failed:', error);
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        error: 'Health check failed',
        message: 'System is experiencing issues',
        timestamp: new Date()
      });
    }
  }

  /**
   * Clear cache endpoint
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      console.log('🗑️ Cache clear requested');

      gameDataService.clearCaches();

      res.json({
        success: true,
        message: 'All caches cleared successfully',
        timestamp: new Date()
      });

    } catch (error) {
      console.error('❌ Cache clear failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache',
        message: 'Cache clear operation failed',
        timestamp: new Date()
      });
    }
  }
}

export const apiController = new ApiController();
export default apiController; 