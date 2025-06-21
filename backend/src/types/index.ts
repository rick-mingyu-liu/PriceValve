// Re-export all Steam types
export * from './steam';

// Legacy types for backward compatibility
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

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  message: string;
}

// Error Types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Request Types
export interface SteamGameRequest {
  appId: number;
}

export interface SteamUserRequest {
  steamId: string;
}

export interface MultipleGamesRequest {
  appIds: number[];
}

export interface SearchGamesRequest {
  query: string;
} 