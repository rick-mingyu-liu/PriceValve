// SteamSpy API Types for PriceValve
// Documentation: https://steamspy.com/api.php

export interface SteamSpyAppDetails {
  appid: number;
  name: string;
  developer: string;
  publisher: string;
  score_rank: string;
  owners: string;
  average_forever: number;
  average_2weeks: number;
  median_forever: number;
  median_2weeks: number;
  ccu: number;
  price: number;
  initialprice: number;
  discount: number;
  tags: Record<string, number>;
  languages: string;
  genre: string;
}

export interface SteamSpyApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SteamSpyTag {
  name: string;
  votes: number;
}

export interface SteamSpyGenre {
  name: string;
  count: number;
}

export interface SteamSpyPriceAnalysis {
  currentPrice: number;
  initialPrice: number;
  discount: number;
  priceRange: string;
  priceCategory: 'Free' | 'Budget' | 'Mid-Range' | 'Premium' | 'AAA';
  pricePerHour: number;
  valueScore: number;
}

export interface SteamSpyPlayerAnalysis {
  averageForever: number;
  average2Weeks: number;
  medianForever: number;
  median2Weeks: number;
  currentPlayers: number;
  playerEngagement: 'Low' | 'Medium' | 'High' | 'Very High';
  retentionScore: number;
}

export interface SteamSpyMarketAnalysis {
  owners: string;
  ownershipRange: {
    min: number;
    max: number;
    average: number;
  };
  marketPosition: 'Niche' | 'Popular' | 'Blockbuster' | 'Viral';
  marketScore: number;
}

export interface SteamSpyReviewAnalysis {
  scoreRank: string;
  reviewScore: number;
  reviewCategory: 'Overwhelmingly Positive' | 'Very Positive' | 'Positive' | 'Mixed' | 'Negative' | 'Very Negative' | 'Overwhelmingly Negative';
  qualityScore: number;
}

export interface SteamSpyGameAnalysis {
  appId: number;
  name: string;
  developer: string;
  publisher: string;
  price: SteamSpyPriceAnalysis;
  players: SteamSpyPlayerAnalysis;
  market: SteamSpyMarketAnalysis;
  reviews: SteamSpyReviewAnalysis;
  tags: SteamSpyTag[];
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