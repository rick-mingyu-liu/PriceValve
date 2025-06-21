# PriceValve API - Simple & Clean

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
```

## 📊 API Endpoints

### 1. **POST /api/fetch** - Main Endpoint
This is the **only endpoint you need** for fetching data!

**Request Body:**
```json
{
  "type": "single|multiple|trending|search",
  "appId": 730,                    // For single game
  "appIds": [730, 570, 440],       // For multiple games
  "query": "counter-strike",       // For search
  "limit": 20,                     // For trending/search
  "includeReviews": true,          // Optional
  "includePlayerCount": true,      // Optional
  "includeSalesHistory": true      // Optional
}
```

### 2. **GET /api/health** - Health Check
Check if the API is running and APIs are working.

### 3. **DELETE /api/cache** - Clear Cache
Clear the data cache.

## 🎮 Examples

### Fetch Single Game (CS2)
```bash
curl -X POST http://localhost:5000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "single",
    "appId": 730,
    "includeReviews": true,
    "includeSalesHistory": true
  }'
```

### Fetch Multiple Games
```bash
curl -X POST http://localhost:5000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "multiple",
    "appIds": [730, 570, 440],
    "includeReviews": true
  }'
```

### Get Trending Games
```bash
curl -X POST http://localhost:5000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trending",
    "limit": 10
  }'
```

### Search Games
```bash
curl -X POST http://localhost:5000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "search",
    "query": "counter-strike",
    "limit": 5
  }'
```

## 🧪 Testing

### Run Tests
```bash
cd backend
node test-api.js
```

### Postman Collection
Import `PriceValve-API.postman_collection.json` into Postman for easy testing!

## 🎯 Popular Game IDs

| Game | App ID |
|------|--------|
| Counter-Strike 2 | 730 |
| Dota 2 | 570 |
| Team Fortress 2 | 440 |
| Grand Theft Auto V | 271590 |
| The Witcher 3 | 292030 |

## 📋 Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "sources": {
    "steam": true,
    "steamSpy": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Environment Variables

Create a `.env` file:
```env
PORT=5000
STEAM_API_KEY=your_steam_api_key_here
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/pricevalve
```

## 🚨 Error Handling

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

---

**That's it! Simple, clean, and ready for ML/clustering later! 🎮📊** 