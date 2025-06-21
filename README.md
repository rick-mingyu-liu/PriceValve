# 🎮 PriceWaveAI: Steam Game Pricing Intelligence System

will be changed along the implementation

## 🔍 Project Scope & Objectives

- **Sentiment analysis** on Steam reviews to understand player perception of pricing and value
- **Purpose**: Determine **when** and **what price** to change to maximize revenue and player satisfaction
- **Focus on Steam only**, narrowing the domain for clean data, relevant trends, and efficient API integration
- Use **MongoDB** as the primary NoSQL database to store pricing, reviews, and time-series data
- Define a **clear and extensible data model** that includes:
  - Price history
  - Sentiment scores
  - Review metadata
  - Sales patterns and wishlist trends

---

## 📊 Modeling & Forecasting

- **Forecasting methods** to estimate demand and revenue:
  - Use **calculus** (e.g., marginal revenue optimization via derivatives) to find optimal price points
  - **Cosine similarity** for comparing sentiment or price trajectories with historical high-performing games
- Integrate **ARIMA or exponential smoothing** for temporal price/sales forecasting
- Use **Fourier analysis** to detect cyclical patterns in sentiment or sales over weeks/months

---

## 🧠 Sentiment & Review Analysis

- Perform **sentiment analysis** using:
  - VADER or TextBlob for lightweight polarity scoring
  - Hugging Face Transformers (e.g., `distilbert-base-uncased`) for deeper context
- Track **common review themes** (e.g., “overpriced”, “great value”, “wait for sale”)
- Use sentiment **deltas over time** to flag sudden sentiment drops or hype bursts

---

## 🔗 API & Tooling

- Use **Gemini API (Google)** for:
  - Summarizing large volumes of reviews into qualitative insights
  - Generating natural-language explanations for price recommendations
- Use **Steam Web API** and **SteamSpy API** for:
  - Pulling price, sales, and game metadata
  - Fetching user reviews with timestamps
- Set up **automated scraping** pipelines for missing data fields not exposed via API

---

## 📚 Database Design (MongoDB)

- Use **flexible JSON documents** to store unstructured review data and nested price histories
- Create indexed fields for:
  - `game_id`, `review_date`, `sentiment_score`, `price`, `sales_volume`
- Enable aggregation pipelines for weekly/monthly trend analysis

---

## ⚙️ Pricing Logic & Triggers

- Develop **rule-based pricing triggers**, e.g.:
  - Drop price if: sentiment < 0.4 AND sales drop by 30%
  - Raise price if: sentiment > 0.8 AND wishlist adds spike
- Experiment with **multi-armed bandit testing** to evaluate multiple pricing strategies in parallel

---

## 📈 Analytics Dashboard (Optional)

- Build visualizations to display:
  - Price history vs sentiment trend
  - Sales and wishlist over time
  - Triggered price recommendations and supporting rationale




```
PriceWaveAI/
│
├── data_ingestion/                # Data collection from Steam and related sources
│   ├── steam_game_data.py         # Game metadata, price history, reviews
│   ├── review_scraper.py          # Steam review scraping or API wrapper
│   └── wishlist_tracker.py        # Wishlist & sales activity (if available)
│
├── data_processing/               # Data cleaning, transformation, and feature extraction
│   ├── clean_reviews.py
│   ├── clean_prices.py
│   └── feature_engineering.py     # Add sentiment scores, trend features, etc.
│
├── sentiment_analysis/           # NLP models for review sentiment
│   ├── sentiment_model.py         # VADER/TextBlob/HuggingFace pipeline
│   └── sentiment_utils.py         # Preprocessing & interpretation helpers
│
├── forecasting/                  # Time series modeling & demand forecasting
│   ├── arima_model.py
│   ├── sales_forecast.py
│   └── cosine_similarity.py       # Compare sales/sentiment trajectories
│
├── pricing_logic/                # Rules and intelligence for pricing decisions
│   ├── trigger_engine.py          # “When” and “how much” to adjust price
│   ├── elasticity_model.py        # Calculus-based demand response modeling
│   └── recommendation_engine.py   # Combines rules, forecasts, sentiment
│
├── gemini_api/                   # Integration with Gemini or LLM APIs
│   ├── review_summarizer.py       # LLM-powered review summarization
│   └── pricing_explainer.py       # Generate explanations for price suggestions
│
├── database/                     # MongoDB schema, connectors, and queries
│   ├── mongo_connector.py         # Insert/query/update logic
│   ├── schema_definition.md       # Documented schema for game, review, pricing
│   └── aggregation_queries.py     # Common reporting/analysis pipelines
│
├── dashboard/                    # (Optional) Visualization and reporting interface
│   ├── app.py
│   ├── charts.py
│   └── components/
│
├── config/                       # Configuration and constants
│   └── config.yaml
│
├── utils/                        # General utility scripts
│   ├── logger.py
│   └── time_utils.py
│
├── tests/                        # Unit and integration tests
│   ├── test_sentiment.py
│   ├── test_forecasting.py
│   └── test_pricing.py
│
└── README.md                     # Project documentation and overview

```