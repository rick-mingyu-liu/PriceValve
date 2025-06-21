import axios from 'axios';
import { SteamGame, SteamUserProfile, SteamPriceData } from '../types';

class SteamService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://store.steampowered.com/api';
  private readonly communityUrl = 'https://api.steampowered.com';

  constructor() {
    this.apiKey = process.env.STEAM_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  STEAM_API_KEY not found in environment variables');
    }
  }

  /**
   * Get game details from Steam Store API
   */
  async getGameDetails(appId: number): Promise<SteamGame | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/appdetails`, {
        params: {
          appids: appId,
          filters: 'basic,price_overview'
        }
      });

      const data = response.data[appId.toString()];
      if (!data.success) {
        return null;
      }

      return {
        appid: appId,
        name: data.data.name,
        price_overview: data.data.price_overview
      };
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw new Error('Failed to fetch game details from Steam');
    }
  }

  /**
   * Get user profile from Steam Community API
   */
  async getUserProfile(steamId: string): Promise<SteamUserProfile | null> {
    try {
      const response = await axios.get(`${this.communityUrl}/ISteamUser/GetPlayerSummaries/v2/`, {
        params: {
          key: this.apiKey,
          steamids: steamId
        }
      });

      const players = response.data.response.players;
      if (!players || players.length === 0) {
        return null;
      }

      const player = players[0];
      return {
        steamid: player.steamid,
        personaname: player.personaname,
        avatarfull: player.avatarfull,
        profileurl: player.profileurl,
        realname: player.realname,
        timecreated: player.timecreated
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile from Steam');
    }
  }

  /**
   * Get price data for a game
   */
  async getGamePrice(appId: number): Promise<SteamPriceData> {
    try {
      const response = await axios.get(`${this.baseUrl}/appdetails`, {
        params: {
          appids: appId,
          filters: 'price_overview'
        }
      });

      return response.data[appId.toString()];
    } catch (error) {
      console.error('Error fetching game price:', error);
      throw new Error('Failed to fetch game price from Steam');
    }
  }

  /**
   * Search for games by name
   */
  async searchGames(query: string): Promise<SteamGame[]> {
    try {
      // Note: Steam doesn't have a direct search API, so we'll use a workaround
      // This would typically involve using a third-party service or scraping
      // For now, we'll return an empty array and suggest implementing a proper search
      console.warn('Game search not implemented - would require third-party service');
      return [];
    } catch (error) {
      console.error('Error searching games:', error);
      throw new Error('Failed to search games');
    }
  }

  /**
   * Get multiple games by their app IDs
   */
  async getMultipleGames(appIds: number[]): Promise<SteamGame[]> {
    try {
      const promises = appIds.map(id => this.getGameDetails(id));
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<SteamGame | null> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value!);
    } catch (error) {
      console.error('Error fetching multiple games:', error);
      throw new Error('Failed to fetch multiple games');
    }
  }
}

export const steamService = new SteamService(); 