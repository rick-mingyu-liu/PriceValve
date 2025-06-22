# PriceValve Frontend

A modern, responsive web application for analyzing Steam game pricing with mathematical precision. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 **Complete User Flow**

- **Landing Page**: Professional hero section with Steam URL input
- **URL Processing**: Automatic App ID extraction from Steam URLs
- **Analysis Engine**: Comprehensive game analysis with real-time data
- **Results Dashboard**: Detailed insights with interactive visualizations

### 📊 **Analysis Components**

- **Game Header**: Game information, stats, and metadata
- **Price Optimization**: Revenue curve analysis with optimal pricing recommendations
- **Timing Optimization**: Seasonal trends and market timing insights
- **Analysis Summary**: Confidence breakdown and key insights

### 📈 **Data Visualization**

- **Revenue Curves**: Interactive charts showing price vs. revenue optimization
- **Confidence Breakdown**: Pie charts for analysis confidence metrics
- **Seasonal Patterns**: Visual representation of demand throughout the year
- **Market Trends**: Real-time market condition indicators

### 🎨 **Modern UI/UX**

- **Dark Theme**: Professional dark interface with cyan accents
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Smooth Animations**: Framer Motion powered transitions
- **Professional Components**: shadcn/ui component library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on `http://localhost:3001`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Enter Steam URL**: Paste any Steam game URL (e.g., `https://store.steampowered.com/app/730/Counter-Strike-2`)

2. **Analyze Game**: Click "Analyze Game" to start the comprehensive analysis

3. **View Results**: Explore detailed insights including:
   - Price optimization recommendations
   - Market timing analysis
   - Revenue curve visualizations
   - Confidence metrics
   - Key insights and action items

## API Integration

The frontend connects to the PriceValve backend API with the following endpoints:

- `POST /api/analyze` - Comprehensive game analysis
- `GET /api/search` - Game search functionality
- `GET /api/steam/:appId` - Steam data retrieval
- `GET /api/steamspy/:appId` - SteamSpy statistics

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   └── analyze/[appId]/
│       └── page.tsx             # Analysis results page
├── components/
│   ├── analysis/
│   │   ├── GameHeader.tsx       # Game information display
│   │   ├── PriceOptimizationCard.tsx  # Price analysis
│   │   ├── TimingOptimizationCard.tsx # Timing insights
│   │   └── AnalysisSummary.tsx  # Summary and insights
│   └── ui/                      # shadcn/ui components
└── lib/
    └── api.ts                   # API client and types
```

## Key Features

### 🎯 **Two Main Questions Answered**

1. **"What should I price my game?"** - Comprehensive price optimization with revenue curve analysis
2. **"When should I launch?"** - Market timing analysis with seasonal demand patterns

### 📊 **Data Sources**

- **Steam API**: Game details, pricing, metadata
- **SteamSpy**: Player statistics, ownership data
- **IsThereAnyDeal**: Price history and market trends

### 🎨 **Visual Design**

- Professional dark theme with cyan accent color (#00D4FF)
- Glassmorphism effects with backdrop blur
- Smooth animations and micro-interactions
- Mobile-responsive design

## Development

### Adding New Components

1. Create component in `src/components/`
2. Use TypeScript interfaces from `src/lib/api.ts`
3. Follow the existing design patterns and animations
4. Add proper error handling and loading states

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the dark theme color palette
- Implement responsive design patterns
- Use Framer Motion for animations

### API Integration

- All API calls go through `src/lib/api.ts`
- Use TypeScript interfaces for type safety
- Implement proper error handling
- Add loading states for better UX

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test on both desktop and mobile devices
5. Ensure accessibility standards are met

## License

This project is part of the PriceValve application suite.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
