// API Configuration
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// TypeScript interfaces matching backend responses
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
    webm: { '480': string; max: string };
    mp4: { '480': string; max: string };
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

export interface SearchResponse {
  games: SteamSearchResult[];
  total: number;
  query: string;
}

export interface SteamSearchResult {
  appId: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  headerImage: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Utility function to extract App ID from Steam URL
export function extractAppIdFromUrl(url: string): string | null {
  const regex = /store\.steampowered\.com\/app\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// API functions with proper error handling
export async function analyzeGame(appId: string): Promise<ComprehensiveAnalysis> {
  try {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ appId: parseInt(appId) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    return data.data;
  } catch (error) {
    console.error('Error analyzing game:', error);
    throw error;
  }
}

export async function searchGames(query: string, limit: number = 20): Promise<SearchResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Search failed');
    }

    return data.data;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
}

export async function getFeaturedGames(): Promise<SteamSearchResult[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/featured`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch featured games');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching featured games:', error);
    throw error;
  }
}

export async function getTopGames(criteria: string = 'top100in2weeks'): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/top-games?criteria=${criteria}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch top games');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching top games:', error);
    throw error;
  }
}

export async function healthCheck(): Promise<{ success: boolean; message: string; version: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
} 