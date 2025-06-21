import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SteamSpyAppDetails, SteamSpyApiResponse } from '../types/steamSpy';

/**
 * SteamSpy API Service for PriceValve
 * 
 * SteamSpy API Documentation:
 * - https://steamspy.com/api.php
 * - Rate Limits: 1 request per second for most requests, 1 request per 60 seconds for 'all' requests
 */
class SteamSpyApiService {
  private readonly api: AxiosInstance;
  private lastRequestTime: number = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  constructor() {
    this.api = axios.create({
      baseURL: 'https://steamspy.com/api.php',
      timeout: 15000,
      headers: {
        'User-Agent': 'PriceValve/1.0 (Steam Game Pricing Optimization Tool)'
      }
    });
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next SteamSpy request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Get detailed information about a Steam app from SteamSpy
   * @param appId - Steam Application ID
   */
  async getAppDetails(appId: number): Promise<SteamSpyApiResponse<SteamSpyAppDetails>> {
    try {
      await this.enforceRateLimit();
      
      console.log(`Fetching SteamSpy data for app ID: ${appId}`);
      
      const response: AxiosResponse<SteamSpyAppDetails> = await this.api.get('', {
        params: {
          request: 'appdetails',
          appid: appId
        }
      });

      // Check if app data is hidden (appid 999999)
      if (response.data.appid === 999999) {
        return {
          success: false,
          error: 'App data is hidden on developer request'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching SteamSpy app details:', error.message);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'App not found in SteamSpy database'
        };
      }
      
      return {
        success: false,
        error: 'Failed to fetch app details from SteamSpy'
      };
    }
  }

  /**
   * Get games by genre
   * @param genre - Genre name (e.g., 'Action', 'RPG')
   */
  async getGamesByGenre(genre: string): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      await this.enforceRateLimit();
      
      const response = await this.api.get('', {
        params: {
          request: 'genre',
          genre: genre
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching games by genre:', error.message);
      return {
        success: false,
        error: 'Failed to fetch games by genre from SteamSpy'
      };
    }
  }

  /**
   * Get games by tag
   * @param tag - Tag name (e.g., 'Early Access', 'Multiplayer')
   */
  async getGamesByTag(tag: string): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      await this.enforceRateLimit();
      
      const response = await this.api.get('', {
        params: {
          request: 'tag',
          tag: tag
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching games by tag:', error.message);
      return {
        success: false,
        error: 'Failed to fetch games by tag from SteamSpy'
      };
    }
  }

  /**
   * Get top 100 games by players in the last two weeks
   */
  async getTop100In2Weeks(): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      await this.enforceRateLimit();
      
      const response = await this.api.get('', {
        params: {
          request: 'top100in2weeks'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching top 100 in 2 weeks:', error.message);
      return {
        success: false,
        error: 'Failed to fetch top 100 games from SteamSpy'
      };
    }
  }

  /**
   * Get top 100 games by players since March 2009
   */
  async getTop100Forever(): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      await this.enforceRateLimit();
      
      const response = await this.api.get('', {
        params: {
          request: 'top100forever'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching top 100 forever:', error.message);
      return {
        success: false,
        error: 'Failed to fetch top 100 forever games from SteamSpy'
      };
    }
  }

  /**
   * Get top 100 games by owners
   */
  async getTop100Owned(): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      await this.enforceRateLimit();
      
      const response = await this.api.get('', {
        params: {
          request: 'top100owned'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching top 100 owned:', error.message);
      return {
        success: false,
        error: 'Failed to fetch top 100 owned games from SteamSpy'
      };
    }
  }

  /**
   * Get all games with owners data (paginated)
   * @param page - Page number (starts at 0)
   */
  async getAllGames(page: number = 0): Promise<SteamSpyApiResponse<Record<string, SteamSpyAppDetails>>> {
    try {
      // Special rate limit for 'all' requests: 1 request per 60 seconds
      const now = Date.now();
      const timeSinceLastAllRequest = now - this.lastRequestTime;
      
      if (timeSinceLastAllRequest < 60000) {
        const waitTime = 60000 - timeSinceLastAllRequest;
        console.log(`Rate limiting 'all' request: waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      this.lastRequestTime = Date.now();
      
      const response = await this.api.get('', {
        params: {
          request: 'all',
          page: page
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching all games:', error.message);
      return {
        success: false,
        error: 'Failed to fetch all games from SteamSpy'
      };
    }
  }
}

export default new SteamSpyApiService(); 