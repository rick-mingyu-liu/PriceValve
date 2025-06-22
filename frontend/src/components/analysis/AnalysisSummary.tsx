"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { CheckCircle, AlertCircle, Info, TrendingUp, Target, Clock, DollarSign } from "lucide-react"
import { ComprehensiveAnalysis } from "@/lib/api"

interface AnalysisSummaryProps {
  analysis: ComprehensiveAnalysis
}

export default function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
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
          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Analysis Summary</h3>
          <p>Summary data not available for this game.</p>
        </div>
      </motion.div>
    )
  }

  // Calculate price optimization percentage
  const currentPrice = priceAnalysis.currentPrice / 100
  const recommendedPrice = priceAnalysis.recommendedPrice / 100
  const optimizationPercentage = calculateOptimizationPercentage(currentPrice, recommendedPrice, priceAnalysis.factors.priceElasticity)
  const optimizationStatus = getOptimizationStatus(optimizationPercentage)

  // Calculate confidence breakdown
  const confidenceData = [
    { name: 'Price Analysis', value: priceAnalysis.priceConfidence, color: '#00D4FF' },
    { name: 'Market Data', value: 85, color: '#4ECDC4' },
    { name: 'Player Stats', value: 90, color: '#45B7D1' },
    { name: 'Historical Data', value: 75, color: '#96CEB4' }
  ]

  // Calculate overall score (now weighted more towards price optimization)
  const overallScore = Math.round(
    (optimizationPercentage * 0.4 + priceAnalysis.demandScore * 0.3 + priceAnalysis.competitionScore * 0.3)
  )

  // Get key insights based on optimization status
  const insights = generateOptimizedInsights(priceAnalysis, optimizationStatus)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-[#00D4FF]" />
          Analysis Summary
        </h3>
        <div className="text-sm text-gray-400">
          Overall Score: {overallScore}%
        </div>
      </div>

      {/* Price Optimization Score - Prominent Display */}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-[#00D4FF]" />
              <div>
                <h4 className="text-xl font-semibold text-white mb-1">Price Optimization Score</h4>
                <p className="text-sm text-gray-300">
                  How well your current price maximizes revenue potential
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${
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
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-[#00D4FF]/20 to-[#4ECDC4]/20 rounded-lg p-4 border border-[#00D4FF]/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Overall Analysis Score</h4>
              <p className="text-sm text-gray-300">
                Based on price optimization, market trends, and player data
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#00D4FF]">{overallScore}%</div>
              <div className="text-sm text-gray-400">
                {overallScore >= 80 ? 'Excellent' :
                 overallScore >= 60 ? 'Good' :
                 overallScore >= 40 ? 'Fair' : 'Poor'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Confidence Breakdown</h4>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Confidence']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {confidenceData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Insights</h4>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`flex items-start p-3 rounded-lg border ${
                insight.type === 'positive' ? 'bg-green-500/10 border-green-500/30' :
                insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              {insight.type === 'positive' && <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />}
              {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />}
              {insight.type === 'info' && <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />}
              <div>
                <div className="text-sm font-medium text-white mb-1">{insight.title}</div>
                <div className="text-sm text-gray-300">{insight.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Recommended Actions</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#00D4FF] mr-2" />
              <span className="text-sm font-medium text-white">Price Strategy</span>
            </div>
            <p className="text-sm text-gray-300">
              {optimizationStatus.color === 'green' 
                ? 'Your price is well optimized. Maintain current pricing strategy.'
                : optimizationStatus.color === 'yellow'
                ? `Consider adjusting price to ${recommendedPrice.toFixed(2)} to improve optimization.`
                : `Immediately adjust price to ${recommendedPrice.toFixed(2)} for optimal revenue.`
              }
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-[#00D4FF] mr-2" />
              <span className="text-sm font-medium text-white">Timing Strategy</span>
            </div>
            <p className="text-sm text-gray-300">
              {priceAnalysis.marketTrend === 'bullish' 
                ? 'Market conditions are favorable for price changes.'
                : 'Consider waiting for better market conditions before major price changes.'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Calculate optimization percentage (same as in PriceOptimizationCard)
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

// Get optimization status (same as in PriceOptimizationCard)
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

// Generate insights based on optimization status
function generateOptimizedInsights(priceAnalysis: any, optimizationStatus: any): Array<{type: string, title: string, description: string}> {
  const insights = []
  
  // Price optimization insights
  if (optimizationStatus.color === 'green') {
    insights.push({
      type: 'positive',
      title: 'Excellent Price Optimization',
      description: `Your current price achieves ${optimizationStatus.percentage?.toFixed(0)}% of optimal revenue potential. Keep your current pricing strategy.`
    })
  } else if (optimizationStatus.color === 'yellow') {
    insights.push({
      type: 'warning',
      title: 'Price Optimization Opportunity',
      description: `Your price achieves ${optimizationStatus.percentage?.toFixed(0)}% of optimal revenue. Consider adjusting to ${(priceAnalysis.recommendedPrice / 100).toFixed(2)} for better performance.`
    })
  } else {
    insights.push({
      type: 'warning',
      title: 'Critical Price Optimization Needed',
      description: `Your price only achieves ${optimizationStatus.percentage?.toFixed(0)}% of optimal revenue. Immediate adjustment to ${(priceAnalysis.recommendedPrice / 100).toFixed(2)} recommended.`
    })
  }
  
  // Demand insights
  if (priceAnalysis.demandScore > 70) {
    insights.push({
      type: 'positive',
      title: 'Strong Market Demand',
      description: 'Your game shows strong player interest and engagement, indicating good market potential.'
    })
  } else if (priceAnalysis.demandScore < 40) {
    insights.push({
      type: 'warning',
      title: 'Low Market Demand',
      description: 'Market demand appears low. Consider improving game features or marketing strategy.'
    })
  }
  
  // Competition insights
  if (priceAnalysis.competitionScore > 70) {
    insights.push({
      type: 'info',
      title: 'High Competition Market',
      description: 'You\'re entering a competitive market. Focus on unique features and strong marketing.'
    })
  } else {
    insights.push({
      type: 'positive',
      title: 'Low Competition Opportunity',
      description: 'Limited competition in your niche presents an opportunity to establish market leadership.'
    })
  }
  
  // Market trend insights
  if (priceAnalysis.marketTrend === 'bullish') {
    insights.push({
      type: 'positive',
      title: 'Favorable Market Conditions',
      description: 'Market trends are positive, indicating good timing for price adjustments or launches.'
    })
  } else if (priceAnalysis.marketTrend === 'bearish') {
    insights.push({
      type: 'warning',
      title: 'Challenging Market Conditions',
      description: 'Market conditions are challenging. Consider waiting or implementing aggressive pricing.'
    })
  }
  
  return insights.slice(0, 4) // Limit to 4 insights
}

// Generate revenue curve data (same as in PriceOptimizationCard)
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