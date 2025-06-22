import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveAnalysis } from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Clock, Calendar, TrendingUp, TrendingDown, Minus, Zap, AlertTriangle } from "lucide-react";

interface TimingOptimizationCardProps {
  analysis: ComprehensiveAnalysis;
}

export function TimingOptimizationCard({ analysis }: TimingOptimizationCardProps) {
  const priceAnalysis = analysis.priceAnalysis;
  const steamSpyData = analysis.steamSpyData;

  if (!priceAnalysis) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Timing Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No timing analysis data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Generate seasonal demand data
  const generateSeasonalData = () => {
    const seasonalDemand = priceAnalysis.factors.seasonalDemand;
    const currentMonth = new Date().getMonth();
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => {
      let demand = 1.0;
      
      // Holiday season (Dec/Jan)
      if (index === 11 || index === 0) demand = 1.3;
      // Summer sales (Jul/Aug)
      else if (index === 6 || index === 7) demand = 1.2;
      // Black Friday (Nov)
      else if (index === 10) demand = 1.25;
      // Spring sales (Mar/Apr)
      else if (index === 2 || index === 3) demand = 1.1;
      
      return {
        month,
        demand: demand * 100,
        isCurrent: index === currentMonth,
        isOptimal: demand > 1.1
      };
    });
  };

  // Generate market timing data
  const generateMarketTimingData = () => {
    const trend = priceAnalysis.priceHistory.priceTrend;
    const volatility = priceAnalysis.priceHistory.priceVolatility;
    const averagePrice = priceAnalysis.priceHistory.averagePrice;
    
    return [
      { name: 'Price Trend', value: trend === 'increasing' ? 70 : trend === 'decreasing' ? 30 : 50, color: trend === 'increasing' ? '#10B981' : trend === 'decreasing' ? '#EF4444' : '#6B7280' },
      { name: 'Volatility', value: Math.min((volatility / averagePrice) * 100, 100), color: '#F59E0B' },
      { name: 'Market Stability', value: 100 - Math.min((volatility / averagePrice) * 100, 100), color: '#3B82F6' }
    ];
  };

  const seasonalData = generateSeasonalData();
  const marketTimingData = generateMarketTimingData();

  const getTimingRecommendation = () => {
    const trend = priceAnalysis.priceHistory.priceTrend;
    const seasonalDemand = priceAnalysis.factors.seasonalDemand;
    const confidence = priceAnalysis.priceConfidence;
    
    if (trend === 'increasing' && seasonalDemand > 1.1) {
      return {
        action: 'Increase price now',
        reason: 'Market is trending up and seasonal demand is high',
        urgency: 'high',
        icon: <TrendingUp className="h-4 w-4 text-green-400" />
      };
    } else if (trend === 'decreasing' && seasonalDemand < 1.0) {
      return {
        action: 'Wait for better timing',
        reason: 'Market is trending down and seasonal demand is low',
        urgency: 'low',
        icon: <Clock className="h-4 w-4 text-yellow-400" />
      };
    } else if (confidence > 80) {
      return {
        action: 'Good time to adjust',
        reason: 'High confidence in current market conditions',
        urgency: 'medium',
        icon: <Zap className="h-4 w-4 text-blue-400" />
      };
    } else {
      return {
        action: 'Monitor market closely',
        reason: 'Low confidence - wait for more stable conditions',
        urgency: 'low',
        icon: <AlertTriangle className="h-4 w-4 text-orange-400" />
      };
    }
  };

  const timingRec = getTimingRecommendation();

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          When to Change?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timing Recommendation */}
        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            {timingRec.icon}
            <span className="font-semibold text-white">{timingRec.action}</span>
          </div>
          <p className="text-sm text-gray-300">{timingRec.reason}</p>
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={`${
                timingRec.urgency === 'high' ? 'border-green-500 text-green-400' :
                timingRec.urgency === 'medium' ? 'border-yellow-500 text-yellow-400' :
                'border-gray-500 text-gray-400'
              }`}
            >
              {timingRec.urgency.charAt(0).toUpperCase() + timingRec.urgency.slice(1)} Priority
            </Badge>
          </div>
        </div>

        {/* Seasonal Demand Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Seasonal Demand Patterns
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={11}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Demand']}
                />
                <Bar 
                  dataKey="demand" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Timing Analysis */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Timing Analysis
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketTimingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {marketTimingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            {marketTimingData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price History Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              ${(priceAnalysis.priceHistory.lowestPrice / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">Lowest Price</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">
              ${(priceAnalysis.priceHistory.highestPrice / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">Highest Price</div>
          </div>
        </div>

        {/* Price Trend */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-300">Price Trend</span>
          <div className="flex items-center gap-2">
            {priceAnalysis.priceHistory.priceTrend === 'increasing' ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : priceAnalysis.priceHistory.priceTrend === 'decreasing' ? (
              <TrendingDown className="h-4 w-4 text-red-400" />
            ) : (
              <Minus className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-white capitalize">
              {priceAnalysis.priceHistory.priceTrend}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 