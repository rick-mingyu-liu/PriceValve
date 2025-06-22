// steam.ts

// Basic game analysis interface (legacy)
export interface GameAnalysis {
  appId: number;
  name: string;
  isFree: boolean;
  price: number;
  developer?: string;
  publisher?: string;
  tags?: string[];
}

// Comprehensive analysis result
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

// Steam API interfaces
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

export interface SteamSearchResult {
  appId: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  headerImage: string;
}

// SteamSpy API interfaces
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

export interface SteamSpyTopGames {
  appId: number;
  name: string;
  scoreRank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  averageForever: number;
  average2Weeks: number;
  price: string;
  discount: string;
  genre: string;
}

export interface SteamSpyGenreData {
  genre: string;
  games: SteamSpyTopGames[];
}

// IsThereAnyDeal API interfaces
export interface ITADGameInfo {
  plain: string;
  title: string;
  image: string;
  urls: {
    game: string;
    package: string;
    dlc: string;
  };
}

export interface ITADPrice {
  shop: {
    id: string;
    name: string;
    url: string;
  };
  price: {
    amount: number;
    currency: string;
    oldAmount?: number;
    oldCurrency?: string;
  };
  drm: string[];
  url: string;
  inStock: boolean;
}

export interface ITADGamePrices {
  plain: string;
  title: string;
  prices: ITADPrice[];
  urls: {
    game: string;
    package: string;
    dlc: string;
  };
}

export interface ITADPriceHistory {
  plain: string;
  title: string;
  history: Array<{
    date: string;
    price: {
      amount: number;
      currency: string;
    };
    shop: {
      id: string;
      name: string;
    };
  }>;
}

export interface ITADSearchResult {
  plain: string;
  title: string;
  image: string;
}

export interface ITADComprehensiveData {
  currentPrices: ITADGamePrices | null;
  priceHistory: ITADPriceHistory | null;
  gameInfo: ITADGameInfo | null;
}

// Price Optimizer interfaces
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

export interface DemandCurve {
  price: number;
  demand: number;
  revenue: number;
}

export interface OptimizationResult {
  optimalPrice: number;
  expectedRevenue: number;
  expectedDemand: number;
  priceElasticity: number;
  confidence: number;
}

// API Response interfaces
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SearchResponse {
  games: SteamSearchResult[];
  total: number;
  query: string;
}

export interface AnalysisRequest {
  appId: number;
  includeSteamData?: boolean;
  includeSteamSpyData?: boolean;
  includeITADData?: boolean;
  includePriceAnalysis?: boolean;
}

export interface BatchAnalysisRequest {
  appIds: number[];
  options?: {
    includeSteamData?: boolean;
    includeSteamSpyData?: boolean;
    includeITADData?: boolean;
    includePriceAnalysis?: boolean;
  };
} 