// isThereAnyDealApi.ts
// This is where IsThereAnyDeal API integration would go for fetching deal/pricing data, etc. 

import axios from 'axios';

// IsThereAnyDeal API endpoints
const ITAD_API_BASE = 'https://api.isthereanydeal.com/v01';
const ITAD_GAME_INFO = `${ITAD_API_BASE}/game/info`;
const ITAD_GAME_PRICES = `${ITAD_API_BASE}/game/prices`;
const ITAD_GAME_HISTORY = `${ITAD_API_BASE}/game/prices/history`;
const ITAD_GAME_PLAINS = `${ITAD_API_BASE}/game/plain`;
const ITAD_SEARCH = `${ITAD_API_BASE}/search/search`;

// You'll need to get an API key from https://isthereanydeal.com/apps/
const ITAD_API_KEY = process.env.ITAD_API_KEY || '';

export interface ITADGameInfo {
  plain: string;
  title: string;
  image: string;
  urls: {
    game: string;
    package: string;
    dlc: string;
  };
}

export interface ITADPrice {
  shop: {
    id: string;
    name: string;
    url: string;
  };
  price: {
    amount: number;
    currency: string;
    oldAmount?: number;
    oldCurrency?: string;
  };
  drm: string[];
  url: string;
  inStock: boolean;
}

export interface ITADGamePrices {
  plain: string;
  title: string;
  prices: ITADPrice[];
  urls: {
    game: string;
    package: string;
    dlc: string;
  };
}

export interface ITADPriceHistory {
  plain: string;
  title: string;
  history: Array<{
    date: string;
    price: {
      amount: number;
      currency: string;
    };
    shop: {
      id: string;
      name: string;
    };
  }>;
}

export interface ITADSearchResult {
  plain: string;
  title: string;
  image: string;
}

/**
 * Get game information by plain (ITAD's internal game identifier)
 */
export async function getGameInfo(plain: string): Promise<ITADGameInfo | null> {
  if (!ITAD_API_KEY) {
    console.warn('ITAD API key not configured');
    return null;
  }

  try {
    const response = await axios.get(ITAD_GAME_INFO, {
      params: {
        key: ITAD_API_KEY,
        plains: plain
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.data || !data.data[plain]) {
      console.warn(`Failed to fetch ITAD game info for ${plain}`);
      return null;
    }

    return data.data[plain];
  } catch (error) {
    console.error(`Error fetching ITAD game info for ${plain}:`, error);
    return null;
  }
}

/**
 * Get current prices for a game across all stores
 */
export async function getGamePrices(plain: string, region: string = 'US', country: string = 'US'): Promise<ITADGamePrices | null> {
  if (!ITAD_API_KEY) {
    console.warn('ITAD API key not configured');
    return null;
  }

  try {
    const response = await axios.get(ITAD_GAME_PRICES, {
      params: {
        key: ITAD_API_KEY,
        plains: plain,
        region: region,
        country: country,
        shops: 'steam,gog,epic,humble,fanatical,greenmangaming,indiegala,itchio'
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.data || !data.data[plain]) {
      console.warn(`Failed to fetch ITAD prices for ${plain}`);
      return null;
    }

    return data.data[plain];
  } catch (error) {
    console.error(`Error fetching ITAD prices for ${plain}:`, error);
    return null;
  }
}

/**
 * Get price history for a game
 */
export async function getPriceHistory(plain: string, region: string = 'US', country: string = 'US'): Promise<ITADPriceHistory | null> {
  if (!ITAD_API_KEY) {
    console.warn('ITAD API key not configured');
    return null;
  }

  try {
    const response = await axios.get(ITAD_GAME_HISTORY, {
      params: {
        key: ITAD_API_KEY,
        plains: plain,
        region: region,
        country: country,
        shop: 'steam' // Focus on Steam for consistency
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.data || !data.data[plain]) {
      console.warn(`Failed to fetch ITAD price history for ${plain}`);
      return null;
    }

    return data.data[plain];
  } catch (error) {
    console.error(`Error fetching ITAD price history for ${plain}:`, error);
    return null;
  }
}

/**
 * Search for games by title
 */
export async function searchGames(query: string, limit: number = 20): Promise<ITADSearchResult[]> {
  if (!ITAD_API_KEY) {
    console.warn('ITAD API key not configured');
    return [];
  }

  try {
    const response = await axios.get(ITAD_SEARCH, {
      params: {
        key: ITAD_API_KEY,
        q: query,
        limit: limit,
        strict: 0
      },
      timeout: 10000
    });

    const data = response.data;
    if (!data || !data.data || !data.data.list) {
      return [];
    }

    return data.data.list;
  } catch (error) {
    console.error(`Error searching ITAD games for query "${query}":`, error);
    return [];
  }
}

/**
 * Get the plain identifier for a Steam app ID
 * Note: This is a simplified approach. In practice, you might need to maintain a mapping
 */
export async function getPlainFromSteamAppId(appId: number): Promise<string | null> {
  // This is a simplified approach. In a real implementation, you might:
  // 1. Maintain a database mapping Steam app IDs to ITAD plains
  // 2. Use Steam's app name to search ITAD
  // 3. Use a third-party service that provides this mapping
  
  try {
    // For now, we'll try to search using a common pattern
    // This is not reliable but gives us a starting point
    const searchResults = await searchGames(`app/${appId}`);
    if (searchResults.length > 0) {
      return searchResults[0].plain;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting plain for Steam app ${appId}:`, error);
    return null;
  }
}

/**
 * Get comprehensive pricing data for a Steam game
 */
export async function getComprehensivePricingData(appId: number): Promise<{
  currentPrices: ITADGamePrices | null;
  priceHistory: ITADPriceHistory | null;
  gameInfo: ITADGameInfo | null;
} | null> {
  const plain = await getPlainFromSteamAppId(appId);
  if (!plain) {
    console.warn(`Could not find ITAD plain for Steam app ${appId}`);
    return null;
  }

  try {
    const [currentPrices, priceHistory, gameInfo] = await Promise.allSettled([
      getGamePrices(plain),
      getPriceHistory(plain),
      getGameInfo(plain)
    ]);

    return {
      currentPrices: currentPrices.status === 'fulfilled' ? currentPrices.value : null,
      priceHistory: priceHistory.status === 'fulfilled' ? priceHistory.value : null,
      gameInfo: gameInfo.status === 'fulfilled' ? gameInfo.value : null
    };
  } catch (error) {
    console.error(`Error fetching comprehensive pricing data for app ${appId}:`, error);
    return null;
  }
}

/**
 * Calculate price statistics from price history
 */
export function calculatePriceStatistics(priceHistory: ITADPriceHistory): {
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceVolatility: number;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
} {
  if (!priceHistory || !priceHistory.history || priceHistory.history.length === 0) {
    return {
      lowestPrice: 0,
      highestPrice: 0,
      averagePrice: 0,
      priceVolatility: 0,
      priceTrend: 'stable'
    };
  }

  const prices = priceHistory.history.map(h => h.price.amount);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Calculate price volatility (standard deviation)
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length;
  const priceVolatility = Math.sqrt(variance);

  // Determine price trend (simple linear regression)
  const n = prices.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = averagePrice;

  const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (prices[i] - yMean), 0);
  const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const priceTrend = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';

  return {
    lowestPrice,
    highestPrice,
    averagePrice,
    priceVolatility,
    priceTrend
  };
}

/**
 * Get the best current deal for a game
 */
export function getBestDeal(gamePrices: ITADGamePrices): ITADPrice | null {
  if (!gamePrices || !gamePrices.prices || gamePrices.prices.length === 0) {
    return null;
  }

  // Filter out out-of-stock items and sort by price
  const availablePrices = gamePrices.prices
    .filter(price => price.inStock)
    .sort((a, b) => a.price.amount - b.price.amount);

  return availablePrices.length > 0 ? availablePrices[0] : null;
} 