"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { ComprehensiveAnalysis, PriceAnalysis } from "@/lib/api"

// Import new components we will create
import { GameHeader } from "@/components/analysis/NewGameHeader"
import { PricingAnalysisResults } from "@/components/analysis/PricingAnalysisResults"
import { RecommendedActions } from "@/components/analysis/RecommendedActions"
import { AnalysisCharts } from "@/components/analysis/AnalysisCharts"
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary"
import { PriceOptimizationCard } from "@/components/analysis/NewPriceOptimizationCard"
import { TimingOptimizationCard } from "@/components/analysis/NewTimingOptimizationCard"
import { Navbar } from '@/components/Navbar'

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
        <Navbar />
        <div className="container mx-auto px-4 py-8">
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
        <Navbar />
        <div className="container mx-auto px-4 py-8">
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

  if (!analysis || !analysis.success || !analysis.priceAnalysis || !analysis.steamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto" />
              <h1 className="text-3xl font-bold text-yellow-400">
                No Analysis Data
              </h1>
              <p className="text-gray-300 max-w-md">
                We couldn't find complete analysis data for this game. It might not be available in our database, the App ID might be invalid, or fetching from external services failed.
              </p>
              
              <Button
                onClick={handleBack}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { priceAnalysis, steamData } = analysis;
  const shouldShowMainQuestions = priceAnalysis.optimizationScore < 71;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <GameHeader
            appId={steamData.appId}
            gameName={steamData.name}
            developer={steamData.developer}
            releaseDate={steamData.releaseDate}
            currentPrice={priceAnalysis.currentPrice}
            optimizationScore={priceAnalysis.optimizationScore}
          />
          
          {shouldShowMainQuestions ? (
            <div className="grid md:grid-cols-2 gap-8">
              <PriceOptimizationCard
                optimalPrice={priceAnalysis.recommendedPrice}
                currentPrice={priceAnalysis.currentPrice}
                revenueIncrease={priceAnalysis.revenueIncrease}
                confidence={priceAnalysis.priceConfidence}
              />
              <TimingOptimizationCard
                urgency={priceAnalysis.urgency}
                timingRecommendation={priceAnalysis.timingRecommendation}
                timingReason={priceAnalysis.timingReason}
              />
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-green-400">Pricing is Well Optimized</h2>
              <p className="text-gray-300 mt-2">This game's pricing strategy is effective. No immediate actions are required.</p>
            </div>
          )}

          <PricingAnalysisResults
            recommendedPrice={priceAnalysis.recommendedPrice}
            priceIncrease={priceAnalysis.recommendedPrice - priceAnalysis.currentPrice}
            revenueIncrease={priceAnalysis.revenueIncrease}
            confidenceScore={priceAnalysis.priceConfidence}
          />

          <RecommendedActions
            currentPrice={priceAnalysis.currentPrice}
            recommendedPrice={priceAnalysis.recommendedPrice}
            revenueIncrease={priceAnalysis.revenueIncrease}
            underpricedComparedToSimilar={priceAnalysis.underpricedComparedToSimilar}
            marketPositioningStatement={priceAnalysis.marketPositioningStatement}
            closestCompetitorName={priceAnalysis.closestCompetitor.name}
            competitorPriceComparison={priceAnalysis.competitorPriceComparison}
          />

          <AnalysisCharts
            competitorData={priceAnalysis.competitorPriceComparison}
            priceTrendData={priceAnalysis.priceTrendAnalysis}
            marketShareData={priceAnalysis.marketShareAnalysis}
          />

          <ExecutiveSummary
            summaryText={priceAnalysis.executiveSummary}
          />

        </motion.div>
      </div>
    </div>
  )
} 