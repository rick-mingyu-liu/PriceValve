import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveAnalysis } from "@/lib/api";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface AnalysisSummaryProps {
  analysis: ComprehensiveAnalysis;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  const priceAnalysis = analysis.priceAnalysis;
  const steamData = analysis.steamData;
  const steamSpyData = analysis.steamSpyData;

  if (!priceAnalysis) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No analysis data available to generate summary.</p>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = priceAnalysis.currentPrice / 100;
  const recommendedPrice = priceAnalysis.recommendedPrice / 100;
  const priceDifference = recommendedPrice - currentPrice;
  const priceChangePercent = ((priceDifference / currentPrice) * 100);

  const getSummaryTone = () => {
    if (priceChangePercent > 10) return 'positive';
    if (priceChangePercent < -10) return 'negative';
    return 'neutral';
  };

  const getConfidenceLevel = () => {
    if (priceAnalysis.priceConfidence >= 80) return 'high';
    if (priceAnalysis.priceConfidence >= 60) return 'medium';
    return 'low';
  };

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

  const summaryTone = getSummaryTone();
  const confidenceLevel = getConfidenceLevel();

  const generateSummary = () => {
    const gameName = analysis.name;
    const currentPriceFormatted = currentPrice.toFixed(2);
    const recommendedPriceFormatted = recommendedPrice.toFixed(2);
    
    let summary = `Based on our comprehensive analysis of ${gameName}, `;
    
    if (Math.abs(priceChangePercent) < 5) {
      summary += `your current price of $${currentPriceFormatted} appears to be well-optimized. `;
    } else if (priceChangePercent > 0) {
      summary += `we recommend increasing your price from $${currentPriceFormatted} to $${recommendedPriceFormatted} (${priceChangePercent.toFixed(1)}% increase). `;
    } else {
      summary += `we recommend decreasing your price from $${currentPriceFormatted} to $${recommendedPriceFormatted} (${Math.abs(priceChangePercent).toFixed(1)}% decrease). `;
    }

    // Add market context
    summary += `The market is currently ${priceAnalysis.marketTrend}, `;
    
    if (priceAnalysis.factors.seasonalDemand > 1.1) {
      summary += `and seasonal demand is above average. `;
    } else if (priceAnalysis.factors.seasonalDemand < 0.9) {
      summary += `and seasonal demand is below average. `;
    } else {
      summary += `and seasonal demand is at normal levels. `;
    }

    // Add confidence context
    if (confidenceLevel === 'high') {
      summary += `We have high confidence (${priceAnalysis.priceConfidence}%) in this recommendation. `;
    } else if (confidenceLevel === 'medium') {
      summary += `We have moderate confidence (${priceAnalysis.priceConfidence}%) in this recommendation. `;
    } else {
      summary += `We have low confidence (${priceAnalysis.priceConfidence}%) in this recommendation due to limited data. `;
    }

    return summary;
  };

  const getKeyInsights = () => {
    const insights = [];
    
    // Price insight
    if (Math.abs(priceChangePercent) > 5) {
      insights.push({
        type: priceChangePercent > 0 ? 'opportunity' : 'adjustment',
        text: priceChangePercent > 0 
          ? `Price increase opportunity: ${priceChangePercent.toFixed(1)}% potential boost`
          : `Price adjustment needed: ${Math.abs(priceChangePercent).toFixed(1)}% reduction recommended`,
        icon: priceChangePercent > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
      });
    }

    // Market trend insight
    if (priceAnalysis.marketTrend !== 'neutral') {
      insights.push({
        type: priceAnalysis.marketTrend === 'bullish' ? 'opportunity' : 'caution',
        text: `Market is ${priceAnalysis.marketTrend} - ${priceAnalysis.marketTrend === 'bullish' ? 'favorable conditions' : 'challenging conditions'}`,
        icon: getMarketTrendIcon(priceAnalysis.marketTrend)
      });
    }

    // Seasonal insight
    if (priceAnalysis.factors.seasonalDemand > 1.1) {
      insights.push({
        type: 'opportunity',
        text: 'Seasonal demand is high - optimal timing for price adjustments',
        icon: <TrendingUp className="h-4 w-4" />
      });
    } else if (priceAnalysis.factors.seasonalDemand < 0.9) {
      insights.push({
        type: 'caution',
        text: 'Seasonal demand is low - consider waiting for better timing',
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Competition insight
    if (priceAnalysis.competitionScore > 70) {
      insights.push({
        type: 'caution',
        text: 'High competition detected - pricing strategy is critical',
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    return insights;
  };

  const keyInsights = getKeyInsights();

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-400" />
          Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
          <p className="text-gray-200 leading-relaxed">
            {generateSummary()}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              {priceAnalysis.demandScore.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Demand Score</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              {priceAnalysis.competitionScore.toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Competition</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              {(priceAnalysis.factors.seasonalDemand * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400">Seasonal Demand</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              {priceAnalysis.priceConfidence}%
            </div>
            <div className="text-xs text-gray-400">Confidence</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Key Insights
          </h4>
          <div className="space-y-2">
            {keyInsights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  insight.type === 'opportunity' ? 'bg-green-500/10 border border-green-500/20' :
                  insight.type === 'caution' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                  'bg-blue-500/10 border border-blue-500/20'
                }`}
              >
                <div className={`${
                  insight.type === 'opportunity' ? 'text-green-400' :
                  insight.type === 'caution' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {insight.icon}
                </div>
                <span className="text-sm text-gray-200">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {priceAnalysis.recommendations && priceAnalysis.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {priceAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-200">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Level */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-300">Analysis Confidence</span>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${
                confidenceLevel === 'high' ? 'border-green-500 text-green-400' :
                confidenceLevel === 'medium' ? 'border-yellow-500 text-yellow-400' :
                'border-red-500 text-red-400'
              }`}
            >
              {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}
            </Badge>
            <span className="text-sm font-medium text-white">
              {priceAnalysis.priceConfidence}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 