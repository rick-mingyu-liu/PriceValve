import mongoose, { Document, Schema } from 'mongoose';

/**
 * Game Model for PriceValve
 * Stores comprehensive game data from Steam and SteamSpy APIs
 */

// Price Analysis Schema
const PriceAnalysisSchema = new Schema({
  currentPrice: { type: Number, required: true, default: 0 },
  initialPrice: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  priceRange: { type: String, required: true, default: 'Unknown' },
  priceCategory: { 
    type: String, 
    enum: ['Free', 'Budget', 'Mid-Range', 'Premium', 'AAA'],
    required: true,
    default: 'Mid-Range'
  },
  pricePerHour: { type: Number, required: true, default: 0 },
  valueScore: { type: Number, required: true, default: 0, min: 0, max: 100 }
}, { _id: false });

// Player Analysis Schema
const PlayerAnalysisSchema = new Schema({
  averageForever: { type: Number, required: true, default: 0 },
  average2Weeks: { type: Number, required: true, default: 0 },
  medianForever: { type: Number, required: true, default: 0 },
  median2Weeks: { type: Number, required: true, default: 0 },
  currentPlayers: { type: Number, required: true, default: 0 },
  playerEngagement: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Very High'],
    required: true,
    default: 'Low'
  },
  retentionScore: { type: Number, required: true, default: 0, min: 0, max: 100 }
}, { _id: false });

// Market Analysis Schema
const MarketAnalysisSchema = new Schema({
  owners: { type: String, required: true, default: '0 .. 20,000' },
  ownershipRange: {
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 20000 },
    average: { type: Number, required: true, default: 10000 }
  },
  marketPosition: { 
    type: String, 
    enum: ['Niche', 'Popular', 'Blockbuster', 'Viral'],
    required: true,
    default: 'Niche'
  },
  marketScore: { type: Number, required: true, default: 0, min: 0, max: 100 }
}, { _id: false });

// Review Analysis Schema
const ReviewAnalysisSchema = new Schema({
  scoreRank: { type: String, required: true, default: 'Unknown' },
  reviewScore: { type: Number, required: true, default: 50, min: 0, max: 100 },
  reviewCategory: { 
    type: String, 
    enum: ['Overwhelmingly Positive', 'Very Positive', 'Positive', 'Mixed', 'Negative', 'Very Negative', 'Overwhelmingly Negative'],
    required: true,
    default: 'Mixed'
  },
  qualityScore: { type: Number, required: true, default: 50, min: 0, max: 100 }
}, { _id: false });

// Tag Schema
const TagSchema = new Schema({
  name: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 }
}, { _id: false });

// Optimal Pricing Schema
const OptimalPricingSchema = new Schema({
  suggestedPrice: { type: Number, required: true, default: 0 },
  confidence: { type: Number, required: true, default: 50, min: 0, max: 100 },
  reasoning: [{ type: String }]
}, { _id: false });

// Steam Data Schema
const SteamDataSchema = new Schema({
  appId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String },
  requiredAge: { type: Number },
  isFree: { type: Boolean, default: false },
  detailedDescription: { type: String },
  aboutTheGame: { type: String },
  shortDescription: { type: String },
  supportedLanguages: { type: String },
  headerImage: { type: String },
  website: { type: String },
  developers: [{ type: String }],
  publishers: [{ type: String }],
  categories: [{
    id: { type: Number },
    description: { type: String }
  }],
  genres: [{
    id: { type: String },
    description: { type: String }
  }],
  screenshots: [{
    id: { type: Number },
    pathThumbnail: { type: String },
    pathFull: { type: String }
  }],
  releaseDate: {
    comingSoon: { type: Boolean, default: false },
    date: { type: String }
  },
  metacritic: {
    score: { type: Number },
    url: { type: String }
  },
  priceOverview: {
    currency: { type: String },
    initial: { type: Number },
    final: { type: Number },
    discountPercent: { type: Number },
    initialFormatted: { type: String },
    finalFormatted: { type: String }
  },
  platforms: {
    windows: { type: Boolean, default: false },
    mac: { type: Boolean, default: false },
    linux: { type: Boolean, default: false }
  },
  achievements: {
    total: { type: Number, default: 0 },
    highlighted: [{
      name: { type: String },
      path: { type: String }
    }]
  },
  dlc: [{ type: Number }],
  relatedProducts: [{ type: Number }],
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

// SteamSpy Data Schema
const SteamSpyDataSchema = new Schema({
  appId: { type: Number, required: true },
  name: { type: String, required: true },
  developer: { type: String },
  publisher: { type: String },
  scoreRank: { type: String },
  owners: { type: String },
  averageForever: { type: Number, default: 0 },
  average2Weeks: { type: Number, default: 0 },
  medianForever: { type: Number, default: 0 },
  median2Weeks: { type: Number, default: 0 },
  ccu: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  initialPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tags: { type: Map, of: Number, default: {} },
  languages: { type: String },
  genre: { type: String },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

// Main Game Schema
const GameSchema = new Schema({
  // Basic Information
  appId: { 
    type: Number, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true,
    index: true 
  },
  developer: { type: String, index: true },
  publisher: { type: String, index: true },

  // Raw API Data
  steamData: { type: SteamDataSchema },
  steamSpyData: { type: SteamSpyDataSchema },

  // Analysis Results
  priceAnalysis: { type: PriceAnalysisSchema },
  playerAnalysis: { type: PlayerAnalysisSchema },
  marketAnalysis: { type: MarketAnalysisSchema },
  reviewAnalysis: { type: ReviewAnalysisSchema },

  // Game Features
  tags: [{ type: TagSchema }],
  genres: [{ type: String, index: true }],
  languages: [{ type: String }],

  // Analysis Scores
  overallScore: { 
    type: Number, 
    required: true, 
    default: 0, 
    min: 0, 
    max: 100,
    index: true 
  },

  // Recommendations
  recommendations: [{ type: String }],

  // Optimal Pricing
  optimalPricing: { type: OptimalPricingSchema },

  // Metadata
  dataSources: {
    steam: { type: Boolean, default: false },
    steamSpy: { type: Boolean, default: false }
  },
  
  lastAnalyzed: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  
  analysisCount: { 
    type: Number, 
    default: 1 
  },

  // Status
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },

  // Error tracking
  lastError: {
    steam: { type: String },
    steamSpy: { type: String },
    timestamp: { type: Date }
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'games' // Explicitly set collection name
});

// Indexes for better query performance
GameSchema.index({ 'priceAnalysis.priceCategory': 1, overallScore: -1 });
GameSchema.index({ 'playerAnalysis.playerEngagement': 1, overallScore: -1 });
GameSchema.index({ 'marketAnalysis.marketPosition': 1, overallScore: -1 });
GameSchema.index({ 'reviewAnalysis.reviewCategory': 1, overallScore: -1 });
GameSchema.index({ genres: 1, overallScore: -1 });
GameSchema.index({ 'priceAnalysis.currentPrice': 1 });
GameSchema.index({ 'playerAnalysis.currentPlayers': -1 });
GameSchema.index({ 'marketAnalysis.ownershipRange.average': -1 });

// Text search index
GameSchema.index({ 
  name: 'text', 
  developer: 'text', 
  publisher: 'text',
  genres: 'text'
});

// Virtual for formatted price
GameSchema.virtual('formattedPrice').get(function() {
  if (this.priceAnalysis?.currentPrice) {
    return `$${(this.priceAnalysis.currentPrice / 100).toFixed(2)}`;
  }
  return 'Free';
});

// Virtual for formatted playtime
GameSchema.virtual('formattedPlaytime').get(function() {
  if (this.playerAnalysis?.averageForever) {
    const hours = Math.floor(this.playerAnalysis.averageForever / 60);
    const minutes = this.playerAnalysis.averageForever % 60;
    return `${hours}h ${minutes}m`;
  }
  return '0h 0m';
});

// Method to update analysis
GameSchema.methods.updateAnalysis = function(analysisData: any) {
  this.priceAnalysis = analysisData.price;
  this.playerAnalysis = analysisData.players;
  this.marketAnalysis = analysisData.market;
  this.reviewAnalysis = analysisData.reviews;
  this.tags = analysisData.tags;
  this.genres = analysisData.genres;
  this.languages = analysisData.languages;
  this.overallScore = analysisData.overallScore;
  this.recommendations = analysisData.recommendations;
  this.optimalPricing = analysisData.optimalPricing;
  this.lastAnalyzed = new Date();
  this.analysisCount += 1;
};

// Static method to find games by criteria
GameSchema.statics.findByCriteria = function(criteria: any) {
  const query: any = { isActive: true };
  
  if (criteria.priceRange) {
    query['priceAnalysis.priceRange'] = criteria.priceRange;
  }
  
  if (criteria.genre) {
    query.genres = { $in: [criteria.genre] };
  }
  
  if (criteria.minScore) {
    query.overallScore = { $gte: criteria.minScore };
  }
  
  if (criteria.maxPrice) {
    query['priceAnalysis.currentPrice'] = { $lte: criteria.maxPrice * 100 };
  }
  
  return this.find(query).sort({ overallScore: -1 });
};

// Interface for TypeScript
export interface IGame extends Document {
  appId: number;
  name: string;
  developer?: string;
  publisher?: string;
  steamData?: any;
  steamSpyData?: any;
  priceAnalysis?: any;
  playerAnalysis?: any;
  marketAnalysis?: any;
  reviewAnalysis?: any;
  tags: Array<{ name: string; votes: number }>;
  genres: string[];
  languages: string[];
  overallScore: number;
  recommendations: string[];
  optimalPricing?: any;
  dataSources: {
    steam: boolean;
    steamSpy: boolean;
  };
  lastAnalyzed: Date;
  analysisCount: number;
  isActive: boolean;
  lastError?: {
    steam?: string;
    steamSpy?: string;
    timestamp?: Date;
  };
  updateAnalysis: (analysisData: any) => void;
  formattedPrice: string;
  formattedPlaytime: string;
}

// Static methods interface
export interface IGameModel extends mongoose.Model<IGame> {
  findByCriteria: (criteria: any) => Promise<IGame[]>;
}

const Game = mongoose.model<IGame, IGameModel>('Game', GameSchema);

export default Game; 