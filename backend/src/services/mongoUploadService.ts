import { Game } from '../types/game';
import GameModel, { IGame } from '../models/Game';
import { connectDatabase } from '../config/database';

/**
 * MongoDB Upload Service for PriceValve
 * Handles uploading and updating game data in MongoDB
 */

export interface UploadResult {
  success: boolean;
  gameId?: string;
  error?: string;
  isNew?: boolean;
  timestamp: Date;
}

export interface BatchUploadResult {
  success: boolean;
  results: UploadResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    newGames: number;
    updatedGames: number;
  };
  timestamp: Date;
}

class MongoUploadService {
  private isConnected: boolean = false;

  /**
   * Ensure database connection
   */
  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      await connectDatabase();
      this.isConnected = true;
    }
  }

  /**
   * Upload a single game to MongoDB
   */
  async uploadGame(gameData: Game): Promise<UploadResult> {
    try {
      await this.ensureConnection();

      console.log(`Uploading game data for ${gameData.name} (${gameData.appId})`);

      // Check if game already exists
      const existingGame = await GameModel.findOne({ appId: gameData.appId });

      if (existingGame) {
        // Update existing game
        const updatedGame = await this.updateExistingGame(existingGame, gameData);
        return {
          success: true,
          gameId: updatedGame._id.toString(),
          isNew: false,
          timestamp: new Date()
        };
      } else {
        // Create new game
        const newGame = await this.createNewGame(gameData);
        return {
          success: true,
          gameId: newGame._id.toString(),
          isNew: true,
          timestamp: new Date()
        };
      }
    } catch (error: any) {
      console.error(`Error uploading game ${gameData.appId}:`, error);
      return {
        success: false,
        error: `Failed to upload game: ${error.message}`,
        timestamp: new Date()
      };
    }
  }

  /**
   * Update an existing game in the database
   */
  private async updateExistingGame(existingGame: IGame, gameData: Game): Promise<IGame> {
    // Update basic information
    existingGame.name = gameData.name;
    existingGame.developer = gameData.developer;
    existingGame.publisher = gameData.publisher;

    // Update SteamSpy data
    if (!existingGame.steamSpyData) {
      existingGame.steamSpyData = {};
    }
    
    existingGame.steamSpyData.appId = gameData.appId;
    existingGame.steamSpyData.name = gameData.name;
    existingGame.steamSpyData.developer = gameData.developer;
    existingGame.steamSpyData.publisher = gameData.publisher;
    existingGame.steamSpyData.owners = gameData.owners;
    existingGame.steamSpyData.averageForever = gameData.averagePlaytime;
    existingGame.steamSpyData.price = gameData.price;
    existingGame.steamSpyData.discount = gameData.discountPercent || 0;
    existingGame.steamSpyData.lastUpdated = new Date();

    // Update tags and genres
    if (gameData.tags && gameData.tags.length > 0) {
      existingGame.tags = gameData.tags.map(tag => ({ name: tag, votes: 1 }));
      existingGame.genres = gameData.tags.filter(tag => 
        ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Indie', 'Casual'].includes(tag)
      );
    }

    // Update review analysis if available
    if (gameData.reviewScore !== undefined) {
      if (!existingGame.reviewAnalysis) {
        existingGame.reviewAnalysis = {};
      }
      
      existingGame.reviewAnalysis.reviewScore = gameData.reviewScore;
      existingGame.reviewAnalysis.reviewCategory = this.getReviewCategory(gameData.reviewScore);
      existingGame.reviewAnalysis.qualityScore = gameData.reviewScore;
      
      if (gameData.reviewScoreDesc) {
        existingGame.reviewAnalysis.scoreRank = gameData.reviewScoreDesc;
      }
    }

    // Update market analysis
    if (gameData.owners) {
      if (!existingGame.marketAnalysis) {
        existingGame.marketAnalysis = {};
      }
      
      existingGame.marketAnalysis.owners = gameData.owners;
      const ownershipRange = this.parseOwnershipRange(gameData.owners);
      existingGame.marketAnalysis.ownershipRange = ownershipRange;
      existingGame.marketAnalysis.marketPosition = this.getMarketPosition(ownershipRange.average);
    }

    // Update price analysis
    if (!existingGame.priceAnalysis) {
      existingGame.priceAnalysis = {};
    }
    
    existingGame.priceAnalysis.currentPrice = gameData.price;
    existingGame.priceAnalysis.discount = gameData.discountPercent || 0;
    existingGame.priceAnalysis.priceCategory = this.getPriceCategory(gameData.price);
    existingGame.priceAnalysis.valueScore = this.calculateValueScore(gameData);

    // Update player analysis
    if (gameData.averagePlaytime) {
      if (!existingGame.playerAnalysis) {
        existingGame.playerAnalysis = {};
      }
      
      existingGame.playerAnalysis.averageForever = gameData.averagePlaytime;
      existingGame.playerAnalysis.playerEngagement = this.getPlayerEngagement(gameData.averagePlaytime);
      existingGame.playerAnalysis.retentionScore = this.calculateRetentionScore(gameData.averagePlaytime);
    }

    // Update data sources
    existingGame.dataSources.steamSpy = true;
    if (gameData.reviewScore !== undefined) {
      existingGame.dataSources.steamReview = true;
    }

    // Update analysis metadata
    existingGame.lastAnalyzed = new Date();
    existingGame.analysisCount = (existingGame.analysisCount || 0) + 1;
    existingGame.isActive = true;

    // Clear any previous errors
    if (existingGame.lastError) {
      existingGame.lastError = {};
    }

    return await existingGame.save();
  }

  /**
   * Create a new game in the database
   */
  private async createNewGame(gameData: Game): Promise<IGame> {
    const newGame = new GameModel({
      appId: gameData.appId,
      name: gameData.name,
      developer: gameData.developer,
      publisher: gameData.publisher,
      
      // SteamSpy data
      steamSpyData: {
        appId: gameData.appId,
        name: gameData.name,
        developer: gameData.developer,
        publisher: gameData.publisher,
        owners: gameData.owners,
        averageForever: gameData.averagePlaytime,
        price: gameData.price,
        discount: gameData.discountPercent || 0,
        lastUpdated: new Date()
      },

      // Tags and genres
      tags: gameData.tags?.map(tag => ({ name: tag, votes: 1 })) || [],
      genres: gameData.tags?.filter(tag => 
        ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Indie', 'Casual'].includes(tag)
      ) || [],

      // Review analysis
      reviewAnalysis: gameData.reviewScore !== undefined ? {
        reviewScore: gameData.reviewScore,
        reviewCategory: this.getReviewCategory(gameData.reviewScore),
        qualityScore: gameData.reviewScore,
        scoreRank: gameData.reviewScoreDesc || 'Unknown'
      } : undefined,

      // Market analysis
      marketAnalysis: gameData.owners ? {
        owners: gameData.owners,
        ownershipRange: this.parseOwnershipRange(gameData.owners),
        marketPosition: this.getMarketPosition(this.parseOwnershipRange(gameData.owners).average)
      } : undefined,

      // Price analysis
      priceAnalysis: {
        currentPrice: gameData.price,
        discount: gameData.discountPercent || 0,
        priceCategory: this.getPriceCategory(gameData.price),
        valueScore: this.calculateValueScore(gameData)
      },

      // Player analysis
      playerAnalysis: gameData.averagePlaytime ? {
        averageForever: gameData.averagePlaytime,
        playerEngagement: this.getPlayerEngagement(gameData.averagePlaytime),
        retentionScore: this.calculateRetentionScore(gameData.averagePlaytime)
      } : undefined,

      // Data sources
      dataSources: {
        steam: false,
        steamSpy: true,
        steamReview: gameData.reviewScore !== undefined
      },

      // Analysis metadata
      lastAnalyzed: new Date(),
      analysisCount: 1,
      isActive: true
    });

    return await newGame.save();
  }

  /**
   * Upload multiple games in batch
   */
  async uploadGames(games: Game[]): Promise<BatchUploadResult> {
    const results: UploadResult[] = [];
    let successful = 0;
    let failed = 0;
    let newGames = 0;
    let updatedGames = 0;

    console.log(`Starting batch upload of ${games.length} games`);

    for (const game of games) {
      try {
        const result = await this.uploadGame(game);
        results.push(result);
        
        if (result.success) {
          successful++;
          if (result.isNew) {
            newGames++;
          } else {
            updatedGames++;
          }
        } else {
          failed++;
        }

        // Add a small delay between uploads to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error in batch upload for game ${game.appId}:`, error);
        results.push({
          success: false,
          error: `Batch upload error: ${error}`,
          timestamp: new Date()
        });
        failed++;
      }
    }

    const summary = {
      total: games.length,
      successful,
      failed,
      newGames,
      updatedGames
    };

    console.log(`Batch upload completed:`, summary);

    return {
      success: failed === 0,
      results,
      summary,
      timestamp: new Date()
    };
  }

  /**
   * Get review category based on score
   */
  private getReviewCategory(score: number): string {
    if (score >= 95) return 'Overwhelmingly Positive';
    if (score >= 85) return 'Very Positive';
    if (score >= 75) return 'Positive';
    if (score >= 50) return 'Mixed';
    if (score >= 25) return 'Negative';
    if (score >= 15) return 'Very Negative';
    return 'Overwhelmingly Negative';
  }

  /**
   * Parse ownership range from SteamSpy format
   */
  private parseOwnershipRange(ownersString: string): { min: number; max: number; average: number } {
    try {
      const match = ownersString.match(/(\d+(?:,\d+)*)\s*\.\.\s*(\d+(?:,\d+)*)/);
      if (match) {
        const min = parseInt(match[1].replace(/,/g, ''));
        const max = parseInt(match[2].replace(/,/g, ''));
        return { min, max, average: Math.round((min + max) / 2) };
      }
      
      const singleMatch = ownersString.match(/(\d+(?:,\d+)*)/);
      if (singleMatch) {
        const value = parseInt(singleMatch[1].replace(/,/g, ''));
        return { min: value, max: value, average: value };
      }
      
      return { min: 0, max: 0, average: 0 };
    } catch (error) {
      return { min: 0, max: 0, average: 0 };
    }
  }

  /**
   * Get market position based on ownership
   */
  private getMarketPosition(averageOwners: number): string {
    if (averageOwners >= 10000000) return 'Viral';
    if (averageOwners >= 1000000) return 'Blockbuster';
    if (averageOwners >= 100000) return 'Popular';
    return 'Niche';
  }

  /**
   * Get price category based on price
   */
  private getPriceCategory(price: number): string {
    if (price === 0) return 'Free';
    if (price < 10) return 'Budget';
    if (price < 30) return 'Mid-Range';
    if (price < 60) return 'Premium';
    return 'AAA';
  }

  /**
   * Get player engagement level based on playtime
   */
  private getPlayerEngagement(averagePlaytime: number): string {
    if (averagePlaytime >= 1000) return 'Very High';
    if (averagePlaytime >= 500) return 'High';
    if (averagePlaytime >= 100) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate value score based on price and playtime
   */
  private calculateValueScore(gameData: Game): number {
    if (gameData.price === 0) return 100;
    if (!gameData.averagePlaytime || gameData.averagePlaytime === 0) return 50;
    
    const hoursPerDollar = gameData.averagePlaytime / 60 / gameData.price; // Convert minutes to hours
    const baseScore = Math.min(hoursPerDollar * 10, 100); // Cap at 100
    
    // Adjust based on review score
    if (gameData.reviewScore) {
      const reviewAdjustment = (gameData.reviewScore - 50) * 0.2;
      return Math.max(0, Math.min(100, baseScore + reviewAdjustment));
    }
    
    return Math.max(0, Math.min(100, baseScore));
  }

  /**
   * Calculate retention score based on playtime
   */
  private calculateRetentionScore(averagePlaytime: number): number {
    if (averagePlaytime >= 1000) return 100;
    if (averagePlaytime >= 500) return 85;
    if (averagePlaytime >= 100) return 70;
    if (averagePlaytime >= 50) return 50;
    if (averagePlaytime >= 10) return 30;
    return 10;
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(): Promise<{
    totalGames: number;
    activeGames: number;
    lastUpload: Date | null;
    averageAnalysisCount: number;
  }> {
    await this.ensureConnection();

    const totalGames = await GameModel.countDocuments();
    const activeGames = await GameModel.countDocuments({ isActive: true });
    const lastUpload = await GameModel.findOne().sort({ lastAnalyzed: -1 }).select('lastAnalyzed');
    const avgAnalysisCount = await GameModel.aggregate([
      { $group: { _id: null, avgCount: { $avg: '$analysisCount' } } }
    ]);

    return {
      totalGames,
      activeGames,
      lastUpload: lastUpload?.lastAnalyzed || null,
      averageAnalysisCount: avgAnalysisCount[0]?.avgCount || 0
    };
  }
}

export default new MongoUploadService(); 