// steamApi.ts
// This is where Steam Web API integration would go for fetching game details, etc. 

import axios from 'axios';

// Steam Web API endpoints
const STEAM_API_BASE = 'https://store.steampowered.com/api';
const STEAM_APP_DETAILS = `${STEAM_API_BASE}/appdetails`;
const STEAM_FEATURED = `${STEAM_API_BASE}/featured`;
const STEAM_SEARCH = `${STEAM_API_BASE}/search`;

export interface SteamGameDetails {
  appId: number;
  name: string;
  isFree: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  developer: string;
  publisher: string;
  tags: string[];
  categories: string[];
  releaseDate: string;
  metacritic?: {
    score: number;
    url: string;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  genres: string[];
  description: string;
  headerImage: string;
  screenshots: string[];
  movies: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: {
      '480': string;
      max: string;
    };
    mp4: {
      '480': string;
      max: string;
    };
  }>;
  background: string;
}

export interface SteamSearchResult {
  appId: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  headerImage: string;
}

/**
 * Fetch detailed information about a specific game by app ID
 */
export async function getGameDetails(appId: number): Promise<SteamGameDetails | null> {
  try {
    const response = await axios.get(`${STEAM_APP_DETAILS}`, {
      params: {
        appids: appId,
        l: 'english', // Language
        cc: 'US', // Country code for pricing
        v: 1
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data[appId] || !data[appId].success) {
      console.warn(`Failed to fetch Steam details for app ${appId}`);
      return null;
    }

    const gameData = data[appId].data;
    
    // Extract price information
    const priceOverview = gameData.price_overview;
    const isFree = gameData.is_free || false;
    const price = isFree ? 0 : (priceOverview?.final || 0);
    const originalPrice = priceOverview?.initial || price;
    const discountPercent = priceOverview?.discount_percent || 0;

    return {
      appId: parseInt(gameData.steam_appid),
      name: gameData.name,
      isFree,
      price,
      originalPrice,
      discountPercent,
      developer: gameData.developers?.join(', ') || 'Unknown',
      publisher: gameData.publishers?.join(', ') || 'Unknown',
      tags: gameData.categories?.map((cat: any) => cat.description) || [],
      categories: gameData.categories?.map((cat: any) => cat.description) || [],
      releaseDate: gameData.release_date?.date || 'Unknown',
      metacritic: gameData.metacritic ? {
        score: gameData.metacritic.score,
        url: gameData.metacritic.url
      } : undefined,
      platforms: {
        windows: gameData.platforms?.windows || false,
        mac: gameData.platforms?.mac || false,
        linux: gameData.platforms?.linux || false
      },
      genres: gameData.genres?.map((genre: any) => genre.description) || [],
      description: gameData.detailed_description || '',
      headerImage: gameData.header_image || '',
      screenshots: gameData.screenshots?.map((screenshot: any) => screenshot.path_full) || [],
      movies: gameData.movies || [],
      background: gameData.background || ''
    };
  } catch (error) {
    console.error(`Error fetching Steam game details for app ${appId}:`, error);
    return null;
  }
}

/**
 * Search for games on Steam
 */
export async function searchGames(query: string, limit: number = 20): Promise<SteamSearchResult[]> {
  try {
    const response = await axios.get(`${STEAM_SEARCH}`, {
      params: {
        term: query,
        category1: 998, // Games category
        supportedlang: 'english',
        inifinite: 1,
        start: 0,
        count: limit
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.items) {
      return [];
    }

    return data.items.map((item: any) => ({
      appId: parseInt(item.id),
      name: item.name,
      price: item.final_price || 0,
      originalPrice: item.original_price || item.final_price || 0,
      discountPercent: item.discount_percent || 0,
      headerImage: item.large_capsule_image || item.small_capsule_image || ''
    }));
  } catch (error) {
    console.error(`Error searching Steam games for query "${query}":`, error);
    return [];
  }
}

/**
 * Get featured games and deals from Steam
 */
export async function getFeaturedGames(): Promise<SteamSearchResult[]> {
  try {
    const response = await axios.get(`${STEAM_FEATURED}`, {
      params: {
        cc: 'US',
        l: 'english'
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.featured_win) {
      return [];
    }

    const featuredGames: SteamSearchResult[] = [];
    
    // Featured deals
    if (data.featured_win.featured) {
      featuredGames.push(...data.featured_win.featured.map((item: any) => ({
        appId: parseInt(item.id),
        name: item.name,
        price: item.final_price || 0,
        originalPrice: item.original_price || item.final_price || 0,
        discountPercent: item.discount_percent || 0,
        headerImage: item.large_capsule_image || item.small_capsule_image || ''
      })));
    }

    // Top sellers
    if (data.featured_win.top_sellers) {
      featuredGames.push(...data.featured_win.top_sellers.map((item: any) => ({
        appId: parseInt(item.id),
        name: item.name,
        price: item.final_price || 0,
        originalPrice: item.original_price || item.final_price || 0,
        discountPercent: item.discount_percent || 0,
        headerImage: item.large_capsule_image || item.small_capsule_image || ''
      })));
    }

    return featuredGames;
  } catch (error) {
    console.error('Error fetching featured Steam games:', error);
    return [];
  }
}

/**
 * Get multiple games by their app IDs
 */
export async function getMultipleGameDetails(appIds: number[]): Promise<SteamGameDetails[]> {
  const promises = appIds.map(id => getGameDetails(id));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<SteamGameDetails | null> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value as SteamGameDetails);
} 