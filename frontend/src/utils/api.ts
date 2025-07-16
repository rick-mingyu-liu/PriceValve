const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface SteamGame {
  appid: number;
  name: string;
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
  };
}

export interface SteamUserProfile {
  steamid: string;
  personaname: string;
  avatarfull: string;
  profileurl: string;
  realname?: string;
  timecreated?: number;
}

export interface SteamPriceData {
  success: boolean;
  data?: {
    price_overview?: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
    };
  };
}

// Game Analysis Types
export interface GameAnalysis {
  appId: number;
  name: string;
  developer: string;
  publisher: string;
  price: {
    currentPrice: number;
    initialPrice: number;
    discount: number;
    priceRange: string;
    priceCategory: 'Free' | 'Budget' | 'Mid-Range' | 'Premium' | 'AAA';
    pricePerHour: number;
    valueScore: number;
  };
  players: {
    averageForever: number;
    average2Weeks: number;
    medianForever: number;
    median2Weeks: number;
    currentPlayers: number;
    playerEngagement: 'Low' | 'Medium' | 'High' | 'Very High';
    retentionScore: number;
  };
  market: {
    owners: string;
    ownershipRange: {
      min: number;
      max: number;
      average: number;
    };
    marketPosition: 'Niche' | 'Popular' | 'Blockbuster' | 'Viral';
    marketScore: number;
  };
  reviews: {
    scoreRank: string;
    reviewScore: number;
    reviewCategory: string;
    qualityScore: number;
  };
  tags: Array<{ name: string; votes: number }>;
  genres: string[];
  languages: string[];
  overallScore: number;
  recommendations: string[];
  optimalPricing: {
    suggestedPrice: number;
    confidence: number;
    reasoning: string[];
  };
}

export interface GameAnalysisResponse {
  success: boolean;
  data?: GameAnalysis;
  error?: string;
  metadata?: {
    appId: number;
    analyzedAt: string;
    dataSources: {
      steam: boolean;
      steamSpy: boolean;
    };
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Game Analysis API methods
  async analyzeGame(appId: number): Promise<GameAnalysisResponse> {
    return this.request<GameAnalysisResponse>(`/api/analyze/${appId}`);
  }

  // Steam API methods (legacy)
  async getGameDetails(appId: number): Promise<SteamGame> {
    return this.request<SteamGame>(`/steam/game/${appId}`);
  }

  async getUserProfile(steamId: string): Promise<SteamUserProfile> {
    return this.request<SteamUserProfile>(`/steam/user/${steamId}`);
  }

  async getGamePrice(appId: number): Promise<SteamPriceData> {
    return this.request<SteamPriceData>(`/steam/price/${appId}`);
  }

  async getMultipleGames(appIds: number[]): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/steam/games', {
      method: 'POST',
      body: JSON.stringify({ appIds }),
    });
  }

  async searchGames(query: string): Promise<SteamGame[]> {
    return this.request<SteamGame[]>(`/steam/search?q=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; message: string; version: string; environment: string }> {
    return this.request<{ status: string; timestamp: string; message: string; version: string; environment: string }>('/api/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 