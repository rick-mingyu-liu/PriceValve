const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface SteamGame {
  appid: number;
  name: string;
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
  };
}

export interface SteamUserProfile {
  steamid: string;
  personaname: string;
  avatarfull: string;
  profileurl: string;
  realname?: string;
  timecreated?: number;
}

export interface SteamPriceData {
  success: boolean;
  data?: {
    price_overview?: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
    };
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Steam API methods
  async getGameDetails(appId: number): Promise<SteamGame> {
    return this.request<SteamGame>(`/steam/game/${appId}`);
  }

  async getUserProfile(steamId: string): Promise<SteamUserProfile> {
    return this.request<SteamUserProfile>(`/steam/user/${steamId}`);
  }

  async getGamePrice(appId: number): Promise<SteamPriceData> {
    return this.request<SteamPriceData>(`/steam/price/${appId}`);
  }

  async getMultipleGames(appIds: number[]): Promise<SteamGame[]> {
    return this.request<SteamGame[]>('/steam/games', {
      method: 'POST',
      body: JSON.stringify({ appIds }),
    });
  }

  async searchGames(query: string): Promise<SteamGame[]> {
    return this.request<SteamGame[]>(`/steam/search?q=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 