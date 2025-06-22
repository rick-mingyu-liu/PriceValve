"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { analyzeGame } from "@/lib/api";
import { GameHeader } from "@/components/analysis/GameHeader";
import { PriceOptimizationCard } from "@/components/analysis/PriceOptimizationCard";
import { TimingOptimizationCard } from "@/components/analysis/TimingOptimizationCard";
import { AdvancedAnalysisSection } from "@/components/analysis/AdvancedAnalysisSection";
import { AnalysisSummary } from "@/components/analysis/AnalysisSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.appId as string;

  const {
    data: analysis,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["analysis", appId],
    queryFn: () => analyzeGame(appId),
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Analyzing Your Game...
            </h2>
            <p className="text-gray-300 max-w-md mx-auto">
              We're gathering comprehensive data from Steam, SteamSpy, and market sources. 
              This may take 2-3 minutes for a complete analysis.
            </p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Fetching Steam data...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Analyzing market trends...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Calculating optimal pricing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">
                Analysis Failed
              </h2>
              <p className="text-gray-300 mb-6">
                {error instanceof Error ? error.message : "Failed to analyze the game. Please try again."}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isRefetching ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="text-gray-300 hover:text-white"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">
                No Analysis Data
              </h2>
              <p className="text-gray-300 mb-6">
                Unable to retrieve analysis data for this game. The game may not be available in our databases.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Try Another Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Game Header */}
        <GameHeader analysis={analysis} />

        {/* Main Analysis Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PriceOptimizationCard analysis={analysis} />
          <TimingOptimizationCard analysis={analysis} />
        </div>

        {/* Analysis Summary */}
        <AnalysisSummary analysis={analysis} />

        {/* Advanced Analysis */}
        <AdvancedAnalysisSection analysis={analysis} />
      </div>
    </div>
  );
} 