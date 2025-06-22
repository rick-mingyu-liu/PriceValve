# PriceValve API Documentation

## Overview

The PriceValve API provides comprehensive game analysis by integrating data from multiple sources:

- **Steam Web API**: Game details, pricing, and metadata
- **SteamSpy API**: Market data, ownership statistics, and player metrics
- **IsThereAnyDeal API**: Price history, deals, and cross-store pricing
- **Price Optimizer**: Mathematical models for price prediction and optimization

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and configure API keys:

```bash
cp env.example .env
```

3. Get your IsThereAnyDeal API key from: https://isthereanydeal.com/apps/

4. Start the server:

```bash
npm run dev
```

## API Endpoints

### Base URL

```
http://localhost:5001/api
```

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**

```json
{
  "success": true,
  "message": "PriceValve API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Game Analysis

#### Single Game Analysis

**POST** `/analyze`

Analyze a single game with comprehensive data from all APIs.

**Request Body:**

```json
{
  "appId": 730
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "appId": 730,
    "name": "Counter-Strike 2",
    "steamData": {
      /* Steam game details */
    },
    "steamSpyData": {
      /* SteamSpy market data */
    },
    "itadData": {
      /* Price history and deals */
    },
    "priceAnalysis": {
      "currentPrice": 1999,
      "recommendedPrice": 1799,
      "priceConfidence": 75,
      "demandScore": 65,
      "competitionScore": 70,
      "marketTrend": "neutral",
      "priceHistory": {
        "lowestPrice": 999,
        "highestPrice": 2999,
        "averagePrice": 1999,
        "priceVolatility": 500,
        "priceTrend": "stable"
      },
      "factors": {
        "popularity": 0.6,
        "reviewScore": 0.75,
        "age": 0.8,
        "genreCompetition": 0.7,
        "seasonalDemand": 1.0,
        "priceElasticity": -0.8
      },
      "recommendations": [
        "Consider lowering price - demand appears elastic",
        "Monitor competitor pricing in the same genre"
      ]
    },
    "timestamp": "2024-01-01T00:00:00.000Z",
    "success": true
  }
}
```

#### Batch Game Analysis

**POST** `/analyze/batch`

Analyze multiple games in a single request (max 10 games).

**Request Body:**

```json
{
  "appIds": [730, 570, 440],
  "options": {
    "includeSteamData": true,
    "includeSteamSpyData": true,
    "includeITADData": true,
    "includePriceAnalysis": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      /* Analysis for each game */
    }
  ],
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  }
}
```

### Search and Discovery

#### Search Games

**GET** `/search?query=portal&limit=20`

Search for games on Steam.

**Query Parameters:**

- `query` (required): Search term
- `limit` (optional): Number of results (default: 20, max: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "games": [
      {
        "appId": 400,
        "name": "Portal",
        "price": 999,
        "originalPrice": 999,
        "discountPercent": 0,
        "headerImage": "https://..."
      }
    ],
    "total": 1,
    "query": "portal"
  }
}
```

#### Featured Games

**GET** `/featured`

Get featured games and deals from Steam.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "appId": 730,
      "name": "Counter-Strike 2",
      "price": 1999,
      "originalPrice": 1999,
      "discountPercent": 0,
      "headerImage": "https://..."
    }
  ]
}
```

#### Top Games

**GET** `/top-games?criteria=top100in2weeks`

Get top games from SteamSpy.

**Query Parameters:**

- `criteria` (optional): One of `top100in2weeks`, `top100forever`, `top100owned` (default: `top100in2weeks`)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "appId": 730,
      "name": "Counter-Strike 2",
      "scoreRank": "1",
      "positive": 1000000,
      "negative": 50000,
      "userscore": 85,
      "owners": "20,000,000 .. 50,000,000",
      "averageForever": 120,
      "average2Weeks": 15,
      "price": "1999",
      "discount": "0",
      "genre": "Action"
    }
  ]
}
```

#### Genres

**GET** `/genres`

Get all genres with their top games.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "genre": "Action",
      "games": [
        /* Top games in Action genre */
      ]
    }
  ]
}
```

#### Games by Genre

**GET** `/genres/action`

Get games filtered by specific genre.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "appId": 730,
      "name": "Counter-Strike 2",
      "genre": "Action"
      /* ... other fields */
    }
  ]
}
```

### Individual Data Sources

#### Steam Data

**GET** `/steam/730`

Get detailed Steam data for a specific game.

**Response:**

```json
{
  "success": true,
  "data": {
    "appId": 730,
    "name": "Counter-Strike 2",
    "isFree": false,
    "price": 1999,
    "developer": "Valve",
    "publisher": "Valve",
    "genres": ["Action", "FPS"],
    "releaseDate": "2012-08-21",
    "headerImage": "https://..."
    /* ... more fields */
  }
}
```

#### SteamSpy Data

**GET** `/steamspy/730`

Get SteamSpy market data for a specific game.

**Response:**

```json
{
  "success": true,
  "data": {
    "appId": 730,
    "name": "Counter-Strike 2",
    "developer": "Valve",
    "publisher": "Valve",
    "scoreRank": "1",
    "positive": 1000000,
    "negative": 50000,
    "owners": "20,000,000 .. 50,000,000",
    "averageForever": 120,
    "average2Weeks": 15
    /* ... more fields */
  }
}
```

## Data Models

### SteamGameDetails

```typescript
interface SteamGameDetails {
  appId: number;
  name: string;
  isFree: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  developer: string;
  publisher: string;
  tags: string[];
  categories: string[];
  releaseDate: string;
  metacritic?: {
    score: number;
    url: string;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  genres: string[];
  description: string;
  headerImage: string;
  screenshots: string[];
  movies: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: { "480": string; max: string };
    mp4: { "480": string; max: string };
  }>;
  background: string;
}
```

### SteamSpyGameData

```typescript
interface SteamSpyGameData {
  appId: number;
  name: string;
  developer: string;
  publisher: string;
  scoreRank: string;
  positive: number;
  negative: number;
  userscore: number;
  owners: string;
  averageForever: number;
  average2Weeks: number;
  medianForever: number;
  median2Weeks: number;
  price: string;
  initialPrice: string;
  discount: string;
  languages: string;
  genre: string;
  tags: { [key: string]: number };
  releaseDate: string;
  lastUpdated: string;
}
```

### PriceAnalysis

```typescript
interface PriceAnalysis {
  appId: number;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  priceConfidence: number;
  demandScore: number;
  competitionScore: number;
  marketTrend: "bullish" | "bearish" | "neutral";
  priceHistory: {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    priceVolatility: number;
    priceTrend: "increasing" | "decreasing" | "stable";
  };
  factors: {
    popularity: number;
    reviewScore: number;
    age: number;
    genreCompetition: number;
    seasonalDemand: number;
    priceElasticity: number;
  };
  recommendations: string[];
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing parameters, invalid data)
- `404`: Not Found (game not found)
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per 15-minute window per IP
- Batch requests are limited to 10 games per request
- Individual API calls have timeouts (10-15 seconds)

## Caching

The API includes caching for frequently requested data:

- Steam data: 1 hour
- SteamSpy data: 1 hour
- ITAD data: 1 hour
- Analysis results: 30 minutes

## Mathematical Models

The price optimizer uses several mathematical models:

### Price Elasticity

Calculates how demand changes with price changes using historical data.

### Demand Curve Analysis

Generates demand curves to find revenue-maximizing price points.

### Market Trend Analysis

Uses linear regression to determine price trends (increasing/decreasing/stable).

### Popularity Scoring

Weighted combination of:

- Owner count (30%)
- Review ratio (25%)
- Average playtime (25%)
- Recent activity (20%)

### Competition Analysis

Evaluates market competition based on:

- Genre overlap
- Price range competition
- Market saturation

## Examples

### JavaScript/Node.js

```javascript
const axios = require("axios");

// Analyze a game
const analyzeGame = async (appId) => {
  try {
    const response = await axios.post("http://localhost:5001/api/analyze", {
      appId: appId,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};

// Search for games
const searchGames = async (query) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/search?query=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};

// Get top games
const getTopGames = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/top-games");
    return response.data;
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

### Python

```python
import requests

# Analyze a game
def analyze_game(app_id):
    try:
        response = requests.post('http://localhost:5001/api/analyze',
                               json={'appId': app_id})
        return response.json()
    except Exception as e:
        print(f'Error: {e}')

# Search for games
def search_games(query):
    try:
        response = requests.get(f'http://localhost:5001/api/search?query={query}')
        return response.json()
    except Exception as e:
        print(f'Error: {e}')
```

### cURL

```bash
# Analyze a game
curl -X POST http://localhost:5001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"appId": 730}'

# Search for games
curl "http://localhost:5001/api/search?query=portal&limit=10"

# Get top games
curl "http://localhost:5001/api/top-games?criteria=top100in2weeks"

# Health check
curl http://localhost:5001/api/health
```

## Troubleshooting

### Common Issues

1. **API Key Missing**: Ensure `ITAD_API_KEY` is set in your `.env` file
2. **Rate Limiting**: Reduce request frequency if hitting rate limits
3. **Game Not Found**: Some games may not be available in all APIs
4. **Timeout Errors**: Increase timeout values for slow connections

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your `.env` file.

### API Status

Check the health endpoint to verify API status:

```bash
curl http://localhost:5001/api/health
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
