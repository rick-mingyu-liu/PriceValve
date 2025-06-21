# PriceValve Backend API

A comprehensive Express.js backend for Steam game data analysis using SteamSpy and Steam Review APIs.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your MongoDB URI

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

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/pricevalve

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
  "includeReviews": true,
  "uploadToDb": true
}
```

**Multiple Games:**
```json
{
  "type": "multiple",
  "appIds": [730, 570, 440],
  "includeReviews": true,
  "uploadToDb": true
}
```

**Trending Games:**
```json
{
  "type": "trending",
  "limit": 10,
  "includeReviews": true,
  "uploadToDb": true
}
```

**Search Games:**
```json
{
  "type": "search",
  "query": "counter-strike",
  "limit": 5,
  "includeReviews": true,
  "uploadToDb": true
}
```

**Games by Genre:**
```json
{
  "type": "genre",
  "query": "Action",
  "limit": 10,
  "includeReviews": true,
  "uploadToDb": true
}
```

**Games by Tag:**
```json
{
  "type": "tag",
  "query": "Multiplayer",
  "limit": 10,
  "includeReviews": true,
  "uploadToDb": true
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
│   │   ├── gameDataService.ts        # Combined fetch and upload service
│   │   ├── mongoUploadService.ts     # MongoDB upload operations
│   │   ├── steamSpyApi.ts            # SteamSpy API integration
│   │   ├── steamReviewApi.ts         # Steam Review API integration
│   │   └── gameService.ts            # Game data operations
│   ├── models/
│   │   └── Game.ts                   # Game data model
│   ├── middleware/
│   │   └── errorHandler.ts           # Error handling middleware
│   ├── types/
│   │   ├── index.ts                  # Main type exports
│   │   ├── game.ts                   # Game data types
│   │   └── steamSpy.ts               # SteamSpy API types
│   ├── config/
│   │   └── database.ts               # Database configuration
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
    "owners": "100,000,000 .. 200,000,000",
    "averagePlaytime": 32383,
    "discountPercent": "0",
    "reviewScore": 8,
    "reviewScoreDesc": "Very Positive",
    "totalReviews": 4551682,
    "totalPositive": 3920527,
    "totalNegative": 631155
  },
  "sources": {
    "steamSpy": true,
    "steamReview": true
  },
  "timestamp": "2025-06-21T23:45:13.962Z",
  "message": "Game data fetched successfully"
}
```

## 🗄️ Database Schema

The Game model includes comprehensive game data:

```typescript
interface Game {
  appId: number;
  name: string;
  isFree: boolean;
  price: string;
  tags: string[];
  salesHistory: SalesHistory[];
  developer: string;
  publisher: string;
  owners: string;
  averagePlaytime: number;
  discountPercent: string;
  steamReview: {
    reviewScore: number;
    reviewScoreDesc: string;
    totalReviews: number;
    totalPositive: number;
    totalNegative: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t pricevalve-backend .

# Run container
docker run -p 5001:5001 --env-file .env pricevalve-backend
```

### Docker Compose
```bash
# Start with MongoDB
docker-compose up -d
```

## 📝 Testing

Use the provided Postman collection:
1. Import `PriceValve-API.postman_collection.json`
2. Set up environment variables
3. Test all endpoints

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