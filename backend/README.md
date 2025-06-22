# PriceValve Backend API

A comprehensive Express.js backend for Steam game data analysis using SteamSpy and Steam Review APIs. This is a pure data fetching service with no database operations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

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

# Redis Configuration (optional, for caching)
REDIS_URL=redis://localhost:6379

# Optional: Logging
LOG_LEVEL=info
```

## 🎮 API Integration

### SteamSpy API
- **No API key required** - Public API
- Provides game statistics, ownership data, and sales history
- Rate limited to reasonable usage

### Steam Review API
- **No API key required** - Public API  
- Provides review scores and sentiment analysis
- Rate limited to reasonable usage

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Fetch Game Data
```http
POST /api/fetch
```

**Request Body Examples:**

**Single Game:**
```json
{
  "type": "single",
  "appId": 730,
  "includeReviews": true
}
```

**Multiple Games:**
```json
{
  "type": "multiple",
  "appIds": [730, 570, 440],
  "includeReviews": true
}
```

**Trending Games:**
```json
{
  "type": "trending",
  "limit": 10,
  "includeReviews": true
}
```

**Search Games:**
```json
{
  "type": "search",
  "query": "counter-strike",
  "limit": 5,
  "includeReviews": true
}
```

**Games by Genre:**
```json
{
  "type": "genre",
  "genre": "Action",
  "limit": 10,
  "includeReviews": true
}
```

**Games by Tag:**
```json
{
  "type": "tag",
  "tag": "Multiplayer",
  "limit": 10,
  "includeReviews": true
}
```

### Clear Cache
```http
DELETE /api/cache
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server
│   ├── routes/
│   │   └── apiRoutes.ts       # Main API routes
│   ├── controllers/
│   │   └── apiController.ts   # API controller logic
│   ├── services/
│   │   ├── dataFetchingService.ts    # Core data fetching logic
│   │   ├── gameDataService.ts        # Game data service
│   │   ├── steamSpyApi.ts            # SteamSpy API integration
│   │   ├── steamReviewApi.ts         # Steam Review API integration
│   │   └── gameService.ts            # Game data operations
│   ├── middleware/
│   │   └── errorHandler.ts           # Error handling middleware
│   ├── types/
│   │   ├── index.ts                  # Main type exports
│   │   ├── game.ts                   # Game data types
│   │   └── steamSpy.ts               # SteamSpy API types
│   └── utils/
│       └── helpers.ts                # Utility functions
├── PriceValve-API.postman_collection.json  # Postman collection
├── API-README.md                          # Detailed API documentation
├── package.json                           # Dependencies and scripts
└── tsconfig.json                         # TypeScript configuration
```

## 📊 Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}
```

### Success Response Example
```json
{
  "success": true,
  "data": {
    "appId": 730,
    "name": "Counter-Strike: Global Offensive",
    "isFree": false,
    "price": "0",
    "tags": ["FPS", "Shooter", "Multiplayer"],
    "salesHistory": [...],
    "developer": "Valve",
    "publisher": "Valve",
    "reviewScore": 88,
    "reviewScoreDesc": "Very Positive",
    "owners": "50,000,000 .. 100,000,000",
    "averagePlaytime": 120
  },
  "message": "Game data fetched successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response Example
```json
{
  "success": false,
  "error": "Game not found",
  "message": "Failed to fetch game data",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔄 Fetch Options

The `options` parameter in fetch requests supports:

```typescript
interface FetchOptions {
  includeReviews?: boolean;      // Include Steam review data
  includeSalesHistory?: boolean; // Include sales history data
}
```

## 📈 Data Sources

### SteamSpy Data
- Game metadata (name, developer, publisher)
- Ownership statistics
- Price information
- Tags and genres
- Sales history (if available)

### Steam Review Data
- Review scores (0-100)
- Review categories (Overwhelmingly Positive, Very Positive, etc.)
- Sentiment analysis

## 🚀 Performance Features

- **Caching**: Redis-based caching for API responses
- **Rate Limiting**: Built-in delays between API calls
- **Batch Processing**: Efficient handling of multiple games
- **Error Handling**: Graceful handling of API failures

## 🧪 Testing

Test the API using the provided Postman collection:

1. Import `PriceValve-API.postman_collection.json`
2. Set the base URL to `http://localhost:5001`
3. Try different fetch types and parameters

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## 📝 Notes

- This is a pure data fetching service with no database operations
- All data is fetched in real-time from external APIs
- Caching is used to improve performance and reduce API calls
- The service is designed to be stateless and scalable 