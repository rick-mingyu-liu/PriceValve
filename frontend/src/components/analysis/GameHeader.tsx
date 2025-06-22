import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveAnalysis } from "@/lib/api";
import { 
  DollarSign, 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Gamepad2
} from "lucide-react";

interface GameHeaderProps {
  analysis: ComprehensiveAnalysis;
}

export function GameHeader({ analysis }: GameHeaderProps) {
  const steamData = analysis.steamData;
  const steamSpyData = analysis.steamSpyData;
  const priceAnalysis = analysis.priceAnalysis;

  const getMarketTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMarketTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {steamData?.headerImage && (
              <img 
                src={steamData.headerImage} 
                alt={analysis.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-2xl text-white mb-2">
                {analysis.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>App ID: {analysis.appId}</span>
                {steamData?.developer && (
                  <>
                    <span>•</span>
                    <span>{steamData.developer}</span>
                  </>
                )}
                {steamData?.publisher && (
                  <>
                    <span>•</span>
                    <span>{steamData.publisher}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {priceAnalysis && (
            <div className="flex items-center gap-2">
              {getMarketTrendIcon(priceAnalysis.marketTrend)}
              <span className={`text-sm font-medium ${getMarketTrendColor(priceAnalysis.marketTrend)}`}>
                Market: {priceAnalysis.marketTrend.charAt(0).toUpperCase() + priceAnalysis.marketTrend.slice(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Price */}
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {steamData?.isFree ? 'Free' : `$${(steamData?.price || 0) / 100}`}
            </div>
            <div className="text-sm text-gray-400">Current Price</div>
          </div>

          {/* Recommended Price */}
          {priceAnalysis && (
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                ${(priceAnalysis.recommendedPrice / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Recommended</div>
            </div>
          )}

          {/* Owner Count */}
          {steamSpyData && (
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {steamSpyData.owners}
              </div>
              <div className="text-sm text-gray-400">Owners</div>
            </div>
          )}

          {/* Review Score */}
          {steamSpyData && (
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {steamSpyData.positive > 0 ? 
                  `${Math.round((steamSpyData.positive / (steamSpyData.positive + steamSpyData.negative)) * 100)}%` : 
                  'N/A'
                }
              </div>
              <div className="text-sm text-gray-400">Positive Reviews</div>
            </div>
          )}
        </div>

        {/* Tags and Genres */}
        <div className="mt-6 space-y-4">
          {steamData?.genres && steamData.genres.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Genres
              </h4>
              <div className="flex flex-wrap gap-2">
                {steamData.genres.map((genre, index) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {steamData?.releaseDate && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Release Date
              </h4>
              <p className="text-white">{steamData.releaseDate}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 