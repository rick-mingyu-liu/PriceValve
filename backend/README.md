# PriceValve Backend API

A comprehensive Express.js backend for Steam game pricing optimization with full Steam Web API integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your Steam API key

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Steam Web API (Required for user games endpoint)
STEAM_API_KEY=your_steam_api_key_here

# Database Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/pricevalve

# Redis Configuration (if using Redis)
REDIS_URL=redis://localhost:6379

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# Optional: Logging
LOG_LEVEL=info
```

## 🎮 Steam Web API Integration

### Getting a Steam API Key

1. Visit [Steam Community](https://steamcommunity.com/dev/apikey)
2. Sign in with your Steam account
3. Accept the terms and generate an API key
4. Add the key to your `.env` file

### Steam API Service Features

The `SteamApiService` class provides:

- **Rate Limiting**: Automatic rate limiting to respect Steam API limits
- **Error Handling**: Comprehensive error handling with retry logic
- **Type Safety**: Full TypeScript support with detailed interfaces
- **Multiple Endpoints**: Support for Store API and Community API

### Available Steam API Methods

```typescript
// Get detailed app information
await steamApiService.getAppDetails(appId: number)

// Get current player count
await steamApiService.getPlayerCount(appId: number)

// Get review summary
await steamApiService.getReviewSummary(appId: number)

// Get user's owned games (requires API key)
await steamApiService.getUserGames(steamId: string, includeAppInfo?: boolean)

// Get list of all Steam apps
await steamApiService.getAppList()

// Find similar games
await steamApiService.findSimilarGames(appId: number, limit?: number)

// Get rate limit information
steamApiService.getRateLimitInfo()

// Check if API key is configured
steamApiService.isApiKeyConfigured()
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Steam Game Details
```http
GET /api/steam/app/:appId
```
Get comprehensive game information including price, reviews, categories, etc.

### User's Games
```http
GET /api/steam/games/:steamId?includeAppInfo=true
```
Get user's owned games (requires Steam API key)

### Competitor Analysis
```http
GET /api/steam/competitors/:appId?limit=10
```
Find similar/competitor games based on categories and genres

### Player Statistics
```http
GET /api/steam/players/:appId
```
Get current player count for a game

### Review Data
```http
GET /api/steam/reviews/:appId
```
Get review summary and scores

### Rate Limit Information
```http
GET /api/steam/rate-limits
```
Get current rate limit status for Steam APIs

### Legacy Endpoints (Backward Compatibility)

```http
GET /api/steam/game/:appId      # Basic game details
GET /api/steam/user/:steamId    # User profile
GET /api/steam/price/:appId     # Price data only
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server
│   ├── routes/
│   │   └── steam.ts           # Steam API routes
│   ├── services/
│   │   ├── steamApi.ts        # Comprehensive Steam API service
│   │   └── steamService.ts    # Legacy Steam service
│   ├── middleware/
│   │   └── errorHandler.ts    # Error handling middleware
│   ├── types/
│   │   ├── index.ts           # Main type exports
│   │   └── steam.ts           # Steam API types
│   └── utils/
│       └── helpers.ts         # Utility functions
├── env.example                # Environment variables template
├── package.json               # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🔄 Rate Limiting

The Steam API service includes automatic rate limiting:

- **Store API**: 100 requests per minute
- **Community API**: 100 requests per minute
- **Player Count API**: 50 requests per minute

Rate limits are tracked automatically and requests are queued when limits are reached.

## 📊 Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🛠️ Development

### Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm test             # Run tests (if configured)
```

### Adding New Steam API Endpoints

1. Add the method to `SteamApiService` in `src/services/steamApi.ts`
2. Add corresponding types in `src/types/steam.ts`
3. Add the route in `src/routes/steam.ts`
4. Update this README with the new endpoint

### Error Handling

The service includes comprehensive error handling:

- Network timeouts (10 seconds)
- Rate limit detection and handling
- Invalid API key detection
- Malformed response handling

## 🔗 Steam Web API Documentation

- [Steam Store API](https://store.steampowered.com/api/)
- [Steam Community API](https://api.steampowered.com/)
- [Steam Web API Wiki](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [Rate Limiting](https://developer.valvesoftware.com/wiki/Steam_Web_API#Rate_Limiting)

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:

- `STEAM_API_KEY` (required for user games endpoint)
- `PORT` (default: 5001)
- `NODE_ENV=production`
- `FRONTEND_URL` (your frontend URL for CORS)

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5001
CMD ["node", "dist/server.js"]
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types for new features
3. Include error handling for all API calls
4. Update this README for new endpoints
5. Test with the Steam Web API

## 📄 License

This project is licensed under the ISC License. 