import { AppError } from '../types';

/**
 * Create a custom error with status code
 */
export function createError(message: string, statusCode: number = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

/**
 * Validate Steam App ID
 */
export function isValidSteamAppId(appId: number): boolean {
  return Number.isInteger(appId) && appId > 0;
}

/**
 * Validate Steam User ID
 */
export function isValidSteamUserId(steamId: string): boolean {
  // Steam IDs are typically 17-digit numbers
  return /^\d{17}$/.test(steamId);
}

/**
 * Format price from Steam API (cents to dollars)
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, finalPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[<>]/g, '');
}

/**
 * Validate array of app IDs
 */
export function validateAppIds(appIds: number[]): { valid: boolean; error?: string } {
  if (!Array.isArray(appIds)) {
    return { valid: false, error: 'appIds must be an array' };
  }
  
  if (appIds.length === 0) {
    return { valid: false, error: 'appIds array cannot be empty' };
  }
  
  if (appIds.length > 50) {
    return { valid: false, error: 'Cannot request more than 50 games at once' };
  }
  
  for (const appId of appIds) {
    if (!isValidSteamAppId(appId)) {
      return { valid: false, error: `Invalid app ID: ${appId}` };
    }
  }
  
  return { valid: true };
}

/**
 * Generate a random string for testing
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 