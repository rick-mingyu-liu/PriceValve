// priceOptimizer.ts
// This is the main analysis logic. For now, returns a mock result.

import { SteamGameDetails } from './steamApi';
import { SteamSpyGameData } from './steamSpyApi';
import { ITADPriceHistory, calculatePriceStatistics, getBestDeal } from './isThereAnyDealApi';

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

/**
 * Main analysis function that combines all data sources
 */
export async function analyzeGame(appId: number): Promise<PriceAnalysis | null> {
  try {
    // This would be called from the main controller with actual API data
    // For now, we'll create a comprehensive analysis framework
    const mockAnalysis = createMockAnalysis(appId);
    return mockAnalysis;
  } catch (error) {
    console.error(`Error analyzing game ${appId}:`, error);
    return null;
  }
}

/**
 * Create a comprehensive price analysis using real data
 */
export async function createComprehensiveAnalysis(
  steamData: SteamGameDetails,
  steamSpyData: SteamSpyGameData,
  itadData: {
    currentPrices: any;
    priceHistory: ITADPriceHistory;
    gameInfo: any;
  }
): Promise<PriceAnalysis> {
  const currentPrice = steamData.price;
  const priceHistory = calculatePriceStatistics(itadData.priceHistory);
  
  // Calculate demand score
  const demandScore = calculateDemandScore(steamSpyData, steamData);
  
  // Calculate competition score
  const competitionScore = calculateCompetitionScore(steamData, steamSpyData);
  
  // Calculate market trend
  const marketTrend = calculateMarketTrend(priceHistory, steamSpyData);
  
  // Calculate various factors
  const factors = {
    popularity: calculatePopularityFactor(steamSpyData),
    reviewScore: calculateReviewScore(steamSpyData),
    age: calculateAgeFactor(steamData.releaseDate),
    genreCompetition: calculateGenreCompetition(steamData.genres),
    seasonalDemand: calculateSeasonalDemand(),
    priceElasticity: calculatePriceElasticity(priceHistory, demandScore)
  };
  
  // Generate price recommendations
  const recommendations = generateRecommendations(factors, priceHistory, currentPrice);
  
  // Calculate optimal price
  const optimalPrice = calculateOptimalPrice(currentPrice, factors, priceHistory);
  const priceConfidence = calculatePriceConfidence(factors, priceHistory);
  
  return {
    appId: steamData.appId,
    name: steamData.name,
    currentPrice,
    recommendedPrice: optimalPrice,
    priceConfidence,
    demandScore,
    competitionScore,
    marketTrend,
    priceHistory,
    factors,
    recommendations
  };
}

/**
 * Calculate demand score based on SteamSpy data
 */
function calculateDemandScore(steamSpyData: SteamSpyGameData, steamData: SteamGameDetails): number {
  const owners = parseOwnersString(steamSpyData.owners);
  const positiveRatio = steamSpyData.positive / (steamSpyData.positive + steamSpyData.negative);
  const averagePlaytime = steamSpyData.averageForever;
  const recentPlaytime = steamSpyData.average2Weeks;
  
  // Normalize values
  const ownerScore = Math.min(owners / 1000000, 1); // Normalize to 1M owners
  const ratingScore = positiveRatio;
  const playtimeScore = Math.min(averagePlaytime / 100, 1); // Normalize to 100 hours
  const recentActivityScore = Math.min(recentPlaytime / 10, 1); // Normalize to 10 hours
  
  // Weighted average: 30% owners, 25% rating, 25% playtime, 20% recent activity
  return (
    ownerScore * 0.3 +
    ratingScore * 0.25 +
    playtimeScore * 0.25 +
    recentActivityScore * 0.2
  ) * 100;
}

/**
 * Calculate competition score based on similar games
 */
function calculateCompetitionScore(steamData: SteamGameDetails, steamSpyData: SteamSpyGameData): number {
  // This would ideally compare against similar games in the same genre
  // For now, we'll use a simplified approach based on genre and price range
  
  const genreCompetition = steamData.genres.length > 0 ? 0.7 : 0.3; // More genres = more competition
  const priceCompetition = steamData.price > 5000 ? 0.8 : 0.5; // Higher price = more competition
  
  return (genreCompetition + priceCompetition) / 2 * 100;
}

/**
 * Calculate market trend based on price history and player data
 */
function calculateMarketTrend(
  priceHistory: ReturnType<typeof calculatePriceStatistics>,
  steamSpyData: SteamSpyGameData
): 'bullish' | 'bearish' | 'neutral' {
  const priceTrend = priceHistory.priceTrend;
  const recentActivity = steamSpyData.average2Weeks;
  const overallActivity = steamSpyData.averageForever;
  
  // If recent activity is higher than average and price is increasing, bullish
  if (recentActivity > overallActivity * 0.8 && priceTrend === 'increasing') {
    return 'bullish';
  }
  
  // If recent activity is low and price is decreasing, bearish
  if (recentActivity < overallActivity * 0.3 && priceTrend === 'decreasing') {
    return 'bearish';
  }
  
  return 'neutral';
}

/**
 * Calculate popularity factor
 */
function calculatePopularityFactor(steamSpyData: SteamSpyGameData): number {
  const owners = parseOwnersString(steamSpyData.owners);
  return Math.min(owners / 500000, 1); // Normalize to 500K owners
}

/**
 * Calculate review score factor
 */
function calculateReviewScore(steamSpyData: SteamSpyGameData): number {
  const totalReviews = steamSpyData.positive + steamSpyData.negative;
  if (totalReviews === 0) return 0.5; // Neutral if no reviews
  
  return steamSpyData.positive / totalReviews;
}

/**
 * Calculate age factor (newer games tend to have higher prices)
 */
function calculateAgeFactor(releaseDate: string): number {
  if (releaseDate === 'Unknown') return 0.5;
  
  const release = new Date(releaseDate);
  const now = new Date();
  const ageInYears = (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  // Newer games (0-1 year) get higher scores, older games get lower scores
  return Math.max(0.1, 1 - (ageInYears / 10)); // Decay over 10 years
}

/**
 * Calculate genre competition factor
 */
function calculateGenreCompetition(genres: string[]): number {
  // Popular genres have more competition
  const popularGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Indie'];
  const popularGenreCount = genres.filter(genre => popularGenres.includes(genre)).length;
  
  return Math.min(popularGenreCount / 3, 1); // Normalize to 3 popular genres
}

/**
 * Calculate seasonal demand factor
 */
function calculateSeasonalDemand(): number {
  const month = new Date().getMonth();
  
  // Higher demand during holiday seasons
  if (month === 11 || month === 0) return 1.2; // December/January (holiday season)
  if (month === 6 || month === 7) return 1.1; // July/August (summer sales)
  if (month === 10) return 1.1; // November (Black Friday)
  
  return 1.0; // Normal demand
}

/**
 * Calculate price elasticity of demand
 */
function calculatePriceElasticity(
  priceHistory: ReturnType<typeof calculatePriceStatistics>,
  demandScore: number
): number {
  // Simplified price elasticity calculation
  // In reality, this would require historical demand data at different price points
  
  const priceVolatility = priceHistory.priceVolatility;
  const averagePrice = priceHistory.averagePrice;
  
  if (averagePrice === 0) return -1; // Default elasticity
  
  // Higher volatility suggests more elastic demand
  const volatilityFactor = Math.min(priceVolatility / averagePrice, 1);
  
  // Higher demand score suggests less elastic demand (more loyal customers)
  const demandFactor = 1 - (demandScore / 100);
  
  // Combine factors (elasticity is typically negative)
  return -(0.5 + volatilityFactor * 0.5 + demandFactor * 0.5);
}

/**
 * Generate price recommendations
 */
function generateRecommendations(
  factors: any,
  priceHistory: ReturnType<typeof calculatePriceStatistics>,
  currentPrice: number
): string[] {
  const recommendations: string[] = [];
  
  if (factors.priceElasticity > -0.5) {
    recommendations.push("Consider lowering price - demand appears elastic");
  }
  
  if (factors.popularity > 0.8) {
    recommendations.push("High popularity suggests price can be maintained or increased");
  }
  
  if (factors.reviewScore < 0.7) {
    recommendations.push("Lower review scores may require price reduction");
  }
  
  if (factors.age < 0.3) {
    recommendations.push("Older game - consider discounting to maintain interest");
  }
  
  if (factors.seasonalDemand > 1.1) {
    recommendations.push("Seasonal demand peak - consider maintaining current price");
  }
  
  if (priceHistory.priceTrend === 'decreasing') {
    recommendations.push("Price trend is decreasing - monitor for optimal entry point");
  }
  
  return recommendations;
}

/**
 * Calculate optimal price using mathematical optimization
 */
function calculateOptimalPrice(
  currentPrice: number,
  factors: any,
  priceHistory: ReturnType<typeof calculatePriceStatistics>
): number {
  // Use price elasticity to find revenue-maximizing price
  const elasticity = factors.priceElasticity;
  const averagePrice = priceHistory.averagePrice;
  
  // Check if elasticity is valid and not zero
  if (!elasticity || elasticity === 0 || elasticity === -1) {
    // If elasticity is invalid, -1, or 0, revenue is maximized at current price
    return currentPrice;
  }
  
  // Revenue-maximizing price = current price * (1 + 1/elasticity)
  // But we need to be careful with the sign since elasticity is negative
  const optimalPriceMultiplier = 1 + (1 / elasticity);
  
  // Apply bounds to prevent extreme prices
  const minPrice = Math.max(averagePrice * 0.5, 100); // Minimum 50% of average or $1
  const maxPrice = Math.min(averagePrice * 2, currentPrice * 1.5); // Maximum 200% of average or 150% of current
  
  let optimalPrice = currentPrice * optimalPriceMultiplier;
  optimalPrice = Math.max(minPrice, Math.min(maxPrice, optimalPrice));
  
  return Math.round(optimalPrice);
}

/**
 * Calculate confidence in price recommendation
 */
function calculatePriceConfidence(
  factors: any,
  priceHistory: ReturnType<typeof calculatePriceStatistics>
): number {
  // Higher confidence with more data and consistent factors
  const dataQuality = priceHistory.priceVolatility > 0 ? 0.8 : 0.4;
  const factorValues = Object.values(factors).filter((v) => typeof v === 'number' && !isNaN(v)) as number[];
  const factorConsistency = factorValues.length > 0
    ? factorValues.reduce((sum, factor) => sum + factor, 0) / factorValues.length
    : 0.5;

  return Math.min((dataQuality + factorConsistency) / 2, 1) * 100;
}

/**
 * Generate demand curve for price optimization
 */
export function generateDemandCurve(
  basePrice: number,
  baseDemand: number,
  elasticity: number,
  priceRange: number = 0.5 // ±50% price range
): DemandCurve[] {
  const curve: DemandCurve[] = [];
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const priceMultiplier = 1 - priceRange + (priceRange * 2 * i / steps);
    const price = basePrice * priceMultiplier;
    
    // Calculate demand using price elasticity formula: Q2 = Q1 * (P2/P1)^elasticity
    const demandMultiplier = Math.pow(priceMultiplier, elasticity);
    const demand = baseDemand * demandMultiplier;
    
    const revenue = price * demand;
    
    curve.push({ price, demand, revenue });
  }
  
  return curve;
}

/**
 * Find optimal price using demand curve analysis
 */
export function findOptimalPriceFromCurve(curve: DemandCurve[]): OptimizationResult {
  const maxRevenue = Math.max(...curve.map(point => point.revenue));
  const optimalPoint = curve.find(point => point.revenue === maxRevenue)!;
  
  // Calculate price elasticity at optimal point
  const elasticity = calculateElasticityAtPoint(curve, optimalPoint);
  
  return {
    optimalPrice: optimalPoint.price,
    expectedRevenue: optimalPoint.revenue,
    expectedDemand: optimalPoint.demand,
    priceElasticity: elasticity,
    confidence: 0.85 // High confidence when using mathematical optimization
  };
}

/**
 * Calculate elasticity at a specific point on the demand curve
 */
function calculateElasticityAtPoint(curve: DemandCurve[], point: DemandCurve): number {
  const index = curve.indexOf(point);
  if (index <= 0 || index >= curve.length - 1) return -1;
  
  const prevPoint = curve[index - 1];
  const nextPoint = curve[index + 1];
  
  const priceChange = (nextPoint.price - prevPoint.price) / point.price;
  const demandChange = (nextPoint.demand - prevPoint.demand) / point.demand;
  
  return demandChange / priceChange;
}

/**
 * Parse owners string to number (helper function)
 */
function parseOwnersString(owners: string): number {
  if (!owners || owners === 'Unknown') return 0;
  
  const numbers = owners.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  const nums = numbers.map(n => parseInt(n.replace(/,/g, '')));
  return nums.reduce((sum, num) => sum + num, 0) / nums.length;
}

/**
 * Create mock analysis for testing
 */
function createMockAnalysis(appId: number): PriceAnalysis {
  return {
    appId,
    name: "Mock Game",
    currentPrice: 1999,
    recommendedPrice: 1799,
    priceConfidence: 75,
    demandScore: 65,
    competitionScore: 70,
    marketTrend: 'neutral',
    priceHistory: {
      lowestPrice: 999,
      highestPrice: 2999,
      averagePrice: 1999,
      priceVolatility: 500,
      priceTrend: 'stable'
    },
    factors: {
      popularity: 0.6,
      reviewScore: 0.75,
      age: 0.8,
      genreCompetition: 0.7,
      seasonalDemand: 1.0,
      priceElasticity: -0.8
    },
    recommendations: [
      "Consider lowering price - demand appears elastic",
      "Monitor competitor pricing in the same genre"
    ]
  };
} 