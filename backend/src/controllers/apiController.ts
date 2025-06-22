import { Request, Response } from 'express';
import gameDataService from '../services/gameDataService';
import { FetchOptions } from '../services/dataFetchingService';

/**
 * API Controller for PriceValve
 * Handles all API endpoints for game data fetching
 */

export class ApiController {
  /**
   * Main fetch endpoint - handles all types of game data fetching
   */
  fetch = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, appId, appIds, query, genre, tag, limit = 10, options = {} } = req.body;

      console.log(`🎮 Fetch request received:`, { type, appId, appIds, query, genre, tag, limit });

      // Validate request body
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
          success: false,
          error: 'Request body is required',
          message: 'Please provide fetch parameters in the request body'
        });
        return;
      }

      let result;

      switch (type) {
        case 'single':
          if (!appId) {
            res.status(400).json({
              success: false,
              error: 'appId is required for single game fetch',
              message: 'Please provide an appId for single game fetch'
            });
            return;
          }
          result = await this.fetchSingleGame(appId, options);
          break;

        case 'multiple':
          if (!appIds || !Array.isArray(appIds) || appIds.length === 0) {
            res.status(400).json({
              success: false,
              error: 'appIds array is required for multiple games fetch',
              message: 'Please provide an array of appIds for multiple games fetch'
            });
            return;
          }
          result = await this.fetchMultipleGames(appIds, options);
          break;

        case 'trending':
          result = await this.fetchTrendingGames(limit, options);
          break;

        case 'search':
          if (!query) {
            res.status(400).json({
              success: false,
              error: 'query is required for search',
              message: 'Please provide a search query'
            });
            return;
          }
          result = await this.fetchSearchResults(query, limit, options);
          break;

        case 'genre':
          if (!genre) {
            res.status(400).json({
              success: false,
              error: 'genre is required for genre fetch',
              message: 'Please provide a genre'
            });
            return;
          }
          result = await this.fetchGamesByGenre(genre, limit, options);
          break;

        case 'tag':
          if (!tag) {
            res.status(400).json({
              success: false,
              error: 'tag is required for tag fetch',
              message: 'Please provide a tag'
            });
            return;
          }
          result = await this.fetchGamesByTag(tag, limit, options);
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid fetch type',
            message: 'Valid types: single, multiple, trending, search, genre, tag'
          });
          return;
      }

      res.json(result);

    } catch (error) {
      console.error('❌ Error in fetch endpoint:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to process fetch request',
        timestamp: new Date()
      });
    }
  }

  /**
   * Fetch a single game
   */
  private async fetchSingleGame(appId: number, options: FetchOptions) {
    console.log(`Fetching single game ${appId} with options:`, options);

    const result = await gameDataService.fetchGame(appId, options);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        appId,
        timestamp: new Date(),
        message: 'Failed to fetch game data'
      };
    }

    return {
      success: true,
      data: result.game,
      appId,
      timestamp: new Date(),
      message: 'Game data fetched successfully'
    };
  }

  /**
   * Fetch multiple games data
   */
  private async fetchMultipleGames(appIds: number[], options: FetchOptions) {
    console.log(`Fetching ${appIds.length} games with options:`, options);

    const result = await gameDataService.fetchGames(appIds, options);
    
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
  private async fetchTrendingGames(limit: number, options: FetchOptions) {
    console.log(`Fetching ${limit} trending games with options:`, options);

    const result = await gameDataService.fetchTrendingGames(limit, options);
    
    const successful = result.results.filter((r: any) => r.success);
    const failed = result.results.filter((r: any) => !r.success);

    return {
      success: result.success,
      data: {
        games: successful.map((r: any) => r.game).filter(Boolean),
        failed: failed.map((r: any) => ({ error: r.error, sources: r.fetchResult?.sources })),
        summary: result.summary
      },
      message: `Fetched ${successful.length} trending games, ${failed.length} failed`
    };
  }

  /**
   * Fetch search results
   */
  private async fetchSearchResults(query: string, limit: number, options: FetchOptions) {
    console.log(`Searching for "${query}" with limit ${limit} and options:`, options);

    const result = await gameDataService.searchGames(query, limit, options);
    
    const successful = result.results.filter((r: any) => r.success);
    const failed = result.results.filter((r: any) => !r.success);

    return {
      success: result.success,
      data: {
        games: successful.map((r: any) => r.game).filter(Boolean),
        failed: failed.map((r: any) => ({ error: r.error, sources: r.fetchResult?.sources })),
        summary: result.summary
      },
      message: `Found ${successful.length} games for "${query}", ${failed.length} failed`
    };
  }

  /**
   * Fetch games by genre
   */
  private async fetchGamesByGenre(genre: string, limit: number, options: FetchOptions) {
    console.log(`Fetching ${limit} games in genre "${genre}" with options:`, options);

    const result = await gameDataService.fetchGamesByGenre(genre, limit, options);
    
    const successful = result.results.filter((r: any) => r.success);
    const failed = result.results.filter((r: any) => !r.success);

    return {
      success: result.success,
      data: {
        games: successful.map((r: any) => r.game).filter(Boolean),
        failed: failed.map((r: any) => ({ error: r.error, sources: r.fetchResult?.sources })),
        summary: result.summary
      },
      message: `Fetched ${successful.length} games in genre "${genre}", ${failed.length} failed`
    };
  }

  /**
   * Fetch games by tag
   */
  private async fetchGamesByTag(tag: string, limit: number, options: FetchOptions) {
    console.log(`Fetching ${limit} games with tag "${tag}" with options:`, options);

    const result = await gameDataService.fetchGamesByTag(tag, limit, options);
    
    const successful = result.results.filter((r: any) => r.success);
    const failed = result.results.filter((r: any) => !r.success);

    return {
      success: result.success,
      data: {
        games: successful.map((r: any) => r.game).filter(Boolean),
        failed: failed.map((r: any) => ({ error: r.error, sources: r.fetchResult?.sources })),
        summary: result.summary
      },
      message: `Fetched ${successful.length} games with tag "${tag}", ${failed.length} failed`
    };
  }

  /**
   * Health check endpoint
   */
  health = async (req: Request, res: Response): Promise<void> => {
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
  clearCache = async (req: Request, res: Response): Promise<void> => {
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