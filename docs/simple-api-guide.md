# PriceValve Simplified API Guide

## Overview

The PriceValve API has been simplified to use **one main endpoint** for all data fetching operations. This eliminates the need for multiple small API calls and provides a cleaner, more efficient interface.

## 🚀 Quick Start

### Start the Server
```bash
cd backend
npm run dev
```

### Test the API
```bash
cd backend
node test-simple-api.js
```

## 📊 Main Endpoint

### `POST /api/data/fetch`

This is the **single endpoint** that handles all data fetching operations. You specify the type of operation in the request body.

#### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Operation type: `single`, `multiple`, `trending`, `search` |
| `appId` | number | For `single` | Steam App ID (e.g., 730 for CS2) |
| `appIds` | number[] | For `multiple` | Array of Steam App IDs |
| `query` | string | For `search` | Search term |
| `limit` | number | For `trending`/`search` | Number of results (default: 20) |
| `includeReviews` | boolean | No | Include review data (default: true) |
| `includePlayerCount` | boolean | No | Include player count (default: true) |
| `includeSalesHistory` | boolean | No | Include sales history (default: true) |

## 🎮 API Examples

### 1. Fetch Single Game

```bash
curl -X POST http://localhost:5000/api/data/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "single",
    "appId": 730,
    "includeReviews": true,
    "includePlayerCount": true,
    "includeSalesHistory": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "appId": 730,
    "name": "Counter-Strike 2",
    "isFree": false,
    "price": 0,
    "developer": "Valve",
    "publisher": "Valve",
    "tags": ["FPS", "Shooter", "Multiplayer"],
    "owners": "50,000,000 .. 100,000,000",
    "averagePlaytime": 150,
    "reviewScore": 85,
    "totalReviews": 500000,
    "shortDescription": "Counter-Strike 2 is the largest technical leap forward...",
    "salesHistory": [...]
  },
  "sources": {
    "steam": true,
    "steamSpy": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Game data fetched successfully"
}
```

### 2. Fetch Multiple Games

```bash
curl -X POST http://localhost:5000/api/data/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "multiple",
    "appIds": [730, 570, 440],
    "includeReviews": true,
    "includeSalesHistory": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "games": [...],
    "failed": [...],
    "summary": {
      "total": 3,
      "successful": 3,
      "failed": 0
    }
  },
  "message": "Fetched data for 3 games, 0 failed"
}
```

### 3. Fetch Trending Games

```bash
curl -X POST http://localhost:5000/api/data/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trending",
    "limit": 10
  }'
```

### 4. Search Games

```bash
curl -X POST http://localhost:5000/api/data/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "search",
    "query": "counter-strike",
    "limit": 5
  }'
```

## 🔧 Additional Endpoints

### `GET /api/data/status`
Get system status and API health.

```bash
curl http://localhost:5000/api/data/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "server": {
      "status": "running",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "version": "1.0.0"
    },
    "apis": {
      "steam": true,
      "steamSpy": true
    },
    "cache": {
      "size": 15,
      "entries": [...]
    },
    "lastTest": "2024-01-15T10:30:00.000Z"
  },
  "message": "System status retrieved successfully"
}
```

### `DELETE /api/data/cache`
Clear the cache.

```bash
curl -X DELETE http://localhost:5000/api/data/cache
```

### `GET /api/health`
Basic health check.

```bash
curl http://localhost:5000/api/health
```

## 🎯 JavaScript/Node.js Examples

### Using Axios

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Fetch single game
async function fetchGame(appId) {
  const response = await axios.post(`${API_BASE}/data/fetch`, {
    type: 'single',
    appId: appId,
    includeReviews: true,
    includeSalesHistory: true
  });
  
  return response.data;
}

// Fetch multiple games
async function fetchMultipleGames(appIds) {
  const response = await axios.post(`${API_BASE}/data/fetch`, {
    type: 'multiple',
    appIds: appIds,
    includeReviews: true
  });
  
  return response.data;
}

// Get trending games
async function getTrendingGames(limit = 20) {
  const response = await axios.post(`${API_BASE}/data/fetch`, {
    type: 'trending',
    limit: limit
  });
  
  return response.data;
}

// Search games
async function searchGames(query, limit = 10) {
  const response = await axios.post(`${API_BASE}/data/fetch`, {
    type: 'search',
    query: query,
    limit: limit
  });
  
  return response.data;
}
```

### Using Fetch (Frontend)

```javascript
// Fetch single game
async function fetchGame(appId) {
  const response = await fetch('http://localhost:5000/api/data/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'single',
      appId: appId,
      includeReviews: true,
      includeSalesHistory: true
    })
  });
  
  return response.json();
}

// Usage
fetchGame(730).then(data => {
  if (data.success) {
    console.log('Game:', data.data.name);
  }
});
```

## 🎮 Popular Game App IDs

| Game | App ID | Description |
|------|--------|-------------|
| Counter-Strike 2 | 730 | Popular FPS game |
| Dota 2 | 570 | MOBA game |
| Team Fortress 2 | 440 | Team-based FPS |
| Grand Theft Auto V | 271590 | Open-world action |
| The Witcher 3 | 292030 | RPG |
| Red Dead Redemption 2 | 1174180 | Western action-adventure |
| Cyberpunk 2077 | 1091500 | Sci-fi RPG |
| Elden Ring | 1245620 | Action RPG |
| Baldur's Gate 3 | 1086940 | CRPG |
| Stardew Valley | 413150 | Farming simulator |

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

Common error scenarios:
- **Invalid type**: Type must be `single`, `multiple`, `trending`, or `search`
- **Missing parameters**: Required parameters not provided
- **Invalid App ID**: App ID must be a valid number
- **API errors**: Steam/SteamSpy API issues
- **Server errors**: Internal server errors (500 status)

## 🔄 Caching

- **Cache Duration**: 5 minutes by default
- **Cache Keys**: Based on app ID and fetch options
- **Cache Management**: Use `/api/data/status` to check cache stats
- **Cache Clearing**: Use `DELETE /api/data/cache` to clear cache

## 📊 Performance Tips

1. **Use appropriate types**: Choose the right operation type for your needs
2. **Batch requests**: Use `multiple` type for multiple games instead of individual calls
3. **Limit data**: Only request the data you need using the include flags
4. **Use cache**: The system automatically caches results for 5 minutes
5. **Monitor status**: Check `/api/data/status` to monitor API health

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd backend
node test-simple-api.js
```

This will test all API functionality and provide detailed output.

---

**Happy data fetching! 🎮📊** 