import dataFetchingService, { FetchOptions, FetchResult } from './dataFetchingService';
import steamSpyApi from './steamSpyApi';
import steamReviewApi from './steamReviewApi';
import { Game } from '../types/game';

/**
 * Game Data Service for PriceValve
 * Pure data fetching service without database operations
 */

export interface GameDataResult {
  success: boolean;
  game?: Game;
  error?: string;
  fetchResult?: FetchResult;
  timestamp: Date;
}

export interface BatchGameDataResult {
  success: boolean;
  results: GameDataResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    fetchErrors: number;
  };
  timestamp: Date;
}

class GameDataService {
  /**
   * Fetch game data only (no database operations)
   */
  async fetchGame(appId: number, options: FetchOptions = {}): Promise<GameDataResult> {
    try {
      console.log(`Fetching game data for ${appId}`);

      // Fetch data from APIs
      const fetchResult = await dataFetchingService.fetchGameData(appId, options);

      if (!fetchResult.success || !fetchResult.data) {
        return {
          success: false,
          error: `Failed to fetch game data: ${fetchResult.error}`,
          fetchResult,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        game: fetchResult.data,
        fetchResult,
        timestamp: new Date()
      };

    } catch (error: any) {
      console.error(`Error fetching game ${appId}:`, error);
      return {
        success: false,
        error: `Service error: ${error.message}`,
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch multiple games in batch
   */
  async fetchGames(appIds: number[], options: FetchOptions = {}): Promise<BatchGameDataResult> {
    const results: GameDataResult[] = [];
    let successful = 0;
    let failed = 0;
    let fetchErrors = 0;

    console.log(`Starting batch fetch for ${appIds.length} games`);

    for (const appId of appIds) {
      try {
        const result = await this.fetchGame(appId, options);
        results.push(result);
        
        if (result.success) {
          successful++;
        } else {
          failed++;
          fetchErrors++;
        }

        // Add delay between operations to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error in batch operation for game ${appId}:`, error);
        results.push({
          success: false,
          error: `Batch operation error: ${error}`,
          timestamp: new Date()
        });
        failed++;
        fetchErrors++;
      }
    }

    const summary = {
      total: appIds.length,
      successful,
      failed,
      fetchErrors
    };

    console.log(`Batch fetch completed:`, summary);

    return {
      success: failed === 0,
      results,
      summary,
      timestamp: new Date()
    };
  }

  /**
   * Fetch trending games
   */
  async fetchTrendingGames(limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching ${limit} trending games`);

      // Get trending games from SteamSpy
      const trendingGames = await dataFetchingService.getTrendingGames(limit);
      
      if (trendingGames.length === 0) {
        return {
          success: false,
          results: [],
          summary: {
            total: 0,
            successful: 0,
            failed: 0,
            fetchErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs and fetch detailed data
      const appIds = trendingGames.map(game => game.appId);
      return await this.fetchGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching trending games:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          fetchErrors: 1
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Search for games
   */
  async searchGames(query: string, limit: number = 10, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Searching for games matching: "${query}"`);

      // Search for games
      const searchResults = await dataFetchingService.searchGames(query, limit);
      
      if (searchResults.length === 0) {
        return {
          success: false,
          results: [],
          summary: {
            total: 0,
            successful: 0,
            failed: 0,
            fetchErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs and fetch detailed data
      const appIds = searchResults.map(game => game.appId);
      return await this.fetchGames(appIds, options);

    } catch (error: any) {
      console.error('Error searching games:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          fetchErrors: 1
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get games by genre
   */
  async fetchGamesByGenre(genre: string, limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching ${limit} games in genre: "${genre}"`);

      // Get games by genre from SteamSpy
      const genreGames = await steamSpyApi.getGamesByGenre(genre);
      
      if (!genreGames.success || !genreGames.data) {
        return {
          success: false,
          results: [],
          summary: {
            total: 0,
            successful: 0,
            failed: 1,
            fetchErrors: 1
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs (limit to specified number)
      const appIds = Object.keys(genreGames.data)
        .slice(0, limit)
        .map(Number);

      return await this.fetchGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching games by genre:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          fetchErrors: 1
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get games by tag
   */
  async fetchGamesByTag(tag: string, limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching ${limit} games with tag: "${tag}"`);

      // Get games by tag from SteamSpy
      const tagGames = await steamSpyApi.getGamesByTag(tag);
      
      if (!tagGames.success || !tagGames.data) {
        return {
          success: false,
          results: [],
          summary: {
            total: 0,
            successful: 0,
            failed: 1,
            fetchErrors: 1
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs (limit to specified number)
      const appIds = Object.keys(tagGames.data)
        .slice(0, limit)
        .map(Number);

      return await this.fetchGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching games by tag:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          fetchErrors: 1
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<{
    cacheStats: any;
    timestamp: Date;
  }> {
    const cacheStats = await dataFetchingService.getCacheStats();

    return {
      cacheStats,
      timestamp: new Date()
    };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    dataFetchingService.clearCache();
    console.log('✅ All caches cleared');
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{
    dataFetching: boolean;
    steamSpy: boolean;
    steamReview: boolean;
    timestamp: Date;
  }> {
    try {
      // Test SteamSpy API
      const steamSpyTest = await steamSpyApi.getTop100Owned();
      
      // Test Steam Review API
      const steamReviewTest = await steamReviewApi.getReviewScore(730); // CS:GO

      return {
        dataFetching: true,
        steamSpy: steamSpyTest.success,
        steamReview: steamReviewTest.success,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        dataFetching: false,
        steamSpy: false,
        steamReview: false,
        timestamp: new Date()
      };
    }
  }
}

export default new GameDataService(); 