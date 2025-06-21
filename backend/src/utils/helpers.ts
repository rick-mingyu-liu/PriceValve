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