# PriceValve: Steam Game Revenue Maximization Interface

- More details: https://devpost.com/software/pricevalve

> **Real-time Steam game analysis with revenue optimization-driven pricing recommendations**

## Project Overview

PriceValve is an intelligent pricing platform that analyzes Steam games in real-time and provides Revenue Optimizing pricing recommendations. The system combines data from Steam APIs, sentiment analysis, and demand estimation models to help developers optimize their game pricing strategy.

### Key Features

- **🔍 Real-time Steam Data Analysis**: Fetch and analyze game data from Steam Web API, SteamSpy API and ITAD (IsThereAnyDeal) API,
- **📊 Price Analysis**: Comprehensive pricing analysis with competitor comparison
- **📈 Price Recommendations**: Model-generated pricing suggestions with confidence scores
- **📱 Modern Web Interface**: Beautiful React/Next.js frontend with real-time updates
- **🏆 Competitor Comparison**: Comprehensive analysis of similar games and market positioning
- **🎮 Game Discovery**: PriceValveScript.js-inspired game search and selection functionality

## Project Architecture

```
PriceValve/
├── 📁 backend/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── 📁 controllers/        # API controllers
│   │   ├── 📁 services/           # Business logic services
│   │   ├── 📁 routes/             # API route definitions
│   │   ├── 📁 types/              # TypeScript type definitions
│   │   └── server.ts              # Express server setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
├── 📁 frontend/                   # Next.js 15 Frontend
│   ├── src/
│   │   ├── 📁 app/                # Next.js App Router
│   │   │   └── 📁 analyze/        # Game analysis pages
│   │   ├── 📁 components/         # React components (shadcn/ui)
│   │   │   ├── 📁 analysis/       # Analysis result components
│   │   │   ├── 📁 ui/             # UI components
│   │   │   ├── GameSelector.tsx   # Game discovery component
│   │   │   ├── Navbar.tsx         # Navigation component
│   │   │   └── SteamGameCard.tsx  # Game card component
│   │   ├── 📁 lib/                # Utility functions
│   │   └── 📁 utils/              # API client & utilities
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .gitignore
├── 📁 node_modules/               # Dependencies
├── package.json                   # Root package.json
├── package-lock.json              # Lock file
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # ESLint config
├── .gitignore                     # Git ignore rules
└── README.md
```

## Quick Start

### Prerequisites

- **Node.js 18+**
- **Steam Web API Key** (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PriceWave
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Set up environment variables**

   **Backend (.env):**
   ```env
   PORT=5001
   ```

   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## Frontend Features

### Core Analysis Features

The frontend provides comprehensive game analysis with a modern, intuitive interface:

#### **Game Analysis Workflow**
- **Steam URL Input**: Paste any Steam game URL for instant analysis
- **Real-time Analysis**: Get comprehensive pricing insights in seconds
- **Interactive Charts**: Visual competitor and trend analysis
- **Actionable Recommendations**: Specific steps to optimize pricing
- **Executive Summary**: High-level analysis overview

#### **Analysis Components**
- **GameHeader**: Game information display with optimization score
- **PricingAnalysisResults**: Detailed pricing recommendations
- **RecommendedActions**: Actionable insights and next steps
- **AnalysisCharts**: Interactive charts for competitor and trend analysis
- **ExecutiveSummary**: High-level analysis summary
- **PriceOptimizationCard**: Price optimization recommendations
- **TimingOptimizationCard**: Launch timing recommendations

## Data Models

### Core Game Data Model

```typescript
interface Game {
  appId: number;                    // Steam App ID
  name: string;                     // Game name
  developer: string;                // Developer name
  publisher: string;                // Publisher name
  
  // Steam API Data
  steamData: SteamGameData;
  
  // SteamSpy Data
  steamSpyData: SteamSpyData;
  
  // Analysis Results
  priceAnalysis: PriceAnalysis;
  playerAnalysis: PlayerAnalysis;
  marketAnalysis: MarketAnalysis;
  reviewAnalysis: ReviewAnalysis;
  
  // Revenue Optimization Predictions
  revenuePredictions: RevenuePredictions;
  
  // PriceValveScript.js Properties
  cluster?: string;                 // Cluster group for similar games
  
  // Metadata
  tags: GameTag[];
  genres: string[];
  lastUpdated: Date;
}
```

### Revenue Optimization Prediction Model

```typescript
interface RevenuePredictions {
  priceForecast: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
  sentimentTrend: {
    current: number;
    predicted: number;
    direction: 'up' | 'down' | 'stable';
  };
  optimalPrice: {
    suggested: number;
    confidence: number;
    reasoning: string[];
  };
  marketPosition: {
    category: string;
    score: number;
    competitors: string[];
  };
  priceElasticity: {
    value: number;
    interpretation: string;
    similarGames: number;
  };
}
```

## API Endpoints

### Game Analysis
- `POST /api/analyze` - Analyze a single game
- `POST /api/analyze/batch` - Analyze multiple games
- `GET /api/search` - Search games
- `GET /api/featured` - Get featured games
- `GET /api/top-games` - Get top games
- `GET /api/genres` - Get all genres
- `GET /api/genres/:genre` - Get games by genre

### Individual Data
- `GET /api/steam/:appId` - Steam game data
- `GET /api/steamspy/:appId` - SteamSpy data

### Health Check
- `GET /api/health` - API health status

## Frontend Components

Built with **shadcn/ui** and **Tailwind CSS**:

### Core Components
- `Navbar` - Navigation component
- `SteamGameCard` - Game information card

### Analysis Components
- `GameHeader` - Game information display
- `PricingAnalysisResults` - Pricing recommendations
- `RecommendedActions` - Actionable insights
- `AnalysisCharts` - Interactive charts
- `ExecutiveSummary` - Analysis summary
- `PriceOptimizationCard` - Price optimization
- `TimingOptimizationCard` - Timing recommendations

### UI Components
- `Button` - Styled button component
- `SearchBar` - Game search functionality

## Data Sources

### Steam Web API
- Game metadata
- Pricing information
- Review data
- Player statistics

### SteamSpy API
- Ownership data
- Player engagement
- Market positioning
- Genre analysis

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run test         # Run tests
npm run build        # Build for production
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

## Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request


**Built with ❤️ for SpurHacks 2025 and the Steam gaming community**
