# 🎮 PriceValve: Steam Game Revenue Maximization Interface

> **Real-time Steam game analysis with revenue optimization-driven pricing recommendations**

## 🎯 Project Overview

PriceWave is an intelligent pricing platform that analyzes Steam games in real-time and provides AI-powered pricing recommendations. The system combines data from Steam APIs, sentiment analysis, and revenue optimization models to help developers optimize their game pricing strategy.

### Key Features

- **🔍 Real-time Steam Data Analysis**: Fetch and analyze game data from Steam Web API and SteamSpy
- **💰 Revenue Optimization Models**: Advanced algorithms for price prediction and optimization
- **📊 Sentiment Analysis**: Review sentiment analysis for market perception
- **📈 Price Elasticity Derivation**: Mathematical models for demand-price relationships
- **🎯 Price Recommendations**: AI-generated pricing suggestions with confidence scores
- **📱 Modern Web Interface**: Beautiful React/Next.js frontend with real-time updates
- **🏆 Competitor Comparison**: Comprehensive analysis of similar games and market positioning

## 🏗️ Project Architecture

```
PriceValve/
├── 📁 backend/                    # Express.js API Server
│   ├── src/
│   │   ├── 📁 controllers/        # API route handlers
│   │   ├── 📁 services/           # Business logic & external APIs
│   │   ├── 📁 models/             # Database models
│   │   ├── 📁 routes/             # API endpoints
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 types/              # TypeScript type definitions
│   │   └── 📁 utils/              # Utility functions
│   ├── package.json
│   └── env.example
├── 📁 frontend/                   # Next.js 15 Frontend
│   ├── src/
│   │   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 components/         # React components (shadcn/ui)
│   │   ├── 📁 lib/                # Utility functions
│   │   └── 📁 utils/              # API client & utilities
│   ├── package.json
│   └── env.example
├── 📁 revenue-optimization/       # Revenue Optimization Models
│   ├── 📁 models/                 # Trained optimization models
│   ├── 📁 notebooks/              # Jupyter notebooks
│   ├── 📁 data/                   # Training datasets
│   ├── 📁 scripts/                # Optimization training scripts
│   └── requirements.txt
├── 📁 data-models/                # Data Model Definitions
│   ├── 📁 schemas/                # Database schemas
│   ├── 📁 types/                  # TypeScript interfaces
│   └── 📁 migrations/             # Database migrations
├── 📁 docs/                       # Documentation
├── package.json                   # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **Python 3.8+** (for revenue optimization models)
- **MongoDB** (for data storage)
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
   
   # Install revenue optimization dependencies
   cd ../revenue-optimization && pip install -r requirements.txt
   ```

3. **Set up environment variables**

   **Backend (.env):**
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pricewave
   STEAM_API_KEY=your_steam_api_key
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_STEAM_API_KEY=your_steam_api_key
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 📊 Data Models

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

## 💰 Revenue Optimization Models

### Current Models

1. **Price Elasticity Derivation**
   - Mathematical analysis of demand-price relationships
   - Competitor price comparison
   - Revenue optimization algorithms

2. **Sentiment Analysis**
   - Review sentiment classification
   - Trend detection
   - Price-sentiment correlation

3. **Competitor Comparison**
   - Market positioning analysis
   - Similar game identification
   - Pricing strategy recommendations

### Model Training

```bash
cd revenue-optimization
python scripts/train_price_elasticity.py
python scripts/train_sentiment_model.py
python scripts/train_competitor_analysis.py
```

## 🔌 API Endpoints

### Game Analysis
- `GET /api/games/:appId` - Get game analysis
- `POST /api/games/analyze` - Analyze multiple games
- `GET /api/games/search` - Search games

### Revenue Optimization Predictions
- `GET /api/revenue/predict/:appId` - Get revenue optimization predictions
- `POST /api/revenue/train` - Retrain models
- `GET /api/revenue/status` - Model status

### Steam Integration
- `GET /api/steam/game/:appId` - Steam game data
- `GET /api/steam/price/:appId` - Price data
- `GET /api/steam/reviews/:appId` - Review data

## 🎨 Frontend Components

Built with **shadcn/ui** and **Tailwind CSS**:

- `GameCard` - Game information display
- `PriceChart` - Interactive price charts
- `SentimentWidget` - Sentiment analysis display
- `RevenuePredictions` - Revenue optimization prediction results
- `CompetitorComparison` - Competitor analysis display
- `SearchBar` - Game search functionality

## 📈 Data Sources

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

### Internal Revenue Optimization Models
- Price elasticity calculations
- Sentiment analysis
- Competitor comparison algorithms

## 🔧 Development

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

### Revenue Optimization Development
```bash
cd revenue-optimization
jupyter notebook     # Start Jupyter
python scripts/      # Run optimization scripts
```

## 🚀 Deployment

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

### Revenue Optimization Model Deployment
```bash
cd revenue-optimization
python scripts/deploy_models.py
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Revenue Optimization Model Documentation](./docs/revenue-models.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@pricewave.com

---

**Built with ❤️ for the Steam gaming community**


