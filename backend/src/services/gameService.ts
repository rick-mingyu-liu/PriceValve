import Game, { IGame } from '../models/Game';
import { SteamSpyGameAnalysis } from '../types/steamSpy';

/**
 * Game Service for PriceValve
 * Handles database operations for game data
 */
class GameService {
  /**
   * Save or update game data in the database
   */
  async saveGameData(appId: number, analysis: SteamSpyGameAnalysis, steamData?: any, steamSpyData?: any): Promise<IGame> {
    try {
      // Check if game already exists
      let game = await Game.findOne({ appId });

      if (game) {
        // Update existing game
        console.log(`🔄 Updating existing game: ${analysis.name} (${appId})`);
        
        // Update basic info
        game.name = analysis.name;
        game.developer = analysis.developer;
        game.publisher = analysis.publisher;

        // Update raw API data
        if (steamData) {
          game.steamData = this.transformSteamData(steamData);
          game.dataSources.steam = true;
        }
        if (steamSpyData) {
          game.steamSpyData = this.transformSteamSpyData(steamSpyData);
          game.dataSources.steamSpy = true;
        }

        // Update analysis data
        game.updateAnalysis(analysis);

        // Clear any previous errors
        game.lastError = undefined;

      } else {
        // Create new game
        console.log(`🆕 Creating new game: ${analysis.name} (${appId})`);
        
        game = new Game({
          appId: analysis.appId,
          name: analysis.name,
          developer: analysis.developer,
          publisher: analysis.publisher,
          steamData: steamData ? this.transformSteamData(steamData) : undefined,
          steamSpyData: steamSpyData ? this.transformSteamSpyData(steamSpyData) : undefined,
          priceAnalysis: analysis.price,
          playerAnalysis: analysis.players,
          marketAnalysis: analysis.market,
          reviewAnalysis: analysis.reviews,
          tags: analysis.tags,
          genres: analysis.genres,
          languages: analysis.languages,
          overallScore: analysis.overallScore,
          recommendations: analysis.recommendations,
          optimalPricing: analysis.optimalPricing,
          dataSources: {
            steam: !!steamData,
            steamSpy: !!steamSpyData
          }
        });
      }

      await game.save();
      console.log(`✅ Game data saved: ${game.name} (${game.appId})`);
      
      return game;
    } catch (error: any) {
      console.error('❌ Error saving game data:', error);
      throw new Error(`Failed to save game data: ${error.message}`);
    }
  }

  /**
   * Get game by app ID
   */
  async getGameByAppId(appId: number): Promise<IGame | null> {
    try {
      const game = await Game.findOne({ appId, isActive: true });
      return game;
    } catch (error: any) {
      console.error('❌ Error fetching game:', error);
      throw new Error(`Failed to fetch game: ${error.message}`);
    }
  }

  /**
   * Get games by criteria
   */
  async getGamesByCriteria(criteria: any, limit: number = 20, skip: number = 0): Promise<{ games: IGame[]; total: number }> {
    try {
      const query: any = { isActive: true };
      
      // Price range filter
      if (criteria.priceRange) {
        query['priceAnalysis.priceRange'] = criteria.priceRange;
      }
      
      // Genre filter
      if (criteria.genre) {
        query.genres = { $in: [criteria.genre] };
      }
      
      // Score filter
      if (criteria.minScore) {
        query.overallScore = { $gte: criteria.minScore };
      }
      
      // Price filter
      if (criteria.maxPrice) {
        query['priceAnalysis.currentPrice'] = { $lte: criteria.maxPrice * 100 };
      }
      
      // Player engagement filter
      if (criteria.playerEngagement) {
        query['playerAnalysis.playerEngagement'] = criteria.playerEngagement;
      }
      
      // Market position filter
      if (criteria.marketPosition) {
        query['marketAnalysis.marketPosition'] = criteria.marketPosition;
      }
      
      // Review category filter
      if (criteria.reviewCategory) {
        query['reviewAnalysis.reviewCategory'] = criteria.reviewCategory;
      }

      // Text search
      if (criteria.search) {
        query.$text = { $search: criteria.search };
      }

      const [games, total] = await Promise.all([
        Game.find(query)
          .sort({ overallScore: -1, lastAnalyzed: -1 })
          .limit(limit)
          .skip(skip)
          .lean(),
        Game.countDocuments(query)
      ]);

      return { games, total };
    } catch (error: any) {
      console.error('❌ Error fetching games by criteria:', error);
      throw new Error(`Failed to fetch games: ${error.message}`);
    }
  }

  /**
   * Get top games by score
   */
  async getTopGames(limit: number = 10): Promise<IGame[]> {
    try {
      const games = await Game.find({ isActive: true })
        .sort({ overallScore: -1 })
        .limit(limit)
        .lean();
      
      return games;
    } catch (error: any) {
      console.error('❌ Error fetching top games:', error);
      throw new Error(`Failed to fetch top games: ${error.message}`);
    }
  }

  /**
   * Get games by genre
   */
  async getGamesByGenre(genre: string, limit: number = 20): Promise<IGame[]> {
    try {
      const games = await Game.find({ 
        isActive: true, 
        genres: { $in: [genre] } 
      })
        .sort({ overallScore: -1 })
        .limit(limit)
        .lean();
      
      return games;
    } catch (error: any) {
      console.error('❌ Error fetching games by genre:', error);
      throw new Error(`Failed to fetch games by genre: ${error.message}`);
    }
  }

  /**
   * Get games with best value (lowest price per hour)
   */
  async getBestValueGames(limit: number = 10): Promise<IGame[]> {
    try {
      const games = await Game.find({ 
        isActive: true,
        'priceAnalysis.pricePerHour': { $gt: 0 }
      })
        .sort({ 'priceAnalysis.pricePerHour': 1 })
        .limit(limit)
        .lean();
      
      return games;
    } catch (error: any) {
      console.error('❌ Error fetching best value games:', error);
      throw new Error(`Failed to fetch best value games: ${error.message}`);
    }
  }

  /**
   * Get games with highest player engagement
   */
  async getMostEngagedGames(limit: number = 10): Promise<IGame[]> {
    try {
      const games = await Game.find({ isActive: true })
        .sort({ 'playerAnalysis.currentPlayers': -1 })
        .limit(limit)
        .lean();
      
      return games;
    } catch (error: any) {
      console.error('❌ Error fetching most engaged games:', error);
      throw new Error(`Failed to fetch most engaged games: ${error.message}`);
    }
  }

  /**
   * Update game error status
   */
  async updateGameError(appId: number, source: 'steam' | 'steamSpy', error: string): Promise<void> {
    try {
      await Game.updateOne(
        { appId },
        { 
          $set: { 
            [`lastError.${source}`]: error,
            'lastError.timestamp': new Date()
          }
        }
      );
    } catch (error: any) {
      console.error('❌ Error updating game error status:', error);
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    try {
      const [
        totalGames,
        activeGames,
        gamesWithSteamData,
        gamesWithSteamSpyData,
        averageScore,
        topGenre
      ] = await Promise.all([
        Game.countDocuments(),
        Game.countDocuments({ isActive: true }),
        Game.countDocuments({ 'dataSources.steam': true }),
        Game.countDocuments({ 'dataSources.steamSpy': true }),
        Game.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
        ]),
        Game.aggregate([
          { $match: { isActive: true } },
          { $unwind: '$genres' },
          { $group: { _id: '$genres', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 }
        ])
      ]);

      return {
        totalGames,
        activeGames,
        gamesWithSteamData,
        gamesWithSteamSpyData,
        averageScore: averageScore[0]?.avgScore || 0,
        topGenre: topGenre[0]?._id || 'Unknown'
      };
    } catch (error: any) {
      console.error('❌ Error fetching database stats:', error);
      throw new Error(`Failed to fetch database stats: ${error.message}`);
    }
  }

  /**
   * Transform Steam API data for storage
   */
  private transformSteamData(steamData: any): any {
    return {
      appId: steamData.appid,
      name: steamData.name,
      type: steamData.type,
      requiredAge: steamData.required_age,
      isFree: steamData.is_free,
      detailedDescription: steamData.detailed_description,
      aboutTheGame: steamData.about_the_game,
      shortDescription: steamData.short_description,
      supportedLanguages: steamData.supported_languages,
      headerImage: steamData.header_image,
      website: steamData.website,
      developers: steamData.developers,
      publishers: steamData.publishers,
      categories: steamData.categories,
      genres: steamData.genres,
      screenshots: steamData.screenshots,
      releaseDate: steamData.release_date,
      metacritic: steamData.metacritic,
      priceOverview: steamData.price_overview,
      platforms: steamData.platforms,
      achievements: steamData.achievements,
      dlc: steamData.dlc,
      relatedProducts: steamData.related_products,
      lastUpdated: new Date()
    };
  }

  /**
   * Transform SteamSpy API data for storage
   */
  private transformSteamSpyData(steamSpyData: any): any {
    return {
      appId: steamSpyData.appid,
      name: steamSpyData.name,
      developer: steamSpyData.developer,
      publisher: steamSpyData.publisher,
      scoreRank: steamSpyData.score_rank,
      owners: steamSpyData.owners,
      averageForever: steamSpyData.average_forever,
      average2Weeks: steamSpyData.average_2weeks,
      medianForever: steamSpyData.median_forever,
      median2Weeks: steamSpyData.median_2weeks,
      ccu: steamSpyData.ccu,
      price: steamSpyData.price,
      initialPrice: steamSpyData.initialprice,
      discount: steamSpyData.discount,
      tags: steamSpyData.tags,
      languages: steamSpyData.languages,
      genre: steamSpyData.genre,
      lastUpdated: new Date()
    };
  }
}

export default new GameService(); 