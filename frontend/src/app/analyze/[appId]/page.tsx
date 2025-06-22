"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, ComprehensiveAnalysis } from "@/lib/api"
import GameHeader from "@/components/analysis/GameHeader"
import PriceOptimizationCard from "@/components/analysis/PriceOptimizationCard"
import TimingOptimizationCard from "@/components/analysis/TimingOptimizationCard"
import AnalysisSummary from "@/components/analysis/AnalysisSummary"

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const appId = params.appId as string
  
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (appId) {
      fetchAnalysis()
    }
  }, [appId, retryCount])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.analyzeGame(appId)
      
      if (response.success && response.data) {
        setAnalysis(response.data)
      } else {
        setError(response.error || "Failed to analyze game")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleBack = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:text-[#00D4FF] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full"
            />
            
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#00D4FF]">
                Analyzing Your Game...
              </h1>
              <p className="text-gray-300 max-w-md">
                We're gathering comprehensive data from Steam, SteamSpy, and price tracking services to provide you with the most accurate pricing insights.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3">
              {[
                "Fetching Steam game details...",
                "Analyzing player statistics...",
                "Calculating market trends...",
                "Generating pricing recommendations..."
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.5 }}
                  className="flex items-center space-x-3 text-sm text-gray-400"
                >
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:text-[#00D4FF] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              <h1 className="text-3xl font-bold text-red-400">
                Analysis Failed
              </h1>
              <p className="text-gray-300 max-w-md">
                {error}
              </p>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleRetry}
                  className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis || !analysis.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:text-[#00D4FF] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto" />
              <h1 className="text-3xl font-bold text-yellow-400">
                No Analysis Data
              </h1>
              <p className="text-gray-300 max-w-md">
                We couldn't find analysis data for this game. It might not be available in our database or the App ID might be invalid.
              </p>
              
              <Button
                onClick={handleBack}
                className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-white hover:text-[#00D4FF] mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Game Header */}
          <GameHeader analysis={analysis} />

          {/* Main Analysis Results */}
          <div className="grid lg:grid-cols-2 gap-8">
            <PriceOptimizationCard analysis={analysis} />
            <TimingOptimizationCard analysis={analysis} />
          </div>

          {/* Analysis Summary */}
          <AnalysisSummary analysis={analysis} />

          {/* Market Trend Indicator */}
          {analysis.priceAnalysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Market Trend</h3>
                <div className="flex items-center space-x-2">
                  {analysis.priceAnalysis.marketTrend === 'bullish' && (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  )}
                  {analysis.priceAnalysis.marketTrend === 'bearish' && (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                  {analysis.priceAnalysis.marketTrend === 'neutral' && (
                    <Minus className="w-6 h-6 text-yellow-400" />
                  )}
                  <span className={`text-lg font-semibold ${
                    analysis.priceAnalysis.marketTrend === 'bullish' ? 'text-green-400' :
                    analysis.priceAnalysis.marketTrend === 'bearish' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {analysis.priceAnalysis.marketTrend.charAt(0).toUpperCase() + 
                     analysis.priceAnalysis.marketTrend.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mt-2">
                The market for this game is showing a {analysis.priceAnalysis.marketTrend} trend, 
                indicating {analysis.priceAnalysis.marketTrend === 'bullish' ? 'increasing' : 
                analysis.priceAnalysis.marketTrend === 'bearish' ? 'decreasing' : 'stable'} 
                demand and pricing pressure.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 