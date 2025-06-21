import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Steam Review API Service for PriceValve
 * 
 * Steam Review API Documentation:
 * - https://store.steampowered.com/appreviews/{appid}?json=1
 * - Rate Limits: 1 request per second recommended
 */
export interface SteamReviewSummary {
  query_summary: {
    num_reviews: number;
    review_score: string;
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
}

export interface SteamReviewApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class SteamReviewApiService {
  private readonly api: AxiosInstance;
  private lastRequestTime: number = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  constructor() {
    this.api = axios.create({
      baseURL: 'https://store.steampowered.com',
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
      console.log(`Rate limiting: waiting ${waitTime}ms before next Steam Review request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Get review summary for a Steam app
   * @param appId - Steam Application ID
   */
  async getReviewSummary(appId: number): Promise<SteamReviewApiResponse<SteamReviewSummary>> {
    try {
      await this.enforceRateLimit();
      
      console.log(`Fetching Steam Review data for app ID: ${appId}`);
      
      const response: AxiosResponse<SteamReviewSummary> = await this.api.get(`/appreviews/${appId}`, {
        params: {
          json: 1,
          filter: 'summary',
          language: 'all',
          day_range: 30 // Last 30 days
        }
      });

      if (!response.data || !response.data.query_summary) {
        return {
          success: false,
          error: 'No review data available for this app'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching Steam Review summary:', error.message);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'App not found or no reviews available'
        };
      }
      
      return {
        success: false,
        error: 'Failed to fetch review summary from Steam'
      };
    }
  }

  /**
   * Get detailed reviews for a Steam app
   * @param appId - Steam Application ID
   * @param options - Review fetching options
   */
  async getReviews(
    appId: number, 
    options: {
      filter?: 'all' | 'recent' | 'updated';
      language?: string;
      dayRange?: number;
      reviewType?: 'all' | 'positive' | 'negative';
      purchaseType?: 'all' | 'steam' | 'non_steam_purchase';
      numPerPage?: number;
      cursor?: string;
    } = {}
  ): Promise<SteamReviewApiResponse<any>> {
    try {
      await this.enforceRateLimit();
      
      const params = {
        json: 1,
        filter: options.filter || 'all',
        language: options.language || 'all',
        day_range: options.dayRange || 30,
        review_type: options.reviewType || 'all',
        purchase_type: options.purchaseType || 'all',
        num_per_page: options.numPerPage || 20,
        ...(options.cursor && { cursor: options.cursor })
      };

      const response = await this.api.get(`/appreviews/${appId}`, { params });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching Steam reviews:', error.message);
      return {
        success: false,
        error: 'Failed to fetch reviews from Steam'
      };
    }
  }

  /**
   * Get review score and description for a Steam app
   * @param appId - Steam Application ID
   */
  async getReviewScore(appId: number): Promise<SteamReviewApiResponse<{
    score: number;
    description: string;
    totalReviews: number;
    totalPositive: number;
    totalNegative: number;
  }>> {
    try {
      const result = await this.getReviewSummary(appId);
      
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Failed to fetch review score'
        };
      }

      const summary = result.data.query_summary;
      const score = parseInt(summary.review_score) || 0;

      return {
        success: true,
        data: {
          score,
          description: summary.review_score_desc,
          totalReviews: summary.total_reviews,
          totalPositive: summary.total_positive,
          totalNegative: summary.total_negative
        }
      };
    } catch (error: any) {
      console.error('Error getting review score:', error.message);
      return {
        success: false,
        error: 'Failed to get review score'
      };
    }
  }
}

export default new SteamReviewApiService(); 