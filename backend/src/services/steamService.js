"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.steamService = void 0;
const axios_1 = __importDefault(require("axios"));
class SteamService {
    constructor() {
        this.baseUrl = 'https://store.steampowered.com/api';
        this.communityUrl = 'https://api.steampowered.com';
        this.apiKey = process.env.STEAM_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️  STEAM_API_KEY not found in environment variables');
        }
    }
    /**
     * Get game details from Steam Store API
     */
    getGameDetails(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/appdetails`, {
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
            }
            catch (error) {
                console.error('Error fetching game details:', error);
                throw new Error('Failed to fetch game details from Steam');
            }
        });
    }
    /**
     * Get user profile from Steam Community API
     */
    getUserProfile(steamId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.communityUrl}/ISteamUser/GetPlayerSummaries/v2/`, {
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
            }
            catch (error) {
                console.error('Error fetching user profile:', error);
                throw new Error('Failed to fetch user profile from Steam');
            }
        });
    }
    /**
     * Get price data for a game
     */
    getGamePrice(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/appdetails`, {
                    params: {
                        appids: appId,
                        filters: 'price_overview'
                    }
                });
                return response.data[appId.toString()];
            }
            catch (error) {
                console.error('Error fetching game price:', error);
                throw new Error('Failed to fetch game price from Steam');
            }
        });
    }
    /**
     * Search for games by name
     */
    searchGames(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Note: Steam doesn't have a direct search API, so we'll use a workaround
                // This would typically involve using a third-party service or scraping
                // For now, we'll return an empty array and suggest implementing a proper search
                console.warn('Game search not implemented - would require third-party service');
                return [];
            }
            catch (error) {
                console.error('Error searching games:', error);
                throw new Error('Failed to search games');
            }
        });
    }
    /**
     * Get multiple games by their app IDs
     */
    getMultipleGames(appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = appIds.map(id => this.getGameDetails(id));
                const results = yield Promise.allSettled(promises);
                return results
                    .filter((result) => result.status === 'fulfilled' && result.value !== null)
                    .map(result => result.value);
            }
            catch (error) {
                console.error('Error fetching multiple games:', error);
                throw new Error('Failed to fetch multiple games');
            }
        });
    }
}
exports.steamService = new SteamService();
