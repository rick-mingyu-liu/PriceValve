import { SteamGame, SteamUserProfile, SteamPriceData } from '../types';
declare class SteamService {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly communityUrl;
    constructor();
    /**
     * Get game details from Steam Store API
     */
    getGameDetails(appId: number): Promise<SteamGame | null>;
    /**
     * Get user profile from Steam Community API
     */
    getUserProfile(steamId: string): Promise<SteamUserProfile | null>;
    /**
     * Get price data for a game
     */
    getGamePrice(appId: number): Promise<SteamPriceData>;
    /**
     * Search for games by name
     */
    searchGames(): Promise<SteamGame[]>;
    /**
     * Get multiple games by their app IDs
     */
    getMultipleGames(appIds: number[]): Promise<SteamGame[]>;
}
export declare const steamService: SteamService;
export {};
