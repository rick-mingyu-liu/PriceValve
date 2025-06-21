export interface Game {
  appId: number;
  name: string;
  isFree: boolean;
  price: number;
  discountPercent?: number;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  tags: string[];

  // Player/Market Stats
  owners?: string;                    
  averagePlaytime?: number;

  // Review Score
  reviewScore?: number;
  totalReviews?: number;

  // NLP content
  shortDescription?: string;

  // ML / Clustering
  embedding?: number[];
  cluster?: number;
  features?: Record<string, number>;

  // ⏱️ Time Series for Sales / Ownership
  salesHistory: SalesDataPoint[];    

}

export interface SalesDataPoint {
  date: string;          // ISO date, e.g., "2025-06-21"
  owners: number;        // Parsed numeric ownership estimate
  revenue?: number;      // If you calculate this (price * owner delta)
  volumeChange?: number; // Change from previous day
} 