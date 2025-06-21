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
    searchGames(query: string): Promise<SteamGame[]>;
    /**
     * Get multiple games by their app IDs
     */
    getMultipleGames(appIds: number[]): Promise<SteamGame[]>;
}
export declare const steamService: SteamService;
export {};
