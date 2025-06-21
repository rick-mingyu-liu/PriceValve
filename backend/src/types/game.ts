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

  // SteamSpy Stats
  owners?: string;              // From SteamSpy (e.g., "1,000,000 .. 2,000,000")
  averagePlaytime?: number;     // From SteamSpy: "average_forever" in minutes

  // Steam Review API (Only this replaces Steam Web API)
  reviewScore?: number;         // review_score (1-10)
  reviewScoreDesc?: string;     // "Very Positive"
  totalReviews?: number;        // total_reviews
  totalPositive?: number;       // total_positive
  totalNegative?: number;       // total_negative

  // NLP content (keep if still relevant)
  shortDescription?: string;

  // ML / Clustering
  embedding?: number[];
  cluster?: number;
  features?: Record<string, number>;

  // Sales/Ownership History from SteamSpy
  salesHistory: SalesDataPoint[];
}

export interface SalesDataPoint {
  date: string;          // ISO date
  owners: number;        // Parsed numeric estimate (from SteamSpy)
  revenue?: number;      // price * (owner delta)
  volumeChange?: number; // Owner delta from previous entry
}
