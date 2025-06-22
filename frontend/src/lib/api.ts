// API client for PriceValve backend
const BASE_URL = "http://localhost:5001";

// TypeScript interfaces matching backend response structure
export interface SteamGameDetails {
  appId: number;
  name: string;
  isFree: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  developer: string;
  publisher: string;
  tags: string[];
  categories: string[];
  releaseDate: string;
  metacritic?: {
    score: number;
    url: string;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  genres: string[];
  description: string;
  headerImage: string;
  screenshots: string[];
  movies: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: {
      '480': string;
      max: string;
    };
    mp4: {
      '480': string;
      max: string;
    };
  }>;
  background: string;
}

export interface SteamSpyGameData {
  appId: number;
  name: string;
  developer: string;
  publisher: string;
  scoreRank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  averageForever: number;
  average2Weeks: number;
  medianForever: number;
  median2Weeks: number;
  price: string;
  initialPrice: string;
  discount: string;
  languages: string;
  genre: string;
  tags: { [key: string]: number };
  releaseDate: string;
  lastUpdated: string;
}

export interface ITADComprehensiveData {
  currentPrices: any;
  priceHistory: any;
  gameInfo: any;
}

export interface PriceAnalysis {
  appId: number;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  priceConfidence: number;
  demandScore: number;
  competitionScore: number;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  priceHistory: {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    priceVolatility: number;
    priceTrend: 'increasing' | 'decreasing' | 'stable';
  };
  factors: {
    popularity: number;
    reviewScore: number;
    age: number;
    genreCompetition: number;
    seasonalDemand: number;
    priceElasticity: number;
  };
  recommendations: string[];
}

export interface ComprehensiveAnalysis {
  appId: number;
  name: string;
  steamData: SteamGameDetails | null;
  steamSpyData: SteamSpyGameData | null;
  itadData: ITADComprehensiveData | null;
  priceAnalysis: PriceAnalysis | null;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface AnalysisRequest {
  appId: number;
  includeSteamData?: boolean;
  includeSteamSpyData?: boolean;
  includeITADData?: boolean;
  includePriceAnalysis?: boolean;
}

// API client class
class PriceValveAPI {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Analyze a single game with comprehensive data
   */
  async analyzeGame(appId: string): Promise<APIResponse<ComprehensiveAnalysis>> {
    const numericAppId = parseInt(appId, 10);
    
    if (isNaN(numericAppId)) {
      return {
        success: false,
        error: 'Invalid App ID provided',
        timestamp: new Date().toISOString(),
      };
    }

    return this.makeRequest<ComprehensiveAnalysis>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ appId: numericAppId }),
      mode: 'cors',
    });
  }

  /**
   * Search for games on Steam
   */
  async searchGames(query: string, limit: number = 20): Promise<APIResponse<any>> {
    return this.makeRequest(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Get Steam data for a specific game
   */
  async getSteamData(appId: string): Promise<APIResponse<SteamGameDetails>> {
    return this.makeRequest<SteamGameDetails>(`/api/steam/${appId}`);
  }

  /**
   * Get SteamSpy data for a specific game
   */
  async getSteamSpyData(appId: string): Promise<APIResponse<SteamSpyGameData>> {
    return this.makeRequest<SteamSpyGameData>(`/api/steamspy/${appId}`);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<APIResponse<any>> {
    return this.makeRequest('/api/health');
  }
}

// Export singleton instance
export const api = new PriceValveAPI();

// Utility function to extract App ID from Steam URL
export function extractAppIdFromUrl(url: string): string | null {
  const patterns = [
    /steamcommunity\.com\/app\/(\d+)/,
    /store\.steampowered\.com\/app\/(\d+)/,
    /steampowered\.com\/app\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Utility function to validate Steam URL
export function isValidSteamUrl(url: string): boolean {
  const steamPatterns = [
    /^https?:\/\/(www\.)?steamcommunity\.com\/app\/\d+/,
    /^https?:\/\/(www\.)?store\.steampowered\.com\/app\/\d+/,
    /^https?:\/\/(www\.)?steampowered\.com\/app\/\d+/,
  ];

  return steamPatterns.some(pattern => pattern.test(url));
} 