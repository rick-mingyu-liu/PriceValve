const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Analyze a game (core functionality)
  async analyzeGame(appId: number): Promise<GameAnalysisResponse> {
    return this.request<GameAnalysisResponse>(`/api/analyze/${appId}`);
  }

  // Get full game data by ID
  async getGameData(appId: number): Promise<SteamGame> {
    return this.request<SteamGame>(`/api/games/${appId}`);
  }

  // Batch fetch games
  async getMultipleGames(appIds: number[]): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/api/games/batch', {
      method: 'POST',
      body: JSON.stringify({ appIds }),
    });
  }

  // Search games
  async searchGames(query: string): Promise<SteamGame[]> {
    return this.request<SteamGame[]>(`/api/games/search?q=${encodeURIComponent(query)}`);
  }

  // Trending, top, best-value
  async getTrendingGames(): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/api/games/trending');
  }

  async getTopGames(): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/api/games/top');
  }

  async getBestValueGames(): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/api/games/best-value');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; message: string; version: string; environment: string }> {
    return this.request('/api/health');
  }

  // System info (optional if using a dashboard)
  async getCacheStats(): Promise<any> {
    return this.request('/api/system/cache/stats');
  }

  async clearCache(): Promise<any> {
    return this.request('/api/system/cache', { method: 'DELETE' });
  }

  async getDataSourcesStatus(): Promise<any> {
    return this.request('/api/system/status');
  }

  async getDatabaseStats(): Promise<any> {
    return this.request('/api/system/db/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 