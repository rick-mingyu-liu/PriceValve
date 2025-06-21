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

Every pricing recommendation is paired with a generated “why”:
> “Recent reviews remain positive, and similar indie titles raised prices after week 2. Suggest increasing price by 10%.”

- Gemini will be used for summarizing reviews and generating rationales.

---



```
PriceWaveAI/
│
├── ingestion/                     # Data collection and scraping
│   ├── steam_game_data.py
│   ├── review_scraper.py
│   └── wishlist_tracker.py
│
├── processing/                    # Data cleaning and feature engineering
│   ├── clean_reviews.py
│   ├── clean_prices.py
│   └── feature_engineering.py
│
├── analysis/                      # Core analytics and ML logic
│   ├── sentiment/
│   │   ├── sentiment_model.py
│   │   └── sentiment_utils.py
│   │
│   ├── forecasting/
│   │   ├── arima_model.py
│   │   ├── sales_forecast.py
│   │   └── cosine_similarity.py
│   │
│   ├── pricing/
│   │   ├── trigger_engine.py
│   │   ├── elasticity_model.py
│   │   └── recommendation_engine.py
│
├── llm/
│   ├── review_summarizer.py
│   └── pricing_explainer.py
│
├── database/                      # MongoDB schema and access layer
│   ├── mongo_connector.py
│   ├── schema_definition.md
│   └── aggregation_queries.py
│
├── dashboard/                     # Developer-facing web UI
│   ├── app.py
│   ├── charts.py
│   └── components/
│
├── config/                        # Configuration files
│   └── config.yaml
│
├── utils/                         # Utility scripts
│   ├── logger.py
│   └── time_utils.py
│
├── tests/                         # Unit and integration tests
│   ├── test_sentiment.py
│   ├── test_forecasting.py
│   └── test_pricing.py
│
└── README.md                      # Project overview and documentation


```