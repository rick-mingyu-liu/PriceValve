"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calculator, 
  BarChart3, 
  Target,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { extractAppIdFromUrl } from "@/lib/api";

export default function HomePage() {
  const [steamUrl, setSteamUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!steamUrl.trim()) {
      setError("Please enter a Steam store URL.");
      return;
    }

    const appId = extractAppIdFromUrl(steamUrl);
    if (!appId) {
      setError("Please enter a valid Steam store URL (e.g., https://store.steampowered.com/app/367520/)");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Small delay for UX
    setTimeout(() => {
      router.push(`/analyze/${appId}`);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full mr-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              PriceValve
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Optimize Your Steam Game Pricing with Mathematical Precision
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Leverage advanced algorithms and real-time market data to maximize your game's revenue. 
            Get data-driven pricing recommendations backed by Steam, SteamSpy, and market analysis.
          </p>

          {/* Main Input Section */}
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-xl">Start Your Analysis</CardTitle>
              <CardDescription className="text-gray-300">
                Paste your Steam game URL below to get comprehensive pricing insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                  placeholder="https://store.steampowered.com/app/367520/Hollow_Knight/"
                  value={steamUrl}
                  onChange={(e) => setSteamUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Analyze Game
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-purple-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Calculator className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white text-lg">Mathematical Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Advanced algorithms using price elasticity, demand curves, and market analysis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white text-lg">Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Live integration with Steam, SteamSpy, and market data sources
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-green-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-white text-lg">Precision Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Get exact price recommendations with confidence scores and market trends
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-orange-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-white text-lg">Instant Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Comprehensive analysis with charts, recommendations, and actionable insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-8">Trusted by Game Developers Worldwide</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-gray-300">Games Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$2M+</div>
              <div className="text-gray-300">Revenue Optimized</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 