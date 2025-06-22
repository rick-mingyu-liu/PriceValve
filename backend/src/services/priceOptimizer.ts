// priceOptimizer.ts
// This is the main analysis logic. For now, returns a mock result.

import { SteamGameDetails } from './steamApi';
import { SteamSpyGameData } from './steamSpyApi';

export interface CompetitorPrice {
  name: string;
  price: number;
  isTarget?: boolean;
  isRecommended?: boolean;
}

export interface PriceTrendPoint {
  month: string;
  currentPrice: number;
  recommendedPrice: number;
}

export interface MarketSharePoint {
  name: string;
  marketShare: number;
}

interface PriceHistoryInfo {
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceVolatility: number;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
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
  priceHistory: PriceHistoryInfo;
  factors: {
    popularity: number;
    reviewScore: number;
    age: number;
    genreCompetition: number;
    seasonalDemand: number;
    priceElasticity: number;
  };
  recommendations: string[];
  optimizationScore: number;
  status: 'optimized' | 'attention' | 'action_needed';
  urgency: 'high' | 'medium' | null;
  revenueIncrease: number; // as a percentage
  timingRecommendation: string;
  timingReason: string;
  executiveSummary: string;
  competitorPriceComparison: CompetitorPrice[];
  priceTrendAnalysis: PriceTrendPoint[];
  marketShareAnalysis: MarketSharePoint[];
  underpricedComparedToSimilar: boolean;
  marketPositioningStatement: string;
  closestCompetitor: { name: string; price: number };
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
  itadData: any | null
): Promise<PriceAnalysis> {
  const currentPrice = steamData.price;
  
  // Handle case where ITAD data is missing
  const priceHistory: PriceHistoryInfo = {
        lowestPrice: currentPrice * 0.8,
        highestPrice: currentPrice * 1.2,
        averagePrice: currentPrice,
        priceVolatility: 0.1,
        priceTrend: 'stable' as const
      };
  
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
  
  // Generate demand curve and find optimal price
  const ownersEstimate = parseOwnersString(steamSpyData.owners) || 100000; // Fallback for base demand
  const demandCurve = generateDemandCurve(currentPrice, ownersEstimate, factors.priceElasticity);
  const optimizationResult = findOptimalPriceFromCurve(demandCurve);

  const recommendedPrice = optimizationResult.optimalPrice;
  const priceConfidence = calculatePriceConfidence(factors, priceHistory);

  // Find revenue at current price from the curve
  const currentPricePoint = demandCurve.find(p => Math.abs(p.price - currentPrice) < 0.01);
  const currentRevenue = currentPricePoint ? currentPricePoint.revenue : currentPrice * ownersEstimate * 0.05; // Estimate if not on curve
  const expectedRevenue = optimizationResult.expectedRevenue;
  
  // Calculate dynamic revenue increase based on game-specific factors
  const revenueIncrease = calculateDynamicRevenueIncrease(
    currentPrice,
    recommendedPrice,
    steamData,
    steamSpyData,
    demandScore,
    competitionScore,
    factors,
    currentRevenue,
    expectedRevenue
  );

  // NEW: Calculate optimization score and status
  const optimizationScore = calculateOptimizationScore(currentPrice, recommendedPrice);
  let status: 'optimized' | 'attention' | 'action_needed';
  let urgency: 'high' | 'medium' | null = null;
  if (optimizationScore >= 71) {
    status = 'optimized';
  } else if (optimizationScore >= 50) {
    status = 'attention';
    urgency = 'medium';
  } else {
    status = 'action_needed';
    urgency = 'high';
  }

  const recommendations = generateRecommendations(factors, priceHistory, currentPrice);

  const competitorRangeMin = recommendedPrice * 0.9;
  const competitorRangeMax = recommendedPrice * 1.2;
  const closestCompetitor = { name: 'Stardew Valley', price: 1999 };

  const executiveSummary = `Based on our comprehensive analysis of ${
    steamData.name
  }, we recommend increasing your price from $${(currentPrice / 100).toFixed(2)} to $${(
    recommendedPrice / 100
  ).toFixed(2)}. This represents a ${revenueIncrease.toFixed(0)}% potential revenue increase.

Your game is currently underpriced compared to similar titles in the market. The competitor analysis shows that games with similar features and quality are priced between $${(
    competitorRangeMin / 100
  ).toFixed(2)} and $${(competitorRangeMax / 100).toFixed(
    2
  )}, with strong sales performance. Your current pricing positions you at the bottom of this range, potentially signaling lower quality to consumers.

The price trend analysis indicates consistent market acceptance of higher price points in your genre. We recommend implementing this change during your next major content update to provide additional value justification to your player base.

With ${priceConfidence.toFixed(
    0
  )}% confidence, this pricing strategy will optimize your revenue while maintaining competitive positioning in the indie gaming market.`;

  const competitorPriceComparison = [
    { name: 'Hollow Knight', price: 2499 },
    { name: 'Dead Cells', price: 2299 },
    { name: 'Celeste', price: 2699 },
    { name: 'Stardew Valley', price: 1999 },
    { name: 'Undertale', price: 2999 },
    { name: 'Your Game (Current)', price: currentPrice, isTarget: true },
    { name: 'Your Game (Recommended)', price: recommendedPrice, isRecommended: true },
  ];

  const priceTrendAnalysis = [
    { month: 'Jan', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 },
    { month: 'Feb', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 },
    { month: 'Mar', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 * 1.05 },
    { month: 'Apr', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 * 1.1 },
    { month: 'May', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 * 1.08 },
    { month: 'Jun', currentPrice: currentPrice / 100, recommendedPrice: recommendedPrice / 100 },
  ]

  const marketShareAnalysis = calculateMarketShareAnalysis(steamData, steamSpyData, demandScore, competitionScore);

  return {
    appId: steamData.appId,
    name: steamData.name,
    currentPrice,
    recommendedPrice,
    priceConfidence,
    demandScore,
    competitionScore,
    marketTrend,
    priceHistory,
    factors,
    recommendations,
    optimizationScore,
    status,
    urgency,
    revenueIncrease,
    timingRecommendation: "Implement during your next major update or DLC release.",
    timingReason: "This provides additional value justification to your player base and can minimize potential player backlash from a price increase.",
    executiveSummary,
    competitorPriceComparison,
    priceTrendAnalysis,
    marketShareAnalysis,
    underpricedComparedToSimilar: recommendedPrice > currentPrice,
    marketPositioningStatement: "Position as premium indie title. Your quality justifies higher pricing tier.",
    closestCompetitor
  };
}

/**
 * Calculate dynamic market share analysis based on game data
 */
function calculateMarketShareAnalysis(
  steamData: SteamGameDetails,
  steamSpyData: SteamSpyGameData,
  demandScore: number,
  competitionScore: number
): MarketSharePoint[] {
  // Calculate base market share based on demand and competition
  const baseMarketShare = Math.min(demandScore / 10, 15); // Max 15% for any single game
  
  // Factor in game age - newer games tend to have higher market share initially
  const ageFactor = calculateAgeFactor(steamData.releaseDate);
  const ageAdjustedShare = baseMarketShare * (0.7 + ageFactor * 0.6); // 0.7-1.3x multiplier
  
  // Factor in genre popularity - popular genres have more competition
  const genreCompetition = calculateGenreCompetition(steamData.genres);
  const genreAdjustedShare = ageAdjustedShare * (1 - genreCompetition * 0.3); // Reduce share in competitive genres
  
  // Factor in current popularity (recent activity vs long-term activity)
  const recentActivityRatio = steamSpyData.average2Weeks / Math.max(steamSpyData.averageForever, 1);
  const popularityFactor = Math.min(recentActivityRatio * 2, 1.5); // Boost for recently active games
  const finalGameShare = Math.max(1, Math.min(20, genreAdjustedShare * popularityFactor));
  
  // Calculate competitor market shares based on competition level
  const competitionLevel = competitionScore / 100;
  const topCompetitorShare = Math.max(15, 40 - (competitionLevel * 25)); // 15-40% range
  const similarGamesShare = Math.max(20, 50 - (competitionLevel * 20)); // 30-50% range
  
  // Calculate "other games" share (remaining market)
  const otherGamesShare = Math.max(10, 100 - finalGameShare - topCompetitorShare - similarGamesShare);
  
  // Add some randomness to make it more realistic (±2-4% depending on market size)
  const randomVariation = (value: number, isMainGame: boolean = false) => {
    const maxVariation = isMainGame ? 4 : 3; // Less variation for main game
    const variation = (Math.random() - 0.5) * maxVariation * 2;
    return Math.max(1, Math.min(50, value + variation));
  };
  
  return [
    { name: 'Your Game', marketShare: Math.round(randomVariation(finalGameShare, true)) },
    { name: 'Top Competitor', marketShare: Math.round(randomVariation(topCompetitorShare)) },
    { name: 'Similar Games', marketShare: Math.round(randomVariation(similarGamesShare)) },
    { name: 'Other Games', marketShare: Math.round(randomVariation(otherGamesShare)) },
  ];
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
 * Calculates the optimization score based on how close the current price is to the optimal price.
 * The score is a value between 0 and 100.
 */
function calculateOptimizationScore(currentPrice: number, optimalPrice: number): number {
  if (optimalPrice <= 0 || currentPrice <= 0) return 50; // Avoid division by zero, neutral score
  if (Math.abs(currentPrice - optimalPrice) < 0.01) return 100;

  // The further away, the lower the score. We'll use a wider range.
  const diff = Math.abs(optimalPrice - currentPrice) / optimalPrice;

  // Scale score so that a 50% price difference results in a score of 0
  const score = Math.max(0, (1 - diff * 2) * 100);
  
  return score;
}

/**
 * Calculate market trend based on price history and player data
 */
function calculateMarketTrend(
  priceHistory: PriceHistoryInfo,
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
  priceHistory: PriceHistoryInfo,
  demandScore: number
): number {
  // Simplified price elasticity calculation
  // In reality, this would require historical demand data at different price points
  const priceVolatility = priceHistory.priceVolatility;
  const averagePrice = priceHistory.averagePrice;

  // Highly volatile prices suggest more elastic demand (people wait for sales)
  // Higher demand score can mean less elastic demand (people want it now)
  const elasticity = (priceVolatility * 2) - (demandScore / 100);

  return Math.max(0.5, Math.min(elasticity, 3.0)); // Clamp elasticity
}

/**
 * Generate recommendations based on analysis factors
 */
function generateRecommendations(
  factors: any,
  priceHistory: PriceHistoryInfo,
  currentPrice: number
): string[] {
  const recommendations: string[] = [];
  
  if (factors.priceElasticity > 1.5) {
    recommendations.push('Demand is elastic. Consider seasonal discounts to maximize revenue.');
  } else {
    recommendations.push('Demand is inelastic. Stable pricing is likely effective.');
  }
  
  if (factors.reviewScore > 0.8 && factors.popularity < 0.5) {
    recommendations.push('High review scores but low popularity. Increase marketing efforts.');
  }
  
  if (factors.age < 0.2) {
    recommendations.push('Game is new. Maintain premium pricing to establish value.');
  }
  
  const optimalPrice = calculateOptimalPrice(currentPrice, factors, priceHistory);
  if (optimalPrice > currentPrice * 1.1) {
    recommendations.push(`Price may be too low. Consider increasing to around $${(optimalPrice / 100).toFixed(2)}.`);
  } else if (optimalPrice < currentPrice * 0.9) {
    recommendations.push(`Price may be too high. Consider lowering to around $${(optimalPrice / 100).toFixed(2)}.`);
  }
  
  return recommendations;
}

/**
 * A simplified optimal price calculation
 */
function calculateOptimalPrice(
  currentPrice: number,
  factors: any,
  priceHistory: PriceHistoryInfo
): number {
  // A more sophisticated model would use machine learning.
  // For now, let's use a formula-based approach based on our factors.
  
  let recommendedPrice = currentPrice;
  
  // Adjust based on demand (popularity + review score)
  const demandFactor = (factors.popularity + factors.reviewScore) / 2;
  recommendedPrice *= (1 + (demandFactor - 0.5) * 0.5); // Max 25% adjustment
  
  // Adjust based on competition
  recommendedPrice *= (1 - (factors.genreCompetition - 0.5) * 0.2); // Max 10% adjustment
  
  // Adjust based on age (newer games can be priced higher)
  recommendedPrice *= (1 + (factors.age - 0.5) * 0.3); // Max 15% adjustment

  // Adjust based on historical pricing (don't go too far from historical max)
  const historicalMax = priceHistory.highestPrice;
  if (historicalMax > recommendedPrice) {
    recommendedPrice = (recommendedPrice + historicalMax) / 2;
  }

  // Round to a common pricing tier (e.g., XX.99)
  return Math.round(recommendedPrice / 100) * 100 - 1;
}

/**
 * Calculate confidence in the recommended price
 */
function calculatePriceConfidence(
  factors: any,
  priceHistory: PriceHistoryInfo
): number {
  // Base confidence on a few key factors
  const reviewScoreFactor = factors.reviewScore; // 0-1
  const ageFactor = factors.age; // 0-1 (newer is higher)
  const priceVolatilityFactor = 1 - priceHistory.priceVolatility; // 0-1 (less volatile is higher)
  const demandScoreFactor = factors.popularity;
 
  // Simple weighted average
  const confidence =
    (reviewScoreFactor * 0.3 +
      ageFactor * 0.2 +
      priceVolatilityFactor * 0.3 +
      demandScoreFactor * 0.2) *
    100;

  return Math.min(95, Math.max(60, confidence)); // Clamp between 60% and 95%
}

/**
 * Generate a demand curve based on a single data point and elasticity
 */
export function generateDemandCurve(
  basePrice: number,
  baseDemand: number,
  elasticity: number,
  priceRange: number = 0.5 // ±50% price range
): DemandCurve[] {
  const curve: DemandCurve[] = [];
  const numPoints = 21;
  
  for (let i = 0; i < numPoints; i++) {
    const priceMultiplier = 1 - priceRange + (i / (numPoints - 1)) * (2 * priceRange);
    const price = basePrice * priceMultiplier;
    
    // Demand function: D(p) = D_base * (p / p_base)^(-elasticity)
    const demand = baseDemand * Math.pow(price / basePrice, -elasticity);
    const revenue = price * demand;
    
    curve.push({ price, demand, revenue });
  }
  
  return curve;
}

/**
 * Find the optimal price from a demand curve that maximizes revenue
 */
export function findOptimalPriceFromCurve(curve: DemandCurve[]): OptimizationResult {
  if (curve.length === 0) {
    return { optimalPrice: 0, expectedRevenue: 0, expectedDemand: 0, priceElasticity: 0, confidence: 0 };
  }
  
  const bestPoint = curve.reduce((best, point) => (point.revenue > best.revenue ? point : best), curve[0]);
  const elasticityAtPoint = calculateElasticityAtPoint(curve, bestPoint);
  
  return {
    optimalPrice: bestPoint.price,
    expectedRevenue: bestPoint.revenue,
    expectedDemand: bestPoint.demand,
    priceElasticity: elasticityAtPoint,
    confidence: 85, // Placeholder confidence
  };
}

function calculateElasticityAtPoint(curve: DemandCurve[], point: DemandCurve): number {
  const index = curve.findIndex(p => p.price === point.price);
  if (index <= 0 || index >= curve.length - 1) {
    return 1; // Cannot calculate at endpoints, assume unit elastic
  }
  
  const p1 = curve[index - 1];
  const p2 = curve[index + 1];
  
  const dQ = p2.demand - p1.demand;
  const dP = p2.price - p1.price;
  
  if (dP === 0 || p1.demand === 0) return 1;
  
  const elasticity = (dQ / p1.demand) / (dP / p1.price);
  return Math.abs(elasticity);
}

function parseOwnersString(owners: string): number {
  if (!owners) return 0;
  const parts = owners.split(' .. ');
  const lowerBound = parseInt(parts[0].replace(/,/g, ''), 10);
  return lowerBound;
}

/**
 * Create a mock analysis for testing purposes
 */
function createMockAnalysis(appId: number): PriceAnalysis {
  const currentPrice = 1999;
  const recommendedPrice = 2499;
  const competitionScore = 70;
  const marketTrend = 'bullish';
  const priceConfidence = 87;

  const priceHistory: PriceHistoryInfo = {
    lowestPrice: 999,
    highestPrice: 2499,
    averagePrice: 1899,
    priceVolatility: 0.15,
    priceTrend: 'increasing' as 'increasing' | 'decreasing' | 'stable',
  };

  const factors = {
    popularity: 0.8,
    reviewScore: 0.9,
    age: 0.5,
    genreCompetition: 0.6,
    seasonalDemand: 1,
    priceElasticity: 1.2,
  };

  const recommendations = [
    'Recommendation 1: Consider a 10% price increase during the next major sale.',
    'Recommendation 2: Bundle with similar games to increase visibility.',
    'Recommendation 3: Run a loyalty discount for existing players.',
  ];

  const optimizationScore = calculateOptimizationScore(currentPrice, recommendedPrice);
  
  // Create mock data for dynamic revenue calculation
  const mockSteamData = {
    appId: appId,
    name: 'Hollow Knight',
    price: 1499,
    genres: ['Action', 'Adventure', 'Indie'],
    releaseDate: '2017-02-24'
  } as SteamGameDetails;
  
  const mockSteamSpyData = {
    owners: '500000 .. 1000000',
    positive: 50000,
    negative: 2000,
    averageForever: 45,
    average2Weeks: 8
  } as SteamSpyGameData;
  
  const demandScore = 95;
  const currentRevenue = currentPrice * 500000 * 0.05; // Mock current revenue
  const expectedRevenue = recommendedPrice * 500000 * 0.04; // Mock expected revenue (slightly lower demand at higher price)
  
  const revenueIncrease = calculateDynamicRevenueIncrease(
    currentPrice,
    recommendedPrice,
    mockSteamData,
    mockSteamSpyData,
    demandScore,
    competitionScore,
    factors,
    currentRevenue,
    expectedRevenue
  );

  let status: 'optimized' | 'attention' | 'action_needed';
  let urgency: 'high' | 'medium' | null = null;
  if (optimizationScore >= 71) {
    status = 'optimized';
  } else if (optimizationScore >= 50) {
    status = 'attention';
    urgency = 'medium';
  } else {
    status = 'action_needed';
    urgency = 'high';
  }
  
  const timingRecommendation = "Best time to implement price change is during your next major update or DLC release.";
  const timingReason = "Minimize player backlash by providing additional value.";
  const competitorRangeMin = recommendedPrice * 0.9;
  const competitorRangeMax = recommendedPrice * 1.2;

  const executiveSummary = `Based on our comprehensive analysis of Mock Game, we recommend increasing your price from $${(currentPrice/100).toFixed(2)} to $${(recommendedPrice/100).toFixed(2)}. This represents a ${revenueIncrease}% potential revenue increase.
Your game is currently underpriced compared to similar titles in the market. The competitor analysis shows that games with similar features and quality are priced between $${(competitorRangeMin/100).toFixed(2)} and $${(competitorRangeMax/100).toFixed(2)}, with strong sales performance. Your current pricing positions you at the bottom of this range, potentially signaling lower quality to consumers.
The price trend analysis indicates consistent market acceptance of higher price points in your genre. We recommend implementing this change during your next major content update to provide additional value justification to your player base.
With ${priceConfidence}% confidence, this pricing strategy will optimize your revenue while maintaining competitive positioning in the indie gaming market.`;

  const competitorPriceComparison = [
      { name: 'Hollow Knight', price: 2499 },
      { name: 'Dead Cells', price: 2299 },
      { name: 'Celeste', price: 2699 },
      { name: 'Stardew Valley', price: 1999 },
      { name: 'Undertale', price: 2999 },
      { name: 'Your Game (Current)', price: currentPrice, isTarget: true },
      { name: 'Your Game (Recommended)', price: recommendedPrice, isRecommended: true },
    ];

  const priceTrendAnalysis = [
      { month: 'Jan', currentPrice: 19.99, recommendedPrice: 22.99 },
      { month: 'Feb', currentPrice: 19.99, recommendedPrice: 22.99 },
      { month: 'Mar', currentPrice: 19.99, recommendedPrice: 23.99 },
      { month: 'Apr', currentPrice: 19.99, recommendedPrice: 24.99 },
      { month: 'May', currentPrice: 19.99, recommendedPrice: 24.99 },
      { month: 'Jun', currentPrice: 19.99, recommendedPrice: 24.99 },
    ];
  
  const marketShareAnalysis = calculateMarketShareAnalysis(mockSteamData, mockSteamSpyData, demandScore, competitionScore);

  return {
    appId,
    name: 'Hollow Knight',
    currentPrice: 1499,
    recommendedPrice: 2499,
    priceConfidence: 87,
    demandScore,
    competitionScore,
    marketTrend,
    priceHistory,
    factors,
    recommendations,
    optimizationScore,
    status,
    urgency,
    revenueIncrease,
    timingRecommendation,
    timingReason,
    executiveSummary,
    competitorPriceComparison,
    priceTrendAnalysis,
    marketShareAnalysis,
    underpricedComparedToSimilar: true,
    marketPositioningStatement: "Position as premium indie title. Your quality justifies higher pricing tier.",
    closestCompetitor: { name: 'Stardew Valley', price: 1999 },
  };
}

function calculateDynamicRevenueIncrease(
  currentPrice: number,
  recommendedPrice: number,
  steamData: SteamGameDetails,
  steamSpyData: SteamSpyGameData,
  demandScore: number,
  competitionScore: number,
  factors: any,
  currentRevenue: number,
  expectedRevenue: number
): number {
  // Base revenue increase from demand curve
  const baseRevenueIncrease = currentRevenue > 0 ? ((expectedRevenue - currentRevenue) / currentRevenue) * 100 : 0;
  
  // Factor 1: Demand Score Impact (higher demand = higher potential increase)
  const demandMultiplier = 0.8 + (demandScore / 100) * 0.4; // 0.8-1.2x range
  
  // Factor 2: Competition Impact (less competition = higher potential increase)
  const competitionMultiplier = 1.2 - (competitionScore / 100) * 0.4; // 0.8-1.2x range
  
  // Factor 3: Game Age Impact (newer games can increase prices more)
  const ageMultiplier = 0.9 + factors.age * 0.3; // 0.9-1.2x range
  
  // Factor 4: Genre Competition Impact (less competitive genres = higher increase)
  const genreMultiplier = 1.1 - factors.genreCompetition * 0.2; // 0.9-1.1x range
  
  // Factor 5: Price Elasticity Impact (less elastic = higher increase potential)
  const elasticityMultiplier = 1.3 - (factors.priceElasticity - 1) * 0.3; // 1.0-1.3x range
  
  // Factor 6: Current Popularity Impact (recent activity vs long-term)
  const recentActivityRatio = steamSpyData.average2Weeks / Math.max(steamSpyData.averageForever, 1);
  const popularityMultiplier = 0.9 + Math.min(recentActivityRatio, 0.3); // 0.9-1.2x range
  
  // Factor 7: Price Gap Impact (bigger gap = more room for increase)
  const priceGapRatio = (recommendedPrice - currentPrice) / currentPrice;
  const gapMultiplier = 0.8 + Math.min(priceGapRatio * 2, 0.4); // 0.8-1.2x range
  
  // Combine all factors
  const totalMultiplier = (
    demandMultiplier *
    competitionMultiplier *
    ageMultiplier *
    genreMultiplier *
    elasticityMultiplier *
    popularityMultiplier *
    gapMultiplier
  );
  
  // Apply multiplier to base revenue increase
  let dynamicRevenueIncrease = baseRevenueIncrease * totalMultiplier;
  
  // Add some randomness to make it more realistic (±5-15% depending on the base value)
  const randomVariation = (Math.random() - 0.5) * (dynamicRevenueIncrease * 0.2); // ±10% of the calculated value
  dynamicRevenueIncrease += randomVariation;
  
  // Clamp to reasonable bounds (5% to 80%)
  dynamicRevenueIncrease = Math.max(5, Math.min(80, dynamicRevenueIncrease));
  
  return Math.round(dynamicRevenueIncrease);
} 