// Steam Web API Types for PriceValve
// Documentation: https://developer.valvesoftware.com/wiki/Steam_Web_API

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever?: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
  img_logo_url?: string;
  has_community_visible_stats?: boolean;
}

export interface SteamAppDetails {
  appid: number;
  name: string;
  type?: string;
  required_age?: number;
  is_free?: boolean;
  detailed_description?: string;
  about_the_game?: string;
  short_description?: string;
  supported_languages?: string;
  header_image?: string;
  website?: string;
  developers?: string[];
  publishers?: string[];
  categories?: SteamCategory[];
  genres?: SteamGenre[];
  screenshots?: SteamScreenshot[];
  movies?: SteamMovie[];
  recommendations?: SteamRecommendations;
  release_date?: SteamReleaseDate;
  metacritic?: SteamMetacritic;
  price_overview?: SteamPriceOverview;
  packages?: number[];
  platforms?: SteamPlatforms;
  background?: string;
  content_descriptors?: SteamContentDescriptors;
  legal_notice?: string;
  drm_notice?: string;
  ext_user_account_notice?: string;
  pc_requirements?: SteamRequirements;
  mac_requirements?: SteamRequirements;
  linux_requirements?: SteamRequirements;
  achievements?: SteamAchievements;
  controller_support?: string;
  dlc?: number[];
  related_products?: number[];
  supported_audio?: SteamAudio[];
  supported_video?: SteamVideo[];
  reviews?: string;
  demos?: SteamDemo[];
  support_info?: SteamSupportInfo;
}

export interface SteamPlayerStats {
  appid: number;
  player_count: number;
  timestamp: number;
}

export interface SteamCategory {
  id: number;
  description: string;
}

export interface SteamGenre {
  id: string;
  description: string;
}

export interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface SteamMovie {
  id: number;
  name: string;
  thumbnail: string;
  webm: SteamVideoFormat;
  mp4: SteamVideoFormat;
  highlight: boolean;
}

export interface SteamVideoFormat {
  '480': string;
  max: string;
}

export interface SteamRecommendations {
  total: number;
}

export interface SteamReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface SteamMetacritic {
  score: number;
  url: string;
}

export interface SteamPriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

export interface SteamPlatforms {
  windows: boolean;
  mac: boolean;
  linux: boolean;
}

export interface SteamContentDescriptors {
  ids: number[];
  notes: string;
}

export interface SteamRequirements {
  minimum: string;
  recommended?: string;
}

export interface SteamAchievements {
  total: number;
  highlighted: SteamAchievement[];
}

export interface SteamAchievement {
  name: string;
  path: string;
}

export interface SteamAudio {
  id: number;
  name: string;
}

export interface SteamVideo {
  id: number;
  name: string;
}

export interface SteamDemo {
  appid: number;
  description: string;
}

export interface SteamSupportInfo {
  url: string;
  email: string;
}

export interface SteamUserGames {
  game_count: number;
  games: SteamGame[];
}

export interface SteamAppList {
  apps: SteamApp[];
}

export interface SteamApp {
  appid: number;
  name: string;
}

export interface SteamPlayerCount {
  player_count: number;
  result: number;
}

export interface SteamReviewSummary {
  query_summary: {
    num_reviews: number;
    review_score: string;
    review_score_desc: string;
    total_positive: number;
    total_reviews: number;
    total_negative: number;
  };
}

export interface SteamSimilarGames {
  appid: number;
  name: string;
  similarity_score: number;
  tags: string[];
  price_overview?: SteamPriceOverview;
}

// API Response Types
export interface SteamApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SteamRateLimit {
  remaining: number;
  reset: number;
  limit: number;
} 