# 🎮 PriceWaveAI: Steam Game Pricing Intelligence System


> 💡 _This project is under iterative development. The system design and models may evolve as implementation progresses._

## 🔍 Project Scope & Objectives

PriceWaveAI empowers Steam game developers to understand how their game is performing in real time, and receive AI-powered pricing recommendations.

- **Sentiment analysis** on Steam reviews to gauge perceived game value.
- **Goal**: Determine **when** and **how much** to change game prices to maximize revenue and engagement.
- **Steam-only** focus for clean, consistent, and relevant data.
- **Real-time feedback** upon login: developers submit their Steam game link, and the system analyzes and updates automatically.
- **MongoDB** is used to store flexible and versioned datasets for each game:
  - Price history
  - Review sentiment
  - Cluster placement among similar games
  - Forecasts and suggested pricing

---



## 📊 Modeling & Forecasting

The system will integrate both heuristic and machine learning techniques:

- **Price elasticity modeling** via calculus and regression.
- **Cosine similarity** to find and analyze similar games.
- **ARIMA or exponential smoothing** for sales/sentiment trends.
- **Fourier analysis** to detect seasonal/cyclical signals.
- **ML price classifiers** and regressors to generate predictive suggestions based on historical Steam game data.

---


## 🧠 Sentiment & Review Analysis

- Analyze reviews using:
  - VADER/TextBlob for fast analysis
  - Hugging Face Transformers (e.g. `distilbert-base-uncased`) for richer context
- Detect price-related themes like "expensive", "good value", "wait for sale"
- Track **weekly sentiment deltas** to detect rising/falling perception

---


## 🔗 API & Tooling

- **Steam Web API** and **SteamSpy API** for:
  - Game metadata
  - Pricing and review trends
  - Similar game grouping
- **Gemini API (LLM)**:
  - Summarize large volumes of reviews
  - Generate natural language explanations for pricing recommendations
- **Automated scraping** may be added for unsupported metadata

---

## 📚 Database Design (MongoDB)

Flexible and indexed schema for:
- `game_id`, `price`, `review_score`, `review_date`, `sentiment_score`
- Historical price actions and review context
- Clustering group for benchmarking
- LLM-generated rationale for decisions

Aggregation pipelines will support:
- Weekly sentiment summaries
- Review keyword trending
- Forecasted revenue deltas

---

## ⚙️ Pricing Logic & ML Triggers

- Initial rule-based engine:
  - Drop price if: sentiment < 0.4 AND sales drop 30%
  - Raise price if: sentiment > 0.8 AND wishlist count surges
- ML phase:
  - Train classifier to recommend: `raise`, `lower`, `hold`
  - Use regressors to predict optimal price for revenue maximization
  - Forecast revenue deltas for confidence metrics

---


## 🧠 LLM Explanation Engine

Every pricing recommendation is paired with a generated "why":
> "Recent reviews remain positive, and similar indie titles raised prices after week 2. Suggest increasing price by 10%."

- Gemini will be used for summarizing reviews and generating rationales.

---

## 🏗️ Project Structure

```
PriceWave/
├── frontend/                 # Next.js 15 frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   └── utils/           # Utility functions and API client
│   ├── package.json
│   └── env.example          # Frontend environment variables
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic and external API calls
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models (if using database)
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── env.example          # Backend environment variables
└── package.json             # Root package.json for managing both apps
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Steam Web API Key (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PriceWave
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers concurrently.

## 🔧 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Steam Web API
STEAM_API_KEY=your_steam_api_key_here

# Database Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/pricewave

# Redis Configuration (if using Redis)
REDIS_URL=redis://localhost:6379

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# Optional: Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Steam Web API (if needed on frontend)
NEXT_PUBLIC_STEAM_API_KEY=your_steam_api_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
```

## 🎮 Steam Web API Integration

The backend includes comprehensive Steam Web API integration with the following endpoints:

### Available API Endpoints

- `GET /api/steam/game/:appId` - Get game details by Steam App ID
- `GET /api/steam/user/:steamId` - Get user profile by Steam ID
- `GET /api/steam/price/:appId` - Get price data for a game
- `POST /api/steam/games` - Get multiple games by their app IDs
- `GET /api/steam/search?q=query` - Search for games (placeholder)

### Getting a Steam Web API Key

1. Visit [Steam Community](https://steamcommunity.com/dev/apikey)
2. Sign in with your Steam account
3. Accept the terms and generate an API key
4. Add the key to your backend `.env` file

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all packages
- `npm run clean` - Clean all node_modules and build artifacts
- `npm run lint` - Run linting for both frontend and backend

### Frontend Only
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run start:frontend` - Start frontend production server

### Backend Only
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run start:backend` - Start backend production server

## 🛠️ Development

### Backend Development

The backend is built with:
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for Steam API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend Development

The frontend is built with:
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **Zustand** - State management

## 🔍 API Documentation

### Health Check
```bash
GET /health
```
Returns server status and timestamp.

### Steam Game Details
```bash
GET /api/steam/game/730
```
Returns details for Counter-Strike 2 (App ID: 730).

### Steam User Profile
```bash
GET /api/steam/user/76561198000000000
```
Returns profile information for a Steam user.

### Game Price Data
```bash
GET /api/steam/price/730
```
Returns current price information for a game.

### Multiple Games
```bash
POST /api/steam/games
Content-Type: application/json

{
  "appIds": [730, 570, 440]
}
```
Returns details for multiple games (max 50 per request).

## 🚀 Deployment

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables
3. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set production environment variables
3. Start the server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.


