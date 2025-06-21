import steamSpyApi from './steamSpyApi';
import steamReviewApi from './steamReviewApi';
import { Game, SalesDataPoint } from '../types/game';

/**
 * Data Fetching Service for PriceValve
 * Integrates SteamSpy and Steam Review APIs to fetch comprehensive game data
 */

export interface FetchOptions {
  includeReviews?: boolean;
  includeSalesHistory?: boolean;
  forceRefresh?: boolean;
}

export interface FetchResult {
  success: boolean;
  data?: Game;
  error?: string;
  sources: {
    steamSpy: boolean;
    steamReview: boolean;
  };
  timestamp: Date;
}

class DataFetchingService {
  private cache: Map<number, { data: Game; timestamp: Date }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch comprehensive game data from SteamSpy and Steam Review APIs
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
        sources: { steamSpy: true, steamReview: true },
        timestamp: cached.timestamp
      };
    }

    try {
      console.log(`Fetching data for game ${appId}...`);
      
      // Fetch data from both sources in parallel
      const [steamSpyResult, steamReviewResult] = await Promise.allSettled([
        this.fetchSteamSpyData(appId),
        options.includeReviews ? this.fetchSteamReviewData(appId) : Promise.resolve(null)
      ]);

      // Combine the data
      const gameData = this.combineGameData(
        steamSpyResult.status === 'fulfilled' ? steamSpyResult.value : null,
        steamReviewResult.status === 'fulfilled' ? steamReviewResult.value : null,
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
          steamSpy: steamSpyResult.status === 'fulfilled',
          steamReview: steamReviewResult.status === 'fulfilled'
        },
        timestamp: new Date()
      };

    } catch (error) {
      console.error(`Error fetching data for game ${appId}:`, error);
      return {
        success: false,
        error: `Failed to fetch game data: ${error}`,
        sources: { steamSpy: false, steamReview: false },
        timestamp: new Date()
      };
    }
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
        
        // Basic information
        steamSpyData.name = data.name;
        steamSpyData.developer = data.developer;
        steamSpyData.publisher = data.publisher;
        
        // Ownership data
        steamSpyData.owners = data.owners;
        
        // Playtime data
        steamSpyData.averagePlaytime = data.average_forever;
        
        // Price information
        steamSpyData.price = data.price;
        steamSpyData.discountPercent = data.discount;
        
        // Tags from SteamSpy
        if (data.tags && Object.keys(data.tags).length > 0) {
          const topTags = Object.entries(data.tags)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 10)
            .map(([tag]) => tag);
          
          steamSpyData.tags = topTags;
        }

        // Genre information
        if (data.genre) {
          steamSpyData.tags = steamSpyData.tags || [];
          steamSpyData.tags.push(data.genre);
        }
      }

    } catch (error) {
      console.error(`Error fetching SteamSpy data for ${appId}:`, error);
    }

    return steamSpyData;
  }

  /**
   * Fetch data from Steam Review API
   */
  private async fetchSteamReviewData(appId: number): Promise<Partial<Game>> {
    const steamReviewData: Partial<Game> = {
      appId,
      salesHistory: []
    };

    try {
      const reviewScore = await steamReviewApi.getReviewScore(appId);
      if (reviewScore.success && reviewScore.data) {
        const data = reviewScore.data;
        
        steamReviewData.reviewScore = data.score;
        steamReviewData.reviewScoreDesc = data.description;
        steamReviewData.totalReviews = data.totalReviews;
        steamReviewData.totalPositive = data.totalPositive;
        steamReviewData.totalNegative = data.totalNegative;
      }

    } catch (error) {
      console.error(`Error fetching Steam Review data for ${appId}:`, error);
    }

    return steamReviewData;
  }

  /**
   * Combine data from multiple sources into a single Game object
   */
  private combineGameData(steamSpyData: Partial<Game> | null, steamReviewData: Partial<Game> | null, appId: number): Game {
    const combinedData: Game = {
      appId,
      name: '',
      isFree: false,
      price: 0,
      tags: [],
      salesHistory: []
    };

    // Combine SteamSpy data
    if (steamSpyData) {
      Object.assign(combinedData, steamSpyData);
    }

    // Combine Steam Review data
    if (steamReviewData) {
      if (steamReviewData.reviewScore !== undefined) combinedData.reviewScore = steamReviewData.reviewScore;
      if (steamReviewData.reviewScoreDesc) combinedData.reviewScoreDesc = steamReviewData.reviewScoreDesc;
      if (steamReviewData.totalReviews !== undefined) combinedData.totalReviews = steamReviewData.totalReviews;
      if (steamReviewData.totalPositive !== undefined) combinedData.totalPositive = steamReviewData.totalPositive;
      if (steamReviewData.totalNegative !== undefined) combinedData.totalNegative = steamReviewData.totalNegative;
    }

    // Set default values for missing fields
    if (!combinedData.name) {
      combinedData.name = `Unknown Game (${appId})`;
    }

    if (combinedData.price === undefined || combinedData.price === null) {
      combinedData.price = 0;
      combinedData.isFree = true;
    }

    if (!combinedData.tags) {
      combinedData.tags = [];
    }

    return combinedData;
  }

  /**
   * Generate sales history data based on ownership estimates
   */
  private async generateSalesHistory(appId: number, gameData: Game): Promise<SalesDataPoint[]> {
    const salesHistory: SalesDataPoint[] = [];
    
    try {
      // For now, we'll create a simple sales history based on current ownership
      // In a real implementation, you might want to fetch historical data from SteamSpy
      if (gameData.owners) {
        const currentOwners = this.parseOwners(gameData.owners);
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Create a simple sales history entry
        salesHistory.push({
          date: currentDate,
          owners: currentOwners,
          revenue: gameData.price * currentOwners,
          volumeChange: 0 // We don't have historical data to calculate this
        });
      }
    } catch (error) {
      console.error(`Error generating sales history for ${appId}:`, error);
    }

    return salesHistory;
  }

  /**
   * Parse ownership string from SteamSpy (e.g., "1,000,000 .. 2,000,000")
   */
  private parseOwners(ownersString: string): number {
    try {
      // Extract the range and take the average
      const match = ownersString.match(/(\d+(?:,\d+)*)\s*\.\.\s*(\d+(?:,\d+)*)/);
      if (match) {
        const min = parseInt(match[1].replace(/,/g, ''));
        const max = parseInt(match[2].replace(/,/g, ''));
        return Math.round((min + max) / 2);
      }
      
      // If it's a single number
      const singleMatch = ownersString.match(/(\d+(?:,\d+)*)/);
      if (singleMatch) {
        return parseInt(singleMatch[1].replace(/,/g, ''));
      }
      
      return 0;
    } catch (error) {
      console.error('Error parsing owners string:', ownersString, error);
      return 0;
    }
  }

  /**
   * Fetch data for multiple games
   */
  async fetchMultipleGames(appIds: number[], options: FetchOptions = {}): Promise<FetchResult[]> {
    const results: FetchResult[] = [];
    
    for (const appId of appIds) {
      try {
        const result = await this.fetchGameData(appId, options);
        results.push(result);
        
        // Add a small delay between requests to be respectful to the APIs
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching data for game ${appId}:`, error);
        results.push({
          success: false,
          error: `Failed to fetch data for game ${appId}`,
          sources: { steamSpy: false, steamReview: false },
          timestamp: new Date()
        });
      }
    }
    
    return results;
  }

  /**
   * Search for games by name using SteamSpy
   */
  async searchGames(query: string, limit: number = 10): Promise<Game[]> {
    try {
      // For now, we'll use the top games and filter by name
      // In a real implementation, you might want to implement a proper search
      const topGames = await steamSpyApi.getTop100Owned();
      
      if (!topGames.success || !topGames.data) {
        return [];
      }

      const matchingGames: Game[] = [];
      const searchQuery = query.toLowerCase();

      for (const [appId, gameData] of Object.entries(topGames.data)) {
        if (matchingGames.length >= limit) break;
        
        if (gameData.name.toLowerCase().includes(searchQuery)) {
          const game: Game = {
            appId: parseInt(appId),
            name: gameData.name,
            isFree: gameData.price === 0,
            price: gameData.price,
            tags: [],
            salesHistory: []
          };
          
          matchingGames.push(game);
        }
      }

      return matchingGames;
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }

  /**
   * Get trending games from SteamSpy
   */
  async getTrendingGames(limit: number = 20): Promise<Game[]> {
    try {
      const trendingGames = await steamSpyApi.getTop100In2Weeks();
      
      if (!trendingGames.success || !trendingGames.data) {
        return [];
      }

      const games: Game[] = [];
      let count = 0;

      for (const [appId, gameData] of Object.entries(trendingGames.data)) {
        if (count >= limit) break;
        
        const game: Game = {
          appId: parseInt(appId),
          name: gameData.name,
          isFree: gameData.price === 0,
          price: gameData.price,
          tags: [],
          salesHistory: []
        };
        
        games.push(game);
        count++;
      }

      return games;
    } catch (error) {
      console.error('Error fetching trending games:', error);
      return [];
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Data fetching cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: Array<{ appId: number; age: number }> } {
    const entries = Array.from(this.cache.entries()).map(([appId, { timestamp }]) => ({
      appId,
      age: Date.now() - timestamp.getTime()
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}

export default new DataFetchingService(); 