import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveAnalysis } from "@/lib/api";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { DollarSign, TrendingUp, Target, Zap } from "lucide-react";

interface PriceOptimizationCardProps {
  analysis: ComprehensiveAnalysis;
}

export function PriceOptimizationCard({ analysis }: PriceOptimizationCardProps) {
  const priceAnalysis = analysis.priceAnalysis;
  const steamData = analysis.steamData;

  if (!priceAnalysis) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Price Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No price analysis data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Generate revenue curve data
  const generateRevenueCurve = () => {
    const currentPrice = priceAnalysis.currentPrice / 100;
    const recommendedPrice = priceAnalysis.recommendedPrice / 100;
    const elasticity = priceAnalysis.factors.priceElasticity;
    
    const data = [];
    const priceRange = [currentPrice * 0.5, currentPrice * 1.5];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const price = priceRange[0] + (priceRange[1] - priceRange[0]) * (i / steps);
      const demandMultiplier = Math.pow(price / currentPrice, elasticity);
      const demand = 1000 * demandMultiplier; // Base demand of 1000
      const revenue = price * demand;
      
      data.push({
        price: price.toFixed(2),
        revenue: Math.round(revenue),
        demand: Math.round(demand),
        isCurrent: Math.abs(price - currentPrice) < 0.01,
        isRecommended: Math.abs(price - recommendedPrice) < 0.01
      });
    }
    
    return data;
  };

  const revenueData = generateRevenueCurve();
  const currentPrice = priceAnalysis.currentPrice / 100;
  const recommendedPrice = priceAnalysis.recommendedPrice / 100;
  const priceDifference = recommendedPrice - currentPrice;
  const priceChangePercent = ((priceDifference / currentPrice) * 100);

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          What Price?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Recommendation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Price</div>
            <div className="text-2xl font-bold text-white">
              ${currentPrice.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
            <div className="text-sm text-gray-400 mb-1">Recommended</div>
            <div className="text-2xl font-bold text-purple-300">
              ${recommendedPrice.toFixed(2)}
            </div>
            <div className={`text-sm ${priceDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceDifference > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Confidence Score</span>
            <span className="text-sm font-medium text-white">{priceAnalysis.priceConfidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${priceAnalysis.priceConfidence}%` }}
            ></div>
          </div>
        </div>

        {/* Revenue Curve Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Optimization Curve
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="price" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'revenue' ? `$${(value / 1000).toFixed(1)}k` : value,
                    name === 'revenue' ? 'Revenue' : 'Demand'
                  ]}
                  labelFormatter={(label) => `Price: $${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
                {/* Highlight current and recommended prices */}
                {revenueData.map((point, index) => (
                  point.isCurrent && (
                    <Line
                      key={`current-${index}`}
                      type="monotone"
                      dataKey="revenue"
                      data={[point]}
                      stroke="#10B981"
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#10B981' }}
                    />
                  )
                ))}
                {revenueData.map((point, index) => (
                  point.isRecommended && (
                    <Line
                      key={`recommended-${index}`}
                      type="monotone"
                      dataKey="revenue"
                      data={[point]}
                      stroke="#F59E0B"
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#F59E0B' }}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Current Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Recommended Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Revenue Curve</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
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
            <div className="text-xs text-gray-400">Competition Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 