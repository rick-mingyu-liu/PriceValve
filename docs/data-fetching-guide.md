# Data Fetching Guide for PriceValve

## Overview

This guide explains how to use the data fetching functionality in PriceValve, which integrates Steam and SteamSpy APIs to fetch comprehensive game data.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3001`

### 2. Test the API

Use the provided test script:

```bash
cd backend
node test-data-fetching.js
```

### 3. Use the Frontend Demo

Add the demo component to your frontend:

```tsx
import DataFetchingDemo from './components/DataFetchingDemo';

// In your page component
<DataFetchingDemo apiUrl="http://localhost:3001/api" />
```

## 📊 API Endpoints

### Core Data Fetching

#### `GET /api/data/game/:appId`
Fetch comprehensive data for a single game.

**Parameters:**
- `appId` (path): Steam App ID (e.g., 730 for Counter-Strike 2)
- `includeReviews` (query): Include review data (default: false)
- `includePlayerCount` (query): Include current player count (default: false)
- `includeSalesHistory` (query): Include sales history (default: false)
- `forceRefresh` (query): Bypass cache (default: false)

**Example:**
```bash
curl "http://localhost:3001/api/data/game/730?includeReviews=true&includeSalesHistory=true"
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
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `POST /api/data/games`
Fetch data for multiple games in batch.

**Request Body:**
```json
{
  "appIds": [730, 570, 440],
  "includeReviews": true,
  "includePlayerCount": true,
  "includeSalesHistory": true,
  "forceRefresh": false
}
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
  }
}
```

### Discovery & Search

#### `GET /api/data/trending`
Get trending games from SteamSpy.

**Parameters:**
- `limit` (query): Number of games to return (1-100, default: 20)

**Example:**
```bash
curl "http://localhost:3001/api/data/trending?limit=10"
```

#### `GET /api/data/search`
Search for games by name.

**Parameters:**
- `query` (query): Search term
- `limit` (query): Number of results (1-50, default: 10)

**Example:**
```bash
curl "http://localhost:3001/api/data/search?query=counter-strike&limit=5"
```

### Cache Management

#### `GET /api/data/cache/stats`
Get cache statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "size": 15,
    "entries": [
      {
        "appId": 730,
        "age": 120000
      }
    ]
  }
}
```

#### `DELETE /api/data/cache`
Clear the cache.

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

### System Status

#### `GET /api/data/status`
Get data sources status and health.

**Response:**
```json
{
  "success": true,
  "data": {
    "steam": {
      "available": true,
      "lastTest": "2024-01-15T10:30:00.000Z",
      "error": null
    },
    "steamSpy": {
      "available": true,
      "lastTest": "2024-01-15T10:30:00.000Z",
      "error": null
    },
    "cache": {
      "size": 15,
      "entries": [...]
    }
  }
}
```

## 🎮 Popular Game App IDs

Here are some popular Steam games you can test with:

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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Steam API (optional but recommended)
STEAM_API_KEY=your_steam_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/pricevalve
```

### Getting a Steam API Key

1. Visit [Steam Community](https://steamcommunity.com/dev/apikey)
2. Sign in with your Steam account
3. Accept the terms and generate an API key
4. Add the key to your `.env` file

**Note:** The Steam API key is optional. The system will work without it, but some features may be limited.

## 📈 Data Model

The fetched data follows this structure:

```typescript
interface Game {
  appId: number;                    // Steam App ID
  name: string;                     // Game name
  isFree: boolean;                  // Is the game free?
  price: number;                    // Current price in USD
  discountPercent?: number;         // Current discount percentage
  releaseDate?: string;             // Release date
  developer?: string;               // Developer name
  publisher?: string;               // Publisher name
  tags: string[];                   // Game tags/categories
  
  // Player/Market Stats
  owners?: string;                  // Ownership range (e.g., "50,000 .. 100,000")
  averagePlaytime?: number;         // Average playtime in hours
  
  // Review Score
  reviewScore?: number;             // Review score percentage
  totalReviews?: number;            // Total number of reviews
  
  // Description
  shortDescription?: string;        // Game description
  
  // Sales History
  salesHistory: SalesDataPoint[];   // Historical sales data
}

interface SalesDataPoint {
  date: string;                     // ISO date
  owners: number;                   // Estimated owners
  volumeChange?: number;            // Change from previous day
}
```

## 🧪 Testing Examples

### Using cURL

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Fetch CS2 data
curl "http://localhost:3001/api/data/game/730?includeReviews=true"

# Fetch multiple games
curl -X POST http://localhost:3001/api/data/games \
  -H "Content-Type: application/json" \
  -d '{"appIds": [730, 570, 440], "includeReviews": true}'

# Get trending games
curl "http://localhost:3001/api/data/trending?limit=5"

# Check cache stats
curl http://localhost:3001/api/data/cache/stats
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testDataFetching() {
  try {
    // Fetch game data
    const response = await axios.get(`${API_BASE}/data/game/730`, {
      params: {
        includeReviews: true,
        includeSalesHistory: true
      }
    });
    
    console.log('Game data:', response.data);
    
    // Fetch multiple games
    const batchResponse = await axios.post(`${API_BASE}/data/games`, {
      appIds: [730, 570, 440],
      includeReviews: true
    });
    
    console.log('Batch data:', batchResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testDataFetching();
```

### Using Python

```python
import requests

API_BASE = 'http://localhost:3001/api'

def test_data_fetching():
    try:
        # Fetch game data
        response = requests.get(f'{API_BASE}/data/game/730', params={
            'includeReviews': True,
            'includeSalesHistory': True
        })
        
        if response.status_code == 200:
            data = response.json()
            print('Game data:', data['data']['name'])
        
        # Fetch multiple games
        batch_response = requests.post(f'{API_BASE}/data/games', json={
            'appIds': [730, 570, 440],
            'includeReviews': True
        })
        
        if batch_response.status_code == 200:
            batch_data = batch_response.json()
            print(f"Fetched {len(batch_data['data']['games'])} games")
            
    except requests.exceptions.RequestException as e:
        print('Error:', e)

test_data_fetching()
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message"
}
```

Common error scenarios:

- **Invalid App ID**: App ID must be a valid number
- **Game Not Found**: Game doesn't exist or is not available
- **API Rate Limits**: Too many requests to Steam/SteamSpy APIs
- **Network Errors**: Connection issues with external APIs
- **Server Errors**: Internal server errors (500 status)

## 🔄 Caching

The system implements intelligent caching:

- **Cache Duration**: 5 minutes by default
- **Cache Keys**: Based on app ID and fetch options
- **Cache Invalidation**: Automatic expiration or manual clearing
- **Cache Statistics**: Monitor cache usage and performance

## 📊 Performance Tips

1. **Use Batch Requests**: Fetch multiple games at once instead of individual requests
2. **Cache Wisely**: Use `forceRefresh=false` (default) to leverage caching
3. **Rate Limiting**: Respect API rate limits (built into the service)
4. **Selective Data**: Only request the data you need using query parameters

## 🔍 Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Check if port 3001 is available
   - Verify all dependencies are installed
   - Check environment variables

2. **API Errors**
   - Verify Steam API key is valid (if using)
   - Check network connectivity
   - Review rate limiting

3. **CORS Errors (Frontend)**
   - Ensure `FRONTEND_URL` is set correctly
   - Check if frontend is running on the expected port

4. **Data Not Loading**
   - Verify app ID is correct
   - Check if game exists on Steam
   - Review API response for error details

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

This will show detailed API requests and responses in the console.

## 📚 Next Steps

1. **Integrate with Frontend**: Use the demo component as a starting point
2. **Add Database Storage**: Store fetched data in MongoDB for persistence
3. **Implement Real-time Updates**: Set up WebSocket connections for live data
4. **Add Analytics**: Track usage patterns and performance metrics
5. **Expand Data Sources**: Add more game data APIs

---

**Happy data fetching! 🎮📊** 