"use client"

import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Target, BarChart3, AlertTriangle, CheckCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ComprehensiveAnalysis } from "@/lib/api"

interface PriceOptimizationCardProps {
  analysis: ComprehensiveAnalysis
}

export default function PriceOptimizationCard({ analysis }: PriceOptimizationCardProps) {
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
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Price Optimization</h3>
          <p>Price analysis data not available for this game.</p>
        </div>
      </motion.div>
    )
  }

  const currentPrice = priceAnalysis.currentPrice / 100 // Convert from cents
  const recommendedPrice = priceAnalysis.recommendedPrice / 100
  const priceDifference = recommendedPrice - currentPrice
  const priceChangePercent = ((priceDifference / currentPrice) * 100)
  
  // Calculate optimization percentage based on how close current price is to recommended
  const optimizationPercentage = calculateOptimizationPercentage(currentPrice, recommendedPrice, priceAnalysis.factors.priceElasticity)
  
  // Get optimization status and color
  const optimizationStatus = getOptimizationStatus(optimizationPercentage)
  
  // Generate revenue curve data
  const revenueCurveData = generateRevenueCurveData(currentPrice, priceAnalysis.factors.priceElasticity)
  
  // Find optimal point on curve
  const optimalPoint = revenueCurveData.reduce((max, point) => 
    point.revenue > max.revenue ? point : max
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-[#00D4FF]" />
          Price Optimization
        </h3>
        <div className="text-sm text-gray-400">
          Confidence: {priceAnalysis.priceConfidence.toFixed(0)}%
        </div>
      </div>

      {/* Optimization Percentage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className={`p-6 rounded-lg border ${
          optimizationStatus.color === 'green' ? 'bg-green-500/10 border-green-500/30' :
          optimizationStatus.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {optimizationStatus.color === 'green' && <CheckCircle className="w-6 h-6 text-green-400 mr-3" />}
              {optimizationStatus.color === 'yellow' && <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />}
              {optimizationStatus.color === 'red' && <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />}
              <div>
                <h4 className="text-lg font-semibold text-white">Price Optimization Score</h4>
                <p className="text-sm text-gray-300">How well optimized your current price is</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                optimizationStatus.color === 'green' ? 'text-green-400' :
                optimizationStatus.color === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {optimizationPercentage.toFixed(0)}%
              </div>
              <div className={`text-sm font-semibold ${
                optimizationStatus.color === 'green' ? 'text-green-400' :
                optimizationStatus.color === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {optimizationStatus.label}
              </div>
            </div>
          </div>
          
          {/* Optimization Status Message */}
          <p className="text-sm text-gray-300 mb-4">
            {optimizationStatus.message}
          </p>
        </div>
      </motion.div>

      {/* Price Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="text-sm text-gray-400 mb-1">Current Price</div>
          <div className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#00D4FF]/10 rounded-lg p-4 border border-[#00D4FF]/30"
        >
          <div className="text-sm text-gray-400 mb-1">Recommended Price</div>
          <div className="text-2xl font-bold text-[#00D4FF]">${recommendedPrice.toFixed(2)}</div>
        </motion.div>
      </div>

      {/* Price Change Recommendation - Only show if not optimal */}
      {(optimizationStatus.color === 'yellow' || optimizationStatus.color === 'red') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className={`p-4 rounded-lg border ${
            optimizationStatus.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 mr-2 text-[#00D4FF]" />
              <span className="text-white font-medium">Price Change Recommendation</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-white mb-1">What is the new price?</div>
                <div className={`text-lg font-bold ${
                  priceChangePercent > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${recommendedPrice.toFixed(2)} 
                  <span className="text-sm ml-2">
                    ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}% change)
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  This price is calculated to maximize your revenue based on market demand and competition.
                </p>
              </div>
              
              <div>
                <div className="text-sm font-semibold text-white mb-1">When is the right time to update?</div>
                <div className="text-sm text-gray-300">
                  {getPriceUpdateTiming(analysis.priceAnalysis?.marketTrend, analysis.priceAnalysis?.factors.seasonalDemand)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Revenue Curve Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Revenue Optimization Curve</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueCurveData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="price" 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: any, name: string) => [
                  `$${value.toFixed(2)}`, 
                  name === 'revenue' ? 'Revenue' : name
                ]}
                labelFormatter={(label) => `Price: $${label.toFixed(2)}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00D4FF"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              {/* Current price marker */}
              <Line
                type="monotone"
                data={[{ price: currentPrice, revenue: 0 }, { price: currentPrice, revenue: optimalPoint.revenue }]}
                dataKey="revenue"
                stroke="#FF6B6B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              {/* Optimal price marker */}
              <Line
                type="monotone"
                data={[{ price: optimalPoint.price, revenue: 0 }, { price: optimalPoint.price, revenue: optimalPoint.revenue }]}
                dataKey="revenue"
                stroke="#4ECDC4"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart Legend */}
        <div className="flex justify-center space-x-6 mt-3 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#FF6B6B] mr-2"></div>
            <span className="text-gray-400">Current Price</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#4ECDC4] mr-2"></div>
            <span className="text-gray-400">Optimal Price</span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Demand Score</div>
          <div className="text-lg font-semibold text-white">
            {priceAnalysis.demandScore.toFixed(0)}%
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Competition</div>
          <div className="text-lg font-semibold text-white">
            {priceAnalysis.competitionScore.toFixed(0)}%
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      {priceAnalysis.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Recommendations</h4>
          <ul className="space-y-2">
            {priceAnalysis.recommendations.slice(0, 3).map((recommendation, index) => (
              <li key={index} className="flex items-start text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                {recommendation}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}

// Calculate optimization percentage based on how close current price is to optimal
function calculateOptimizationPercentage(currentPrice: number, recommendedPrice: number, elasticity: number): number {
  // Generate revenue curve to find optimal price
  const revenueCurveData = generateRevenueCurveData(currentPrice, elasticity)
  const optimalPoint = revenueCurveData.reduce((max, point) => 
    point.revenue > max.revenue ? point : max
  )
  
  // Calculate current revenue vs optimal revenue
  const currentRevenue = revenueCurveData.find(point => 
    Math.abs(point.price - currentPrice) < 0.01
  )?.revenue || 0
  
  const optimalRevenue = optimalPoint.revenue
  
  if (optimalRevenue === 0) return 100
  
  // Calculate percentage of optimal revenue achieved
  const optimizationPercentage = (currentRevenue / optimalRevenue) * 100
  
  return Math.min(100, Math.max(0, optimizationPercentage))
}

// Get optimization status and styling
function getOptimizationStatus(percentage: number): {
  color: 'green' | 'yellow' | 'red',
  label: string,
  message: string
} {
  if (percentage >= 71) {
    return {
      color: 'green',
      label: 'Well Optimized',
      message: 'Your current price is well optimized for maximum revenue. No changes needed at this time.'
    }
  } else if (percentage >= 50) {
    return {
      color: 'yellow',
      label: 'Needs Improvement',
      message: 'Your price could be better optimized. Consider adjusting to improve revenue potential.'
    }
  } else {
    return {
      color: 'red',
      label: 'Poorly Optimized',
      message: 'Your current price is significantly suboptimal. Immediate price adjustment recommended.'
    }
  }
}

// Get timing recommendation for price updates
function getPriceUpdateTiming(marketTrend?: string, seasonalDemand?: number): string {
  if (marketTrend === 'bullish' && seasonalDemand && seasonalDemand > 0.7) {
    return 'Update immediately - market conditions are favorable with high seasonal demand.'
  } else if (marketTrend === 'bullish') {
    return 'Update within 1-2 weeks - market trends are positive.'
  } else if (seasonalDemand && seasonalDemand > 0.7) {
    return 'Update within 2-3 weeks - take advantage of high seasonal demand.'
  } else if (marketTrend === 'bearish') {
    return 'Wait 1-2 months - market conditions are challenging. Focus on marketing first.'
  } else {
    return 'Update within 3-4 weeks - standard market conditions allow for gradual adjustment.'
  }
}

// Generate revenue curve data based on price elasticity
function generateRevenueCurveData(basePrice: number, elasticity: number): Array<{price: number, revenue: number}> {
  const data = []
  const priceRange = 0.5 // ±50% price range
  const steps = 20
  
  for (let i = 0; i <= steps; i++) {
    const priceMultiplier = 1 - priceRange + (priceRange * 2 * i / steps)
    const price = basePrice * priceMultiplier
    
    // Calculate demand based on price elasticity
    const demandMultiplier = Math.pow(priceMultiplier, -elasticity)
    const demand = 1000 * demandMultiplier // Base demand of 1000 units
    
    const revenue = price * demand
    
    data.push({
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      revenue: Math.round(revenue * 100) / 100
    })
  }
  
  return data
} 