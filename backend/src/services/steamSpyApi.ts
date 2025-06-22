// steamSpyApi.ts
// This is where SteamSpy API integration would go for fetching market/ownership data, etc. 

import axios from 'axios';

// SteamSpy API endpoints
const STEAMSPY_API_BASE = 'https://steamspy.com/api.php';

export interface SteamSpyGameData {
  appId: number;
  name: string;
  developer: string;
  publisher: string;
  scoreRank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  averageForever: number;
  average2Weeks: number;
  medianForever: number;
  median2Weeks: number;
  price: string;
  initialPrice: string;
  discount: string;
  languages: string;
  genre: string;
  tags: { [key: string]: number };
  releaseDate: string;
  lastUpdated: string;
}

export interface SteamSpyTopGames {
  appId: number;
  name: string;
  scoreRank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  averageForever: number;
  average2Weeks: number;
  price: string;
  discount: string;
  genre: string;
}

export interface SteamSpyGenreData {
  genre: string;
  games: SteamSpyTopGames[];
}

/**
 * Fetch detailed SteamSpy data for a specific game
 */
export async function getGameData(appId: number): Promise<SteamSpyGameData | null> {
  try {
    const response = await axios.get(STEAMSPY_API_BASE, {
      params: {
        request: 'appdetails',
        appid: appId
      },
      timeout: 15000
    });

    const data = response.data;
    if (!data || data.error) {
      console.warn(`Failed to fetch SteamSpy data for app ${appId}:`, data?.error);
      return null;
    }

    return {
      appId: parseInt(data.appid),
      name: data.name || 'Unknown',
      developer: data.developer || 'Unknown',
      publisher: data.publisher || 'Unknown',
      scoreRank: data.score_rank || 'Unknown',
      positive: parseInt(data.positive) || 0,
      negative: parseInt(data.negative) || 0,
      userscore: parseInt(data.userscore) || 0,
      owners: data.owners || 'Unknown',
      averageForever: parseInt(data.average_forever) || 0,
      average2Weeks: parseInt(data.average_2weeks) || 0,
      medianForever: parseInt(data.median_forever) || 0,
      median2Weeks: parseInt(data.median_2weeks) || 0,
      price: data.price || '0',
      initialPrice: data.initialprice || '0',
      discount: data.discount || '0',
      languages: data.languages || '',
      genre: data.genre || '',
      tags: data.tags || {},
      releaseDate: data.release_date || 'Unknown',
      lastUpdated: data.last_updated || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching SteamSpy data for app ${appId}:`, error);
    return null;
  }
}

/**
 * Get top games by various criteria
 */
export async function getTopGames(criteria: 'top100in2weeks' | 'top100forever' | 'top100owned' = 'top100in2weeks'): Promise<SteamSpyTopGames[]> {
  try {
    const response = await axios.get(STEAMSPY_API_BASE, {
      params: {
        request: criteria
      },
      timeout: 15000
    });

    const data = response.data;
    if (!data) {
      return [];
    }

    return Object.entries(data).map(([appId, gameData]: [string, any]) => ({
      appId: parseInt(appId),
      name: gameData.name || 'Unknown',
      scoreRank: gameData.score_rank || 'Unknown',
      positive: parseInt(gameData.positive) || 0,
      negative: parseInt(gameData.negative) || 0,
      userscore: parseInt(gameData.userscore) || 0,
      owners: gameData.owners || 'Unknown',
      averageForever: parseInt(gameData.average_forever) || 0,
      average2Weeks: parseInt(gameData.average_2weeks) || 0,
      price: gameData.price || '0',
      discount: gameData.discount || '0',
      genre: gameData.genre || ''
    }));
  } catch (error) {
    console.error(`Error fetching SteamSpy top games (${criteria}):`, error);
    return [];
  }
}

/**
 * Get games by genre
 */
export async function getGamesByGenre(genre: string): Promise<SteamSpyTopGames[]> {
  try {
    const response = await axios.get(STEAMSPY_API_BASE, {
      params: {
        request: 'genre',
        genre: genre
      },
      timeout: 15000
    });

    const data = response.data;
    if (!data) {
      return [];
    }

    return Object.entries(data).map(([appId, gameData]: [string, any]) => ({
      appId: parseInt(appId),
      name: gameData.name || 'Unknown',
      scoreRank: gameData.score_rank || 'Unknown',
      positive: parseInt(gameData.positive) || 0,
      negative: parseInt(gameData.negative) || 0,
      userscore: parseInt(gameData.userscore) || 0,
      owners: gameData.owners || 'Unknown',
      averageForever: parseInt(gameData.average_forever) || 0,
      average2Weeks: parseInt(gameData.average_2weeks) || 0,
      price: gameData.price || '0',
      discount: gameData.discount || '0',
      genre: gameData.genre || ''
    }));
  } catch (error) {
    console.error(`Error fetching SteamSpy games by genre (${genre}):`, error);
    return [];
  }
}

/**
 * Get all genres with their top games
 */
export async function getAllGenres(): Promise<SteamSpyGenreData[]> {
  const genres = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing',
    'Indie', 'Casual', 'Arcade', 'Puzzle', 'Platformer', 'Shooter', 'Fighting',
    'Visual Novel', 'Roguelike', 'Roguelite', 'Metroidvania', 'Sandbox', 'Horror'
  ];

  const genreData: SteamSpyGenreData[] = [];
  
  for (const genre of genres) {
    try {
      const games = await getGamesByGenre(genre);
      if (games.length > 0) {
        genreData.push({
          genre,
          games: games.slice(0, 20) // Limit to top 20 per genre
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch games for genre ${genre}:`, error);
    }
  }

  return genreData;
}

/**
 * Get multiple games data by their app IDs
 */
export async function getMultipleGamesData(appIds: number[]): Promise<SteamSpyGameData[]> {
  const promises = appIds.map(id => getGameData(id));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<SteamSpyGameData | null> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value as SteamSpyGameData);
}

/**
 * Calculate popularity score based on SteamSpy data
 */
export function calculatePopularityScore(gameData: SteamSpyGameData): number {
  const owners = parseOwnersString(gameData.owners);
  const positiveRatio = gameData.positive / (gameData.positive + gameData.negative);
  const averagePlaytime = gameData.averageForever;
  
  // Weighted score: 40% owners, 30% positive ratio, 30% playtime
  const ownerScore = Math.min(owners / 1000000, 1) * 0.4; // Normalize to 1M owners
  const ratingScore = positiveRatio * 0.3;
  const playtimeScore = Math.min(averagePlaytime / 100, 1) * 0.3; // Normalize to 100 hours
  
  return (ownerScore + ratingScore + playtimeScore) * 100;
}

/**
 * Parse owners string to number (e.g., "2,000,000 .. 5,000,000" -> 3500000)
 */
function parseOwnersString(owners: string): number {
  if (!owners || owners === 'Unknown') return 0;
  
  const numbers = owners.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  const nums = numbers.map(n => parseInt(n.replace(/,/g, '')));
  return nums.reduce((sum, num) => sum + num, 0) / nums.length;
} 