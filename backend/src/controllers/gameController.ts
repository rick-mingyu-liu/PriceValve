import { Request, Response } from 'express';
import { analyzeGame, createComprehensiveAnalysis } from '../services/priceOptimizer';
import { getGameDetails, searchGames, getFeaturedGames } from '../services/steamApi';
import { getGameData, getTopGames, getAllGenres } from '../services/steamSpyApi';
import { 
  ComprehensiveAnalysis, 
  AnalysisRequest, 
  BatchAnalysisRequest,
  SearchResponse,
  APIResponse 
} from '../types/steam';

export const gameController = {
  /**
   * Analyze a single game with comprehensive data from all APIs
   */
  async analyzeGame(req: Request, res: Response) {
    try {
      const { appId }: AnalysisRequest = req.body;
      
      if (!appId) {
        return res.status(400).json({ 
          success: false, 
          error: 'appId is required' 
        });
      }

      console.log(`Starting comprehensive analysis for app ${appId}`);

      // Fetch data from all APIs in parallel
      const [steamData, steamSpyData] = await Promise.allSettled([
        getGameDetails(appId),
        getGameData(appId),
      ]);

      // Create comprehensive analysis
      let priceAnalysis = null;
      if (steamData.status === 'fulfilled' && steamData.value && 
          steamSpyData.status === 'fulfilled' && steamSpyData.value) {
        
        priceAnalysis = await createComprehensiveAnalysis(
          steamData.value,
          steamSpyData.value,
          null
        );
      }

      const analysis: ComprehensiveAnalysis = {
        appId,
        name: steamData.status === 'fulfilled' && steamData.value 
          ? steamData.value.name 
          : 'Unknown',
        steamData: steamData.status === 'fulfilled' ? steamData.value : null,
        steamSpyData: steamSpyData.status === 'fulfilled' ? steamSpyData.value : null,
        itadData: null,
        priceAnalysis,
        timestamp: new Date().toISOString(),
        success: true
      };

      res.json({ success: true, data: analysis });
    } catch (error) {
      console.error('Error in analyzeGame:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Analyze multiple games in batch
   */
  async analyzeBatchGames(req: Request, res: Response) {
    try {
      const { appIds, options }: BatchAnalysisRequest = req.body;
      
      if (!appIds || !Array.isArray(appIds) || appIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'appIds array is required' 
        });
      }

      if (appIds.length > 10) {
        return res.status(400).json({ 
          success: false, 
          error: 'Maximum 10 games per batch request' 
        });
      }

      console.log(`Starting batch analysis for ${appIds.length} games`);

      const results: ComprehensiveAnalysis[] = [];
      
      // Process games sequentially to avoid overwhelming APIs
      for (const appId of appIds) {
        try {
          const [steamData, steamSpyData] = await Promise.allSettled([
            getGameDetails(appId),
            getGameData(appId),
          ]);

          let priceAnalysis = null;
          if (steamData.status === 'fulfilled' && steamData.value && 
              steamSpyData.status === 'fulfilled' && steamSpyData.value) {
            
            priceAnalysis = await createComprehensiveAnalysis(
              steamData.value,
              steamSpyData.value,
              null
            );
          }

          results.push({
            appId,
            name: steamData.status === 'fulfilled' && steamData.value 
              ? steamData.value.name 
              : 'Unknown',
            steamData: steamData.status === 'fulfilled' ? steamData.value : null,
            steamSpyData: steamSpyData.status === 'fulfilled' ? steamSpyData.value : null,
            itadData: null,
            priceAnalysis,
            timestamp: new Date().toISOString(),
            success: true
          });
        } catch (error) {
          console.error(`Error analyzing game ${appId}:`, error);
          results.push({
            appId,
            name: 'Unknown',
            steamData: null,
            steamSpyData: null,
            itadData: null,
            priceAnalysis: null,
            timestamp: new Date().toISOString(),
            success: false,
            error: 'Failed to analyze game'
          });
        }
      }

      res.json({ 
        success: true, 
        data: results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      });
    } catch (error) {
      console.error('Error in analyzeBatchGames:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Search for games on Steam
   */
  async searchGames(req: Request, res: Response) {
    try {
      const { query, limit = 20 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'Query parameter is required' 
        });
      }

      const games = await searchGames(query, Number(limit));
      
      const response: SearchResponse = {
        games,
        total: games.length,
        query: query as string
      };

      res.json({ success: true, data: response });
    } catch (error) {
      console.error('Error in searchGames:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get featured games from Steam
   */
  async getFeaturedGames(req: Request, res: Response) {
    try {
      const games = await getFeaturedGames();
      res.json({ success: true, data: games });
    } catch (error) {
      console.error('Error in getFeaturedGames:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get top games from SteamSpy
   */
  async getTopGames(req: Request, res: Response) {
    try {
      const { criteria = 'top100in2weeks' } = req.query;
      const validCriteria = ['top100in2weeks', 'top100forever', 'top100owned'];
      
      if (!validCriteria.includes(criteria as string)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid criteria. Must be one of: top100in2weeks, top100forever, top100owned' 
        });
      }

      const games = await getTopGames(criteria as any);
      res.json({ success: true, data: games });
    } catch (error) {
      console.error('Error in getTopGames:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get games by genre
   */
  async getGamesByGenre(req: Request, res: Response) {
    try {
      const { genre } = req.params;
      
      if (!genre) {
        return res.status(400).json({ 
          success: false, 
          error: 'Genre parameter is required' 
        });
      }

      const games = await getTopGames('top100in2weeks'); // We'll filter by genre
      const filteredGames = games.filter(game => 
        game.genre.toLowerCase().includes(genre.toLowerCase())
      );

      res.json({ success: true, data: filteredGames });
    } catch (error) {
      console.error('Error in getGamesByGenre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get all genres with their top games
   */
  async getAllGenres(req: Request, res: Response) {
    try {
      const genres = await getAllGenres();
      res.json({ success: true, data: genres });
    } catch (error) {
      console.error('Error in getAllGenres:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get detailed Steam data for a game
   */
  async getSteamData(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      
      if (!appId) {
        return res.status(400).json({ 
          success: false, 
          error: 'appId parameter is required' 
        });
      }

      const data = await getGameDetails(Number(appId));
      
      if (!data) {
        return res.status(404).json({ 
          success: false, 
          error: 'Game not found' 
        });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getSteamData:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Get SteamSpy data for a game
   */
  async getSteamSpyData(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      
      if (!appId) {
        return res.status(400).json({ 
          success: false, 
          error: 'appId parameter is required' 
        });
      }

      const data = await getGameData(Number(appId));
      
      if (!data) {
        return res.status(404).json({ 
          success: false, 
          error: 'Game not found' 
        });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getSteamSpyData:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response) {
    res.json({ 
      success: true, 
      message: 'PriceValve API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
}; 