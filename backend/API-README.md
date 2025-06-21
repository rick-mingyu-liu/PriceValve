# PriceValve API Documentation

## Overview

PriceValve API is a comprehensive game data service that fetches information from SteamSpy and Steam Review APIs, processes the data, and stores it in MongoDB for analysis and optimization purposes.

## Architecture

The API now uses two main data sources:
- **SteamSpy API**: Provides ownership data, playtime statistics, pricing information, and game metadata
- **Steam Review API**: Provides review scores, ratings, and user feedback

## Data Model

### Game Object Structure

```typescript
interface Game {
  appId: number;                    // Steam Application ID
  name: string;                     // Game name
  isFree: boolean;                  // Whether the game is free
  price: number;                    // Current price in USD
  discountPercent?: number;         // Current discount percentage
  releaseDate?: string;             // Release date
  developer?: string;               // Developer name
  publisher?: string;               // Publisher name
  tags: string[];                   // Game tags/genres

  // SteamSpy Data
  owners?: string;                  // Ownership range (e.g., "1,000,000 .. 2,000,000")
  averagePlaytime?: number;         // Average playtime in minutes

  // Steam Review Data
  reviewScore?: number;             // Review score (1-100)
  reviewScoreDesc?: string;         // Review description (e.g., "Very Positive")
  totalReviews?: number;            // Total number of reviews
  totalPositive?: number;           // Number of positive reviews
  totalNegative?: number;           // Number of negative reviews

  // Sales History
  salesHistory: SalesDataPoint[];   // Historical sales data
}

interface SalesDataPoint {
  date: string;                     // ISO date
  owners: number;                   // Estimated owners
  revenue?: number;                 // Estimated revenue
  volumeChange?: number;            // Change in ownership
}
```

## API Endpoints

### Main Data Fetching Endpoint

**POST** `/api/fetch`

This is the main endpoint that handles all data fetching operations. It can fetch single games, multiple games, trending games, search results, and more.

#### Request Body

```json
{
  "type": "single|multiple|trending|search|genre|tag",
  "appId": 730,                    // Required for single game
  "appIds": [730, 570, 440],       // Required for multiple games
  "query": "Counter-Strike",       // Required for search/genre/tag
  "includeReviews": true,          // Include review data
  "includeSalesHistory": true,     // Include sales history
  "uploadToDb": true,              // Upload to MongoDB
  "limit": 20                      // Limit results
}
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "name": "Counter-Strike 2",
    "appId": 730,
    "price": 0,
    "isFree": true,
    "reviewScore": 85,
    "reviewScoreDesc": "Very Positive",
    "owners": "50,000,000 .. 100,000,000",
    "averagePlaytime": 1200,
    "tags": ["FPS", "Multiplayer", "Action"],
    "salesHistory": [...]
  },
  "gameId": "mongodb_id_here",
  "isNew": false,
  "sources": {
    "steamSpy": true,
    "steamReview": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Game data fetched and uploaded successfully"
}
```

### Health Check

**GET** `/api/health`

Returns the health status of all services.

#### Response

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "dataFetching": true,
    "mongoUpload": true,
    "steamSpy": true,
    "steamReview": true
  },
  "stats": {
    "uploadStats": {
      "totalGames": 1500,
      "activeGames": 1450,
      "lastUpload": "2024-01-15T10:25:00.000Z",
      "averageAnalysisCount": 3.2
    },
    "cacheStats": {
      "size": 50,
      "entries": [...]
    }
  },
  "message": "All services are operational"
}
```

### Clear Cache

**DELETE** `/api/cache`

Clears all internal caches.

#### Response

```json
{
  "success": true,
  "message": "All caches cleared successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Usage Examples

### Fetch a Single Game

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "single",
    "appId": 730,
    "includeReviews": true,
    "includeSalesHistory": true,
    "uploadToDb": true
  }'
```

### Fetch Trending Games

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trending",
    "limit": 10,
    "includeReviews": true,
    "uploadToDb": true
  }'
```

### Search for Games

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "search",
    "query": "RPG",
    "limit": 5,
    "includeReviews": true,
    "uploadToDb": true
  }'
```

### Fetch Games by Genre

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "genre",
    "query": "Action",
    "limit": 10,
    "includeReviews": true,
    "uploadToDb": true
  }'
```

### Fetch Games by Tag

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tag",
    "query": "Multiplayer",
    "limit": 10,
    "includeReviews": true,
    "uploadToDb": true
  }'
```

### Fetch Multiple Games

```bash
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "type": "multiple",
    "appIds": [730, 570, 440, 578080],
    "includeReviews": true,
    "uploadToDb": true
  }'
```

## Services

### Data Fetching Service

Handles fetching data from SteamSpy and Steam Review APIs with rate limiting and caching.

**Key Features:**
- Rate limiting (1 request/second for SteamSpy, 1 request/second for Steam Review)
- Caching (5-minute cache duration)
- Error handling and retry logic
- Parallel data fetching from multiple sources

### MongoDB Upload Service

Handles uploading and updating game data in MongoDB with comprehensive analysis.

**Key Features:**
- Automatic game creation/update
- Data analysis and scoring
- Market position analysis
- Price optimization suggestions
- Player engagement metrics

### Game Data Service

Combines data fetching and MongoDB upload functionality into a single service.

**Key Features:**
- One-stop service for fetch-and-upload operations
- Batch processing capabilities
- Health monitoring
- Statistics and reporting

## Rate Limits

- **SteamSpy API**: 1 request per second (1 request per 60 seconds for 'all' requests)
- **Steam Review API**: 1 request per second recommended
- **MongoDB**: No specific limits, but includes delays between operations

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Failed to fetch game data",
  "message": "Game not found in SteamSpy database",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Common error scenarios:
- Game not found in SteamSpy database
- Game data hidden on developer request
- API rate limit exceeded
- Network connectivity issues
- MongoDB connection problems

## Testing

Use the provided test script to verify API functionality:

```bash
node test-new-services.js
```

This script tests all major endpoints and provides a comprehensive report of API health.

## Configuration

The API uses environment variables for configuration:

```env
MONGODB_URI=mongodb://localhost:27017/pricevalve
PORT=3000
NODE_ENV=development
```

## Data Sources

### SteamSpy API
- **Base URL**: https://steamspy.com/api.php
- **Documentation**: https://steamspy.com/api.php
- **Data**: Ownership, playtime, pricing, tags, genres

### Steam Review API
- **Base URL**: https://store.steampowered.com/appreviews/{appid}
- **Data**: Review scores, ratings, user feedback

## Migration Notes

This version removes dependency on the Steam Web API and uses only SteamSpy and Steam Review APIs. The data model has been updated to reflect this change, with improved focus on ownership data, playtime statistics, and review metrics. 