import { Request, Response } from 'express';
import { steamApiService } from '../services/steamApi';
import SteamSpyApiService from '../services/steamSpyApi';
import { SteamSpyGameAnalysis, SteamSpyPriceAnalysis, SteamSpyPlayerAnalysis, SteamSpyMarketAnalysis, SteamSpyReviewAnalysis, SteamSpyTag } from '../types/steamSpy';

/**
 * Game Controller for PriceValve
 * Handles game analysis and price optimization logic
 */
class GameController {
  /**
   * Analyze a game and provide price optimization recommendations
   * GET /api/analyze/:appId
   */
  async analyzeGame(req: Request, res: Response): Promise<void> {
    const appId = parseInt(req.params.appId);
    
    if (isNaN(appId) || appId <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid app ID. Please provide a valid Steam app ID.'
      });
      return;
    }

    console.log(`🔍 Starting analysis for app ID: ${appId}`);

    try {
      // Fetch data from both APIs concurrently
      const [steamResult, steamSpyResult] = await Promise.allSettled([
        steamApiService.getAppDetails(appId),
        SteamSpyApiService.getAppDetails(appId)
      ]);

      // Handle Steam API response
      if (steamResult.status === 'rejected') {
        console.error('Steam API error:', steamResult.reason);
      }

      // Handle SteamSpy API response
      if (steamSpyResult.status === 'rejected') {
        console.error('SteamSpy API error:', steamSpyResult.reason);
      }

      const steamData = steamResult.status === 'fulfilled' ? steamResult.value : null;
      const steamSpyData = steamSpyResult.status === 'fulfilled' ? steamSpyResult.value : null;

      // Check if we have at least one data source
      if (!steamData?.success && !steamSpyData?.success) {
        res.status(404).json({
          success: false,
          error: 'Game not found in Steam or SteamSpy databases',
          appId: appId
        });
        return;
      }

      // Perform comprehensive analysis
      const analysis = await this.performGameAnalysis(appId, steamData, steamSpyData);

      console.log(`✅ Analysis completed for ${analysis.name} (${appId})`);

      res.json({
        success: true,
        data: analysis,
        metadata: {
          appId: appId,
          analyzedAt: new Date().toISOString(),
          dataSources: {
            steam: steamData?.success || false,
            steamSpy: steamSpyData?.success || false
          }
        }
      });

    } catch (error: any) {
      console.error('Error in game analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error during game analysis',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Perform comprehensive game analysis using available data
   */
  private async performGameAnalysis(
    appId: number,
    steamData: any,
    steamSpyData: any
  ): Promise<SteamSpyGameAnalysis> {
    // Extract basic game information
    const name = steamData?.data?.name || steamSpyData?.data?.name || 'Unknown Game';
    const developer = steamData?.data?.developers?.[0] || steamSpyData?.data?.developer || 'Unknown';
    const publisher = steamData?.data?.publishers?.[0] || steamSpyData?.data?.publisher || 'Unknown';

    // Analyze price data
    const priceAnalysis = this.analyzePrice(steamData, steamSpyData);

    // Analyze player data
    const playerAnalysis = this.analyzePlayers(steamData, steamSpyData);

    // Analyze market data
    const marketAnalysis = this.analyzeMarket(steamSpyData);

    // Analyze review data
    const reviewAnalysis = this.analyzeReviews(steamData, steamSpyData);

    // Extract tags and genres
    const tags = this.extractTags(steamData, steamSpyData);
    const genres = this.extractGenres(steamData, steamSpyData);
    const languages = steamData?.data?.supported_languages?.split(',') || [];

    // Calculate overall score
    const overallScore = this.calculateOverallScore(priceAnalysis, playerAnalysis, marketAnalysis, reviewAnalysis);

    // Generate recommendations
    const recommendations = this.generateRecommendations(priceAnalysis, playerAnalysis, marketAnalysis, reviewAnalysis);

    // Calculate optimal pricing
    const optimalPricing = this.calculateOptimalPricing(priceAnalysis, playerAnalysis, marketAnalysis, reviewAnalysis);

    return {
      appId,
      name,
      developer,
      publisher,
      price: priceAnalysis,
      players: playerAnalysis,
      market: marketAnalysis,
      reviews: reviewAnalysis,
      tags,
      genres,
      languages,
      overallScore,
      recommendations,
      optimalPricing
    };
  }

  /**
   * Analyze price-related data
   */
  private analyzePrice(steamData: any, steamSpyData: any): SteamSpyPriceAnalysis {
    const currentPrice = steamData?.data?.price_overview?.final || steamSpyData?.data?.price || 0;
    const initialPrice = steamData?.data?.price_overview?.initial || steamSpyData?.data?.initialprice || currentPrice;
    const discount = steamData?.data?.price_overview?.discount_percent || steamSpyData?.data?.discount || 0;

    // Determine price range
    let priceRange = 'Unknown';
    let priceCategory: SteamSpyPriceAnalysis['priceCategory'] = 'Mid-Range';
    
    if (currentPrice === 0) {
      priceRange = 'Free';
      priceCategory = 'Free';
    } else if (currentPrice < 1000) { // Less than $10
      priceRange = '$0 - $10';
      priceCategory = 'Budget';
    } else if (currentPrice < 3000) { // $10 - $30
      priceRange = '$10 - $30';
      priceCategory = 'Mid-Range';
    } else if (currentPrice < 6000) { // $30 - $60
      priceRange = '$30 - $60';
      priceCategory = 'Premium';
    } else {
      priceRange = '$60+';
      priceCategory = 'AAA';
    }

    // Calculate price per hour (if we have playtime data)
    const avgPlaytime = steamSpyData?.data?.average_forever || 0;
    const pricePerHour = avgPlaytime > 0 ? (currentPrice / 100) / (avgPlaytime / 60) : 0;

    // Calculate value score (lower price per hour = better value)
    const valueScore = Math.max(0, Math.min(100, 100 - (pricePerHour * 10)));

    return {
      currentPrice,
      initialPrice,
      discount,
      priceRange,
      priceCategory,
      pricePerHour,
      valueScore
    };
  }

  /**
   * Analyze player engagement data
   */
  private analyzePlayers(steamData: any, steamSpyData: any): SteamSpyPlayerAnalysis {
    const averageForever = steamSpyData?.data?.average_forever || 0;
    const average2Weeks = steamSpyData?.data?.average_2weeks || 0;
    const medianForever = steamSpyData?.data?.median_forever || 0;
    const median2Weeks = steamSpyData?.data?.median_2weeks || 0;
    const currentPlayers = steamSpyData?.data?.ccu || 0;

    // Determine player engagement level
    let playerEngagement: SteamSpyPlayerAnalysis['playerEngagement'] = 'Low';
    if (currentPlayers > 10000) playerEngagement = 'Very High';
    else if (currentPlayers > 1000) playerEngagement = 'High';
    else if (currentPlayers > 100) playerEngagement = 'Medium';

    // Calculate retention score based on recent vs total playtime
    const retentionScore = average2Weeks > 0 && averageForever > 0 
      ? Math.min(100, (average2Weeks / averageForever) * 100)
      : 0;

    return {
      averageForever,
      average2Weeks,
      medianForever,
      median2Weeks,
      currentPlayers,
      playerEngagement,
      retentionScore
    };
  }

  /**
   * Analyze market position data
   */
  private analyzeMarket(steamSpyData: any): SteamSpyMarketAnalysis {
    const owners = steamSpyData?.data?.owners || '0 .. 20,000';
    
    // Parse ownership range
    const ownershipMatch = owners.match(/(\d+)\s*\.\.\s*(\d+)/);
    const min = ownershipMatch ? parseInt(ownershipMatch[1]) : 0;
    const max = ownershipMatch ? parseInt(ownershipMatch[2]) : 0;
    const average = (min + max) / 2;

    // Determine market position
    let marketPosition: SteamSpyMarketAnalysis['marketPosition'] = 'Niche';
    if (average > 1000000) marketPosition = 'Viral';
    else if (average > 100000) marketPosition = 'Blockbuster';
    else if (average > 10000) marketPosition = 'Popular';

    // Calculate market score
    const marketScore = Math.min(100, Math.log10(average + 1) * 10);

    return {
      owners,
      ownershipRange: { min, max, average },
      marketPosition,
      marketScore
    };
  }

  /**
   * Analyze review data
   */
  private analyzeReviews(steamData: any, steamSpyData: any): SteamSpyReviewAnalysis {
    const scoreRank = steamSpyData?.data?.score_rank || 'Unknown';
    
    // Convert score rank to numeric score
    let reviewScore = 50; // Default neutral score
    let reviewCategory: SteamSpyReviewAnalysis['reviewCategory'] = 'Mixed';
    
    if (scoreRank.includes('Overwhelmingly Positive')) {
      reviewScore = 95;
      reviewCategory = 'Overwhelmingly Positive';
    } else if (scoreRank.includes('Very Positive')) {
      reviewScore = 85;
      reviewCategory = 'Very Positive';
    } else if (scoreRank.includes('Positive')) {
      reviewScore = 75;
      reviewCategory = 'Positive';
    } else if (scoreRank.includes('Mixed')) {
      reviewScore = 50;
      reviewCategory = 'Mixed';
    } else if (scoreRank.includes('Negative')) {
      reviewScore = 25;
      reviewCategory = 'Negative';
    } else if (scoreRank.includes('Very Negative')) {
      reviewScore = 15;
      reviewCategory = 'Very Negative';
    } else if (scoreRank.includes('Overwhelmingly Negative')) {
      reviewScore = 5;
      reviewCategory = 'Overwhelmingly Negative';
    }

    // Quality score is the same as review score
    const qualityScore = reviewScore;

    return {
      scoreRank,
      reviewScore,
      reviewCategory,
      qualityScore
    };
  }

  /**
   * Extract and format tags
   */
  private extractTags(steamData: any, steamSpyData: any): SteamSpyTag[] {
    const tags: SteamSpyTag[] = [];
    
    // Add SteamSpy tags
    if (steamSpyData?.data?.tags) {
      Object.entries(steamSpyData.data.tags).forEach(([name, votes]) => {
        tags.push({ name, votes: votes as number });
      });
    }

    // Sort by votes descending
    return tags.sort((a, b) => b.votes - a.votes).slice(0, 10);
  }

  /**
   * Extract genres
   */
  private extractGenres(steamData: any, steamSpyData: any): string[] {
    const genres: string[] = [];
    
    // Add Steam genres
    if (steamData?.data?.genres) {
      steamData.data.genres.forEach((genre: any) => {
        genres.push(genre.description);
      });
    }

    // Add SteamSpy genre
    if (steamSpyData?.data?.genre) {
      genres.push(steamSpyData.data.genre);
    }

    // Remove duplicates
    return [...new Set(genres)];
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(
    price: SteamSpyPriceAnalysis,
    players: SteamSpyPlayerAnalysis,
    market: SteamSpyMarketAnalysis,
    reviews: SteamSpyReviewAnalysis
  ): number {
    const priceWeight = 0.25;
    const playerWeight = 0.25;
    const marketWeight = 0.25;
    const reviewWeight = 0.25;

    const score = (
      price.valueScore * priceWeight +
      players.retentionScore * playerWeight +
      market.marketScore * marketWeight +
      reviews.qualityScore * reviewWeight
    );

    return Math.round(score);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    price: SteamSpyPriceAnalysis,
    players: SteamSpyPlayerAnalysis,
    market: SteamSpyMarketAnalysis,
    reviews: SteamSpyReviewAnalysis
  ): string[] {
    const recommendations: string[] = [];

    // Price-based recommendations
    if (price.discount > 50) {
      recommendations.push('Consider maintaining current discount as it appears to be driving sales');
    } else if (price.discount === 0 && price.currentPrice > 2000) {
      recommendations.push('Consider offering a discount to increase visibility and sales');
    }

    if (price.pricePerHour > 2) {
      recommendations.push('Game may be overpriced relative to playtime - consider price reduction');
    } else if (price.pricePerHour < 0.5) {
      recommendations.push('Excellent value proposition - consider premium pricing strategy');
    }

    // Player engagement recommendations
    if (players.playerEngagement === 'Low' && players.currentPlayers < 100) {
      recommendations.push('Low player engagement - focus on community building and content updates');
    }

    if (players.retentionScore < 30) {
      recommendations.push('Low retention - consider improving early game experience');
    }

    // Market position recommendations
    if (market.marketPosition === 'Niche') {
      recommendations.push('Niche market position - consider targeted marketing to specific audiences');
    }

    // Review-based recommendations
    if (reviews.reviewScore < 50) {
      recommendations.push('Poor reviews - prioritize bug fixes and quality improvements');
    }

    return recommendations;
  }

  /**
   * Calculate optimal pricing recommendations
   */
  private calculateOptimalPricing(
    price: SteamSpyPriceAnalysis,
    players: SteamSpyPlayerAnalysis,
    market: SteamSpyMarketAnalysis,
    reviews: SteamSpyReviewAnalysis
  ): { suggestedPrice: number; confidence: number; reasoning: string[] } {
    const reasoning: string[] = [];
    let suggestedPrice = price.currentPrice;
    let confidence = 50; // Base confidence

    // Factor in review quality
    if (reviews.reviewScore > 80) {
      suggestedPrice = Math.round(suggestedPrice * 1.1); // 10% premium for high quality
      reasoning.push('High review scores support premium pricing');
      confidence += 10;
    } else if (reviews.reviewScore < 50) {
      suggestedPrice = Math.round(suggestedPrice * 0.9); // 10% discount for poor reviews
      reasoning.push('Lower review scores suggest price reduction needed');
      confidence -= 10;
    }

    // Factor in player engagement
    if (players.playerEngagement === 'Very High') {
      suggestedPrice = Math.round(suggestedPrice * 1.05); // 5% premium for high engagement
      reasoning.push('High player engagement indicates strong demand');
      confidence += 5;
    } else if (players.playerEngagement === 'Low') {
      suggestedPrice = Math.round(suggestedPrice * 0.95); // 5% discount for low engagement
      reasoning.push('Low player engagement suggests price sensitivity');
      confidence -= 5;
    }

    // Factor in market position
    if (market.marketPosition === 'Viral') {
      suggestedPrice = Math.round(suggestedPrice * 1.15); // 15% premium for viral games
      reasoning.push('Viral market position supports premium pricing');
      confidence += 15;
    } else if (market.marketPosition === 'Niche') {
      suggestedPrice = Math.round(suggestedPrice * 0.9); // 10% discount for niche games
      reasoning.push('Niche market position requires competitive pricing');
      confidence -= 10;
    }

    // Factor in value proposition
    if (price.pricePerHour < 0.5) {
      suggestedPrice = Math.round(suggestedPrice * 1.1); // 10% premium for excellent value
      reasoning.push('Excellent value proposition supports higher pricing');
      confidence += 10;
    } else if (price.pricePerHour > 2) {
      suggestedPrice = Math.round(suggestedPrice * 0.85); // 15% discount for poor value
      reasoning.push('Poor value proposition requires price reduction');
      confidence -= 15;
    }

    // Ensure price is reasonable
    suggestedPrice = Math.max(0, suggestedPrice);
    confidence = Math.max(0, Math.min(100, confidence));

    return {
      suggestedPrice,
      confidence,
      reasoning
    };
  }
}

export default new GameController(); 