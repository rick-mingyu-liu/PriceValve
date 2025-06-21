import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  SteamAppDetails, 
  // SteamPlayerStats, 
  SteamUserGames, 
  SteamAppList,
  SteamPlayerCount,
  SteamReviewSummary,
  SteamSimilarGames,
  SteamApiResponse,
  SteamRateLimit
} from '../types/steam';

/**
 * Steam Web API Service for PriceValve
 * 
 * Steam Web API Documentation:
 * - Store API: https://store.steampowered.com/api/
 * - Community API: https://api.steampowered.com/
 * - Rate Limits: https://developer.valvesoftware.com/wiki/Steam_Web_API#Rate_Limiting
 */
class SteamApiService {
  private readonly apiKey: string;
  private readonly storeApi: AxiosInstance;
  private readonly communityApi: AxiosInstance;
  private readonly rateLimits: Map<string, SteamRateLimit> = new Map();
  
  // Rate limiting configuration
  private readonly RATE_LIMIT = {
    STORE_API: { requests: 100, window: 60000 }, // 100 requests per minute
    COMMUNITY_API: { requests: 100, window: 60000 }, // 100 requests per minute
    PLAYER_COUNT: { requests: 50, window: 60000 } // 50 requests per minute
  };

  constructor() {
    this.apiKey = process.env.STEAM_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  STEAM_API_KEY not found in environment variables');
    }

    this.storeApi = axios.create({
      baseURL: 'https://store.steampowered.com/api',
      timeout: 10000,
      headers: {
        'User-Agent': 'PriceValve/1.0 (Steam Game Pricing Optimization Tool)'
      }
    });

    this.communityApi = axios.create({
      baseURL: 'https://api.steampowered.com',
      timeout: 10000,
      headers: {
        'User-Agent': 'PriceValve/1.0 (Steam Game Pricing Optimization Tool)'
      }
    });

    // Add response interceptors for rate limiting
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.storeApi.interceptors.response.use(
      (response: AxiosResponse) => {
        this.updateRateLimit('store', response.headers);
        return response;
      },
      (error) => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded for Steam Store API');
        }
        throw error;
      }
    );

    this.communityApi.interceptors.response.use(
      (response: AxiosResponse) => {
        this.updateRateLimit('community', response.headers);
        return response;
      },
      (error) => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded for Steam Community API');
        }
        throw error;
      }
    );
  }

  private updateRateLimit(api: string, headers: any): void {
    const limit = headers['x-rate-limit-limit'];
    const remaining = headers['x-rate-limit-remaining'];
    const reset = headers['x-rate-limit-reset'];

    if (limit && remaining && reset) {
      this.rateLimits.set(api, {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset)
      });
    }
  }

  private async checkRateLimit(api: string): Promise<void> {
    const rateLimit = this.rateLimits.get(api);
    if (rateLimit && rateLimit.remaining <= 0) {
      const waitTime = Math.max(0, rateLimit.reset - Date.now());
      if (waitTime > 0) {
        console.log(`Rate limit reached for ${api} API. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Get detailed information about a Steam app
   * Documentation: https://store.steampowered.com/api/appdetails
   */
  async getAppDetails(appId: number): Promise<SteamApiResponse<SteamAppDetails>> {
    try {
      await this.checkRateLimit('store');
      
      const response = await this.storeApi.get('/appdetails', {
        params: {
          appids: appId,
          filters: 'basic,price_overview,metacritic,release_date,categories,genres,screenshots,achievements,dlc,related_products'
        }
      });

      const data = response.data[appId.toString()];
      if (!data.success) {
        return {
          success: false,
          error: 'App not found or not available'
        };
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching app details:', error);
      return {
        success: false,
        error: 'Failed to fetch app details from Steam'
      };
    }
  }

  /**
   * Get current player count for a game
   * Documentation: https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/
   */
  async getPlayerCount(appId: number): Promise<SteamApiResponse<SteamPlayerCount>> {
    try {
      await this.checkRateLimit('community');
      
      const response = await this.communityApi.get('/ISteamUserStats/GetNumberOfCurrentPlayers/v1/', {
        params: {
          appid: appId
        }
      });

      return {
        success: true,
        data: response.data.response
      };
    } catch (error) {
      console.error('Error fetching player count:', error);
      return {
        success: false,
        error: 'Failed to fetch player count from Steam'
      };
    }
  }

  /**
   * Get review summary for a game
   * Documentation: https://store.steampowered.com/appreviews/
   */
  async getReviewSummary(appId: number): Promise<SteamApiResponse<SteamReviewSummary>> {
    try {
      await this.checkRateLimit('store');
      
      const response = await this.storeApi.get(`/appreviews/${appId}`, {
        params: {
          json: 1,
          filter: 'summary',
          language: 'all',
          day_range: 30
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching review summary:', error);
      return {
        success: false,
        error: 'Failed to fetch review summary from Steam'
      };
    }
  }

  /**
   * Get user's owned games
   * Documentation: https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/
   */
  async getUserGames(steamId: string, includeAppInfo: boolean = true): Promise<SteamApiResponse<SteamUserGames>> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Steam API key required for user games endpoint'
        };
      }

      await this.checkRateLimit('community');
      
      const response = await this.communityApi.get('/IPlayerService/GetOwnedGames/v1/', {
        params: {
          key: this.apiKey,
          steamid: steamId,
          include_appinfo: includeAppInfo ? 1 : 0,
          include_played_free_games: 1,
          appids_filter: []
        }
      });

      return {
        success: true,
        data: response.data.response
      };
    } catch (error) {
      console.error('Error fetching user games:', error);
      return {
        success: false,
        error: 'Failed to fetch user games from Steam'
      };
    }
  }

  /**
   * Get list of all Steam apps (for finding similar games)
   * Documentation: https://api.steampowered.com/ISteamApps/GetAppList/v2/
   */
  async getAppList(): Promise<SteamApiResponse<SteamAppList>> {
    try {
      await this.checkRateLimit('community');
      
      const response = await this.communityApi.get('/ISteamApps/GetAppList/v2/');

      return {
        success: true,
        data: response.data.applist
      };
    } catch (error) {
      console.error('Error fetching app list:', error);
      return {
        success: false,
        error: 'Failed to fetch app list from Steam'
      };
    }
  }

  /**
   * Find similar games based on categories and genres
   * This is a custom implementation since Steam doesn't provide a direct similar games API
   */
  async findSimilarGames(appId: number, limit: number = 10): Promise<SteamApiResponse<SteamSimilarGames[]>> {
    try {
      // First get the target game details
      const targetGame = await this.getAppDetails(appId);
      if (!targetGame.success || !targetGame.data) {
        return {
          success: false,
          error: 'Failed to get target game details'
        };
      }

      // Get categories and genres from target game
      const targetCategories = targetGame.data.categories?.map(c => c.description) || [];
      const targetGenres = targetGame.data.genres?.map(g => g.description) || [];

      // For now, return a placeholder implementation
      // In a real implementation, you would:
      // 1. Search through the app list for games with similar categories/genres
      // 2. Use machine learning or similarity algorithms
      // 3. Consider price ranges, release dates, etc.
      
      const similarGames: SteamSimilarGames[] = [];
      
      // Example similar games (you would implement actual similarity logic)
      const exampleSimilarIds = [570, 440, 252490]; // Dota 2, TF2, Rust
      
      for (const similarId of exampleSimilarIds.slice(0, limit)) {
        if (similarId !== appId) {
          const similarGame = await this.getAppDetails(similarId);
          if (similarGame.success && similarGame.data) {
            similarGames.push({
              appid: similarId,
              name: similarGame.data.name,
              similarity_score: 0.8, // Placeholder score
              tags: [...targetCategories, ...targetGenres],
              price_overview: similarGame.data.price_overview
            });
          }
        }
      }

      return {
        success: true,
        data: similarGames
      };
    } catch (error) {
      console.error('Error finding similar games:', error);
      return {
        success: false,
        error: 'Failed to find similar games'
      };
    }
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(): Record<string, SteamRateLimit> {
    return Object.fromEntries(this.rateLimits);
  }

  /**
   * Check if API key is configured
   */
  isApiKeyConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const steamApiService = new SteamApiService();
export default steamApiService; 