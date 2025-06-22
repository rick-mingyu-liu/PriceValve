"use client"

import { motion } from "framer-motion"
import { Clock, Calendar, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { ComprehensiveAnalysis } from "@/lib/api"

interface TimingOptimizationCardProps {
  analysis: ComprehensiveAnalysis
}

export default function TimingOptimizationCard({ analysis }: TimingOptimizationCardProps) {
  const priceAnalysis = analysis.priceAnalysis
  
  if (!priceAnalysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="text-center text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Timing Optimization</h3>
          <p>Timing analysis data not available for this game.</p>
        </div>
      </motion.div>
    )
  }

  const seasonalDemand = priceAnalysis.factors.seasonalDemand
  const marketTrend = priceAnalysis.marketTrend
  const priceTrend = priceAnalysis.priceHistory.priceTrend
  
  // Generate seasonal data for visualization
  const seasonalData = generateSeasonalData(seasonalDemand)
  
  // Determine timing recommendation
  const timingRecommendation = getTimingRecommendation(marketTrend, priceTrend, seasonalDemand)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#00D4FF]" />
          Timing Optimization
        </h3>
        <div className="text-sm text-gray-400">
          Seasonal Score: {(seasonalDemand * 100).toFixed(0)}%
        </div>
      </div>

      {/* Timing Recommendation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className={`p-4 rounded-lg border ${
          timingRecommendation.action === 'launch' ? 'bg-green-500/10 border-green-500/30' :
          timingRecommendation.action === 'wait' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Timing Recommendation</span>
            <span className={`text-sm font-semibold ${
              timingRecommendation.action === 'launch' ? 'text-green-400' :
              timingRecommendation.action === 'wait' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {timingRecommendation.action.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {timingRecommendation.reason}
          </p>
        </div>
      </motion.div>

      {/* Market Trends */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Market Trends</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Market Trend</span>
              {marketTrend === 'bullish' && <TrendingUp className="w-4 h-4 text-green-400" />}
              {marketTrend === 'bearish' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {marketTrend === 'neutral' && <BarChart3 className="w-4 h-4 text-yellow-400" />}
            </div>
            <div className="text-lg font-semibold text-white capitalize">
              {marketTrend}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Price Trend</span>
              {priceTrend === 'increasing' && <TrendingUp className="w-4 h-4 text-green-400" />}
              {priceTrend === 'decreasing' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {priceTrend === 'stable' && <BarChart3 className="w-4 h-4 text-yellow-400" />}
            </div>
            <div className="text-lg font-semibold text-white capitalize">
              {priceTrend}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seasonal Demand Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Seasonal Demand Pattern</h4>
        <div className="space-y-2">
          {seasonalData.map((month, index) => (
            <div key={index} className="flex items-center">
              <span className="text-xs text-gray-400 w-12">{month.name}</span>
              <div className="flex-1 mx-3">
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${month.demand}%` }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`h-full rounded-full ${
                      month.demand > 80 ? 'bg-green-400' :
                      month.demand > 60 ? 'bg-yellow-400' :
                      month.demand > 40 ? 'bg-orange-400' :
                      'bg-red-400'
                    }`}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {month.demand}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price History Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Price History Insights</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Lowest Price</div>
            <div className="text-lg font-semibold text-white">
              ${(priceAnalysis.priceHistory.lowestPrice / 100).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Highest Price</div>
            <div className="text-lg font-semibold text-white">
              ${(priceAnalysis.priceHistory.highestPrice / 100).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Average Price</div>
            <div className="text-lg font-semibold text-white">
              ${(priceAnalysis.priceHistory.averagePrice / 100).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Volatility</div>
            <div className="text-lg font-semibold text-white">
              {(priceAnalysis.priceHistory.priceVolatility * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timing Factors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Timing Factors</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Game Age</span>
            <span className="text-sm text-white">
              {priceAnalysis.factors.age > 2 ? 'Mature' : 
               priceAnalysis.factors.age > 1 ? 'Established' : 'New'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Genre Competition</span>
            <span className="text-sm text-white">
              {priceAnalysis.factors.genreCompetition > 0.7 ? 'High' :
               priceAnalysis.factors.genreCompetition > 0.4 ? 'Medium' : 'Low'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Seasonal Demand</span>
            <span className="text-sm text-white">
              {seasonalDemand > 0.8 ? 'Peak Season' :
               seasonalDemand > 0.6 ? 'Good Season' :
               seasonalDemand > 0.4 ? 'Average Season' : 'Low Season'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Generate seasonal demand data
function generateSeasonalData(seasonalDemand: number): Array<{name: string, demand: number}> {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  // Create a seasonal pattern based on the seasonal demand factor
  const baseDemand = seasonalDemand * 100
  const seasonalPattern = [
    0.8, 0.7, 0.9, 0.8, 0.9, 0.7,  // Jan-Jun
    0.8, 0.9, 0.8, 0.9, 1.0, 0.9   // Jul-Dec
  ]
  
  return months.map((month, index) => ({
    name: month,
    demand: Math.round(baseDemand * seasonalPattern[index])
  }))
}

// Get timing recommendation based on market conditions
function getTimingRecommendation(
  marketTrend: string, 
  priceTrend: string, 
  seasonalDemand: number
): {action: string, reason: string} {
  const isHighSeason = seasonalDemand > 0.7
  const isBullishMarket = marketTrend === 'bullish'
  const isPriceIncreasing = priceTrend === 'increasing'
  
  if (isHighSeason && isBullishMarket && isPriceIncreasing) {
    return {
      action: 'launch',
      reason: 'Perfect timing! High seasonal demand, bullish market, and increasing prices create optimal launch conditions.'
    }
  } else if (isHighSeason && (isBullishMarket || isPriceIncreasing)) {
    return {
      action: 'launch',
      reason: 'Good timing. High seasonal demand with favorable market conditions support a launch.'
    }
  } else if (isHighSeason) {
    return {
      action: 'consider',
      reason: 'Seasonal demand is high, but market conditions are mixed. Consider launching with competitive pricing.'
    }
  } else if (isBullishMarket && isPriceIncreasing) {
    return {
      action: 'consider',
      reason: 'Market conditions are favorable despite lower seasonal demand. Consider launching with strong marketing.'
    }
  } else {
    return {
      action: 'wait',
      reason: 'Market conditions and seasonal demand suggest waiting for better timing. Focus on development and marketing preparation.'
    }
  }
} 