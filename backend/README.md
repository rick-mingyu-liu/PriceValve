# PriceValve Backend API

A streamlined Express.js backend for Steam game data analysis using SteamSpy and Steam Review APIs. This is a pure in-memory data fetching service with no database operations.

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

### Analyze Game

```http
POST /api/analyze
```

**Request Body:**

```json
{
  "appId": 730
}
```

**Optional Parameters:**

```json
{
  "appId": 730,
  "options": {
    "includeReviews": true,
    "includeSalesHistory": true,
    "forceRefresh": false
  }
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server
│   ├── routes/
│   │   └── analyze.ts         # Analysis routes
│   ├── controllers/
│   │   └── gameController.ts  # Game analysis controller
│   ├── services/
│   │   ├── dataFetchingService.ts    # Core data fetching logic
│   │   ├── gameDataService.ts        # Game data service
│   │   ├── steamSpyApi.ts            # SteamSpy API integration
│   │   └── steamReviewApi.ts         # Steam Review API integration
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
  "appId": 730,
  "message": "Game analysis completed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response Example

```json
{
  "success": false,
  "error": "App not found in SteamSpy database",
  "appId": 999999,
  "message": "Failed to analyze game",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🧠 In-Memory Architecture

This backend is designed for **in-memory processing** with the following characteristics:

### ✅ **No Database Dependencies**

- No MongoDB, Redis, or any database connections
- All data processing happens in memory during the request
- No data persistence between requests

### ⚡ **Fast Response Times**

- In-memory caching for 5 minutes per game
- Parallel API calls to SteamSpy and Steam Review APIs
- No database query overhead

### 🔄 **Stateless Design**

- Each request is independent
- No session management or user state
- Perfect for horizontal scaling

### 📊 **Real-time Data**

- Always fetches fresh data from external APIs
- No stale database records
- Up-to-date pricing and review information

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented)

### API Testing

Use the included Postman collection: `PriceValve-API.postman_collection.json`

## 📈 Performance

- **Response Time**: ~2-5 seconds per game analysis
- **Cache Duration**: 5 minutes per game
- **Rate Limiting**: Respects external API limits
- **Memory Usage**: Minimal, scales with concurrent requests

## 🔒 Security

- CORS enabled for frontend integration
- Input validation on all endpoints
- Error handling without exposing internal details
- No authentication required (public API)

## 🚀 Deployment

The backend is ready for deployment to any Node.js hosting platform:

- **Vercel**: Zero-config deployment
- **Heroku**: Simple git push deployment
- **AWS Lambda**: Serverless deployment
- **Docker**: Containerized deployment

No database setup required!
