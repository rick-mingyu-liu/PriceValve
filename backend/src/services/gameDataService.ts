import dataFetchingService, { FetchOptions, FetchResult } from './dataFetchingService';
import mongoUploadService, { UploadResult, BatchUploadResult } from './mongoUploadService';
import steamSpyApi from './steamSpyApi';
import steamReviewApi from './steamReviewApi';
import { Game } from '../types/game';

/**
 * Game Data Service for PriceValve
 * Combines data fetching and MongoDB upload functionality
 */

export interface GameDataResult {
  success: boolean;
  game?: Game;
  gameId?: string;
  error?: string;
  fetchResult?: FetchResult;
  uploadResult?: UploadResult;
  isNew?: boolean;
  timestamp: Date;
}

export interface BatchGameDataResult {
  success: boolean;
  results: GameDataResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    newGames: number;
    updatedGames: number;
    fetchErrors: number;
    uploadErrors: number;
  };
  timestamp: Date;
}

class GameDataService {
  /**
   * Fetch game data and upload to MongoDB in one operation
   */
  async fetchAndUploadGame(appId: number, options: FetchOptions = {}): Promise<GameDataResult> {
    try {
      console.log(`Starting fetch and upload for game ${appId}`);

      // Step 1: Fetch data from APIs
      const fetchResult = await dataFetchingService.fetchGameData(appId, options);

      if (!fetchResult.success || !fetchResult.data) {
        return {
          success: false,
          error: `Failed to fetch game data: ${fetchResult.error}`,
          fetchResult,
          timestamp: new Date()
        };
      }

      // Step 2: Upload to MongoDB
      const uploadResult = await mongoUploadService.uploadGame(fetchResult.data);

      if (!uploadResult.success) {
        return {
          success: false,
          error: `Failed to upload game data: ${uploadResult.error}`,
          fetchResult,
          uploadResult,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        game: fetchResult.data,
        gameId: uploadResult.gameId,
        isNew: uploadResult.isNew,
        fetchResult,
        uploadResult,
        timestamp: new Date()
      };

    } catch (error: any) {
      console.error(`Error in fetch and upload for game ${appId}:`, error);
      return {
        success: false,
        error: `Service error: ${error.message}`,
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch and upload multiple games in batch
   */
  async fetchAndUploadGames(appIds: number[], options: FetchOptions = {}): Promise<BatchGameDataResult> {
    const results: GameDataResult[] = [];
    let successful = 0;
    let failed = 0;
    let newGames = 0;
    let updatedGames = 0;
    let fetchErrors = 0;
    let uploadErrors = 0;

    console.log(`Starting batch fetch and upload for ${appIds.length} games`);

    for (const appId of appIds) {
      try {
        const result = await this.fetchAndUploadGame(appId, options);
        results.push(result);
        
        if (result.success) {
          successful++;
          if (result.isNew) {
            newGames++;
          } else {
            updatedGames++;
          }
        } else {
          failed++;
          
          // Categorize errors
          if (result.fetchResult && !result.fetchResult.success) {
            fetchErrors++;
          }
          if (result.uploadResult && !result.uploadResult.success) {
            uploadErrors++;
          }
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
      }
    }

    const summary = {
      total: appIds.length,
      successful,
      failed,
      newGames,
      updatedGames,
      fetchErrors,
      uploadErrors
    };

    console.log(`Batch fetch and upload completed:`, summary);

    return {
      success: failed === 0,
      results,
      summary,
      timestamp: new Date()
    };
  }

  /**
   * Fetch trending games and upload them
   */
  async fetchAndUploadTrendingGames(limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching and uploading ${limit} trending games`);

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
            newGames: 0,
            updatedGames: 0,
            fetchErrors: 0,
            uploadErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs and fetch detailed data
      const appIds = trendingGames.map(game => game.appId);
      return await this.fetchAndUploadGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching and uploading trending games:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 1,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Search for games and upload them
   */
  async searchAndUploadGames(query: string, limit: number = 10, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Searching and uploading games matching: "${query}"`);

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
            newGames: 0,
            updatedGames: 0,
            fetchErrors: 0,
            uploadErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs and fetch detailed data
      const appIds = searchResults.map(game => game.appId);
      return await this.fetchAndUploadGames(appIds, options);

    } catch (error: any) {
      console.error('Error searching and uploading games:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 1,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get games by genre and upload them
   */
  async fetchAndUploadGamesByGenre(genre: string, limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching and uploading ${limit} games in genre: "${genre}"`);

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
            newGames: 0,
            updatedGames: 0,
            fetchErrors: 1,
            uploadErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs (limit to specified number)
      const appIds = Object.keys(genreGames.data)
        .slice(0, limit)
        .map(Number);

      return await this.fetchAndUploadGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching and uploading games by genre:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 1,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get games by tag and upload them
   */
  async fetchAndUploadGamesByTag(tag: string, limit: number = 20, options: FetchOptions = {}): Promise<BatchGameDataResult> {
    try {
      console.log(`Fetching and uploading ${limit} games with tag: "${tag}"`);

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
            newGames: 0,
            updatedGames: 0,
            fetchErrors: 1,
            uploadErrors: 0
          },
          timestamp: new Date()
        };
      }

      // Extract app IDs (limit to specified number)
      const appIds = Object.keys(tagGames.data)
        .slice(0, limit)
        .map(Number);

      return await this.fetchAndUploadGames(appIds, options);

    } catch (error: any) {
      console.error('Error fetching and uploading games by tag:', error);
      return {
        success: false,
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 1,
          newGames: 0,
          updatedGames: 0,
          fetchErrors: 1,
          uploadErrors: 0
        },
        timestamp: new Date()
      };
    }
  }

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<{
    uploadStats: any;
    cacheStats: any;
    timestamp: Date;
  }> {
    const [uploadStats, cacheStats] = await Promise.all([
      mongoUploadService.getUploadStats(),
      dataFetchingService.getCacheStats()
    ]);

    return {
      uploadStats,
      cacheStats,
      timestamp: new Date()
    };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    dataFetchingService.clearCache();
    console.log('All caches cleared');
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{
    dataFetching: boolean;
    mongoUpload: boolean;
    steamSpy: boolean;
    steamReview: boolean;
    timestamp: Date;
  }> {
    try {
      // Test SteamSpy API
      const steamSpyTest = await steamSpyApi.getTop100Owned();
      
      // Test Steam Review API
      const steamReviewTest = await steamReviewApi.getReviewScore(730); // CS:GO
      
      // Test MongoDB connection
      const mongoTest = await mongoUploadService.getUploadStats();

      return {
        dataFetching: true,
        mongoUpload: true,
        steamSpy: steamSpyTest.success,
        steamReview: steamReviewTest.success,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        dataFetching: false,
        mongoUpload: false,
        steamSpy: false,
        steamReview: false,
        timestamp: new Date()
      };
    }
  }
}

export default new GameDataService(); 