import steamApi from './steamApi';
import steamSpyApi from './steamSpyApi';
import { Game, SalesDataPoint } from '../types/game';

/**
 * Data Fetching Service for PriceValve
 * Integrates Steam and SteamSpy APIs to fetch comprehensive game data
 */

export interface FetchOptions {
  includeReviews?: boolean;
  includePlayerCount?: boolean;
  includeSimilarGames?: boolean;
  includeSalesHistory?: boolean;
  forceRefresh?: boolean;
}

export interface FetchResult {
  success: boolean;
  data?: Game;
  error?: string;
  sources: {
    steam: boolean;
    steamSpy: boolean;
  };
  timestamp: Date;
}

class DataFetchingService {
  private cache: Map<number, { data: Game; timestamp: Date }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch comprehensive game data from multiple sources
   */
  async fetchGameData(appId: number, options: FetchOptions = {}): Promise<FetchResult> {
    const cacheKey = appId;
    const cached = this.cache.get(cacheKey);
    
    // Check cache if not forcing refresh
    if (!options.forceRefresh && cached && 
        Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION) {
      return {
        success: true,
        data: cached.data,
        sources: { steam: true, steamSpy: true },
        timestamp: cached.timestamp
      };
    }

    try {
      console.log(`Fetching data for game ${appId}...`);
      
      // Fetch data from both sources in parallel
      const [steamResult, steamSpyResult] = await Promise.allSettled([
        this.fetchSteamData(appId, options),
        this.fetchSteamSpyData(appId)
      ]);

      // Combine the data
      const gameData = this.combineGameData(
        steamResult.status === 'fulfilled' ? steamResult.value : null,
        steamSpyResult.status === 'fulfilled' ? steamSpyResult.value : null,
        appId
      );

      // Generate sales history if requested
      if (options.includeSalesHistory) {
        gameData.salesHistory = await this.generateSalesHistory(appId, gameData);
      }

      // Cache the result
      this.cache.set(cacheKey, { data: gameData, timestamp: new Date() });

      return {
        success: true,
        data: gameData,
        sources: {
          steam: steamResult.status === 'fulfilled',
          steamSpy: steamSpyResult.status === 'fulfilled'
        },
        timestamp: new Date()
      };

    } catch (error) {
      console.error(`Error fetching data for game ${appId}:`, error);
      return {
        success: false,
        error: `Failed to fetch game data: ${error}`,
        sources: { steam: false, steamSpy: false },
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch data from Steam Web API
   */
  private async fetchSteamData(appId: number, options: FetchOptions): Promise<Partial<Game>> {
    const steamData: Partial<Game> = {
      appId,
      salesHistory: []
    };

    try {
      // Get basic app details
      const appDetails = await steamApi.getAppDetails(appId);
      if (appDetails.success && appDetails.data) {
        const data = appDetails.data;
        
        steamData.name = data.name;
        steamData.isFree = data.is_free || false;
        steamData.shortDescription = data.short_description;
        steamData.releaseDate = data.release_date?.date;
        steamData.developer = data.developers?.[0];
        steamData.publisher = data.publishers?.[0];
        
        // Price information
        if (data.price_overview) {
          steamData.price = data.price_overview.final / 100; // Convert cents to dollars
          steamData.discountPercent = data.price_overview.discount_percent;
        } else if (data.is_free) {
          steamData.price = 0;
        }

        // Tags from categories
        if (data.categories) {
          steamData.tags = data.categories.map(cat => cat.description);
        }

        // Review score
        if (options.includeReviews) {
          const reviewSummary = await steamApi.getReviewSummary(appId);
          if (reviewSummary.success && reviewSummary.data) {
            steamData.reviewScore = parseInt(reviewSummary.data.query_summary.review_score) || 0;
            steamData.totalReviews = reviewSummary.data.query_summary.total_reviews;
          }
        }
      }

      // Get current player count
      if (options.includePlayerCount) {
        const playerCount = await steamApi.getPlayerCount(appId);
        if (playerCount.success && playerCount.data) {
          // This could be used to calculate engagement metrics
          console.log(`Current players for ${appId}: ${playerCount.data.player_count}`);
        }
      }

    } catch (error) {
      console.error(`Error fetching Steam data for ${appId}:`, error);
    }

    return steamData;
  }

  /**
   * Fetch data from SteamSpy API
   */
  private async fetchSteamSpyData(appId: number): Promise<Partial<Game>> {
    const steamSpyData: Partial<Game> = {
      appId,
      salesHistory: []
    };

    try {
      const appDetails = await steamSpyApi.getAppDetails(appId);
      if (appDetails.success && appDetails.data) {
        const data = appDetails.data;
        
        // Ownership data
        steamSpyData.owners = data.owners;
        
        // Playtime data
        steamSpyData.averagePlaytime = data.average_forever;
        
        // Review score (if not already set from Steam)
        if (!steamSpyData.reviewScore && data.score_rank) {
          steamSpyData.reviewScore = this.parseScoreRank(data.score_rank);
        }

        // Additional tags
        if (data.tags && Object.keys(data.tags).length > 0) {
          const topTags = Object.entries(data.tags)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 10)
            .map(([tag]) => tag);
          
          if (steamSpyData.tags) {
            steamSpyData.tags = [...new Set([...steamSpyData.tags, ...topTags])];
          } else {
            steamSpyData.tags = topTags;
          }
        }
      }

    } catch (error) {
      console.error(`Error fetching SteamSpy data for ${appId}:`, error);
    }

    return steamSpyData;
  }

  /**
   * Combine data from multiple sources
   */
  private combineGameData(steamData: Partial<Game> | null, steamSpyData: Partial<Game> | null, appId: number): Game {
    const combined: Game = {
      appId,
      name: steamData?.name || steamSpyData?.name || `Game ${appId}`,
      isFree: steamData?.isFree ?? false,
      price: steamData?.price ?? 0,
      discountPercent: steamData?.discountPercent,
      releaseDate: steamData?.releaseDate,
      developer: steamData?.developer || steamSpyData?.developer,
      publisher: steamData?.publisher || steamSpyData?.publisher,
      tags: [...(steamData?.tags || []), ...(steamSpyData?.tags || [])],
      owners: steamSpyData?.owners,
      averagePlaytime: steamSpyData?.averagePlaytime,
      reviewScore: steamData?.reviewScore || steamSpyData?.reviewScore,
      totalReviews: steamData?.totalReviews,
      shortDescription: steamData?.shortDescription,
      salesHistory: steamData?.salesHistory || steamSpyData?.salesHistory || []
    };

    // Remove duplicates from tags
    combined.tags = [...new Set(combined.tags)];

    return combined;
  }

  /**
   * Generate mock sales history data
   */
  private async generateSalesHistory(appId: number, gameData: Game): Promise<SalesDataPoint[]> {
    const history: SalesDataPoint[] = [];
    const baseOwners = this.parseOwners(gameData.owners || '0 .. 20,000');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate realistic ownership growth
      const growthRate = 0.02 + (Math.random() - 0.5) * 0.04; // ±2% daily growth
      const owners = Math.floor(baseOwners * (1 + growthRate * i));
      
      history.push({
        date: date.toISOString().split('T')[0],
        owners,
        volumeChange: i > 0 ? owners - history[i-1].owners : 0
      });
    }

    return history;
  }

  /**
   * Parse ownership string to numeric estimate
   */
  private parseOwners(ownersString: string): number {
    const match = ownersString.match(/(\d+)\s*\.\.\s*(\d+)/);
    if (match) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      return Math.floor((min + max) / 2);
    }
    return 10000; // Default fallback
  }

  /**
   * Parse score rank to numeric score
   */
  private parseScoreRank(scoreRank: string): number {
    const scoreMap: Record<string, number> = {
      'Overwhelmingly Positive': 95,
      'Very Positive': 85,
      'Positive': 75,
      'Mostly Positive': 70,
      'Mixed': 50,
      'Mostly Negative': 30,
      'Negative': 25,
      'Very Negative': 15,
      'Overwhelmingly Negative': 5
    };
    
    return scoreMap[scoreRank] || 50;
  }

  /**
   * Fetch multiple games in batch
   */
  async fetchMultipleGames(appIds: number[], options: FetchOptions = {}): Promise<FetchResult[]> {
    const results: FetchResult[] = [];
    
    // Process in batches to avoid overwhelming the APIs
    const batchSize = 5;
    for (let i = 0; i < appIds.length; i += batchSize) {
      const batch = appIds.slice(i, i + batchSize);
      const batchPromises = batch.map(appId => this.fetchGameData(appId, options));
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : {
          success: false,
          error: 'Failed to fetch game data',
          sources: { steam: false, steamSpy: false },
          timestamp: new Date()
        }
      ));
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < appIds.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return results;
  }

  /**
   * Search for games by name
   */
  async searchGames(query: string, limit: number = 10): Promise<Game[]> {
    try {
      // This would typically use Steam's search API or SteamSpy's search
      // For now, we'll return a mock result
      console.log(`Searching for games with query: ${query}`);
      
      // In a real implementation, you would:
      // 1. Use Steam's search API
      // 2. Use SteamSpy's search functionality
      // 3. Combine and rank results
      
      return [];
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }

  /**
   * Get trending games
   */
  async getTrendingGames(limit: number = 20): Promise<Game[]> {
    try {
      const topGames = await steamSpyApi.getTop100In2Weeks();
      if (topGames.success && topGames.data) {
        const gameIds = Object.keys(topGames.data).slice(0, limit);
        const games = await this.fetchMultipleGames(gameIds.map(Number));
        return games.filter(g => g.success && g.data).map(g => g.data!);
      }
      return [];
    } catch (error) {
      console.error('Error fetching trending games:', error);
      return [];
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Data fetching cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: Array<{ appId: number; age: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([appId, { timestamp }]) => ({
      appId,
      age: now - timestamp.getTime()
    }));
    
    return {
      size: this.cache.size,
      entries
    };
  }
}

export const dataFetchingService = new DataFetchingService();
export default dataFetchingService; 