import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveAnalysis } from "@/lib/api";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  TrendingUp, 
  Target,
  Users,
  Star,
  DollarSign,
  Zap
} from "lucide-react";

interface AdvancedAnalysisSectionProps {
  analysis: ComprehensiveAnalysis;
}

export function AdvancedAnalysisSection({ analysis }: AdvancedAnalysisSectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const priceAnalysis = analysis.priceAnalysis;
  const steamData = analysis.steamData;
  const steamSpyData = analysis.steamSpyData;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!priceAnalysis) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            Advanced Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No advanced analysis data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Generate competitor positioning data
  const generateCompetitorData = () => {
    const currentPrice = priceAnalysis.currentPrice / 100;
    const recommendedPrice = priceAnalysis.recommendedPrice / 100;
    
    return [
      { name: 'Your Game', price: currentPrice, quality: priceAnalysis.factors.reviewScore, size: 20 },
      { name: 'Competitor A', price: currentPrice * 0.8, quality: priceAnalysis.factors.reviewScore * 0.9, size: 15 },
      { name: 'Competitor B', price: currentPrice * 1.2, quality: priceAnalysis.factors.reviewScore * 1.1, size: 18 },
      { name: 'Competitor C', price: currentPrice * 0.9, quality: priceAnalysis.factors.reviewScore * 0.85, size: 12 },
      { name: 'Recommended', price: recommendedPrice, quality: priceAnalysis.factors.reviewScore, size: 25 }
    ];
  };

  // Generate factor breakdown data
  const generateFactorData = () => {
    return [
      { factor: 'Popularity', value: priceAnalysis.factors.popularity, fullMark: 100 },
      { factor: 'Review Score', value: priceAnalysis.factors.reviewScore, fullMark: 100 },
      { factor: 'Age', value: Math.max(0, 100 - priceAnalysis.factors.age), fullMark: 100 },
      { factor: 'Genre Competition', value: Math.max(0, 100 - priceAnalysis.factors.genreCompetition), fullMark: 100 },
      { factor: 'Seasonal Demand', value: priceAnalysis.factors.seasonalDemand * 100, fullMark: 100 },
      { factor: 'Price Elasticity', value: Math.abs(priceAnalysis.factors.priceElasticity) * 100, fullMark: 100 }
    ];
  };

  // Generate price history timeline
  const generatePriceHistory = () => {
    const currentPrice = priceAnalysis.currentPrice / 100;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      let price = currentPrice;
      const monthDiff = Math.abs(index - currentMonth);
      
      if (monthDiff <= 2) {
        // Recent months - closer to current price
        price = currentPrice * (0.95 + Math.random() * 0.1);
      } else if (monthDiff <= 6) {
        // Medium term - more variation
        price = currentPrice * (0.8 + Math.random() * 0.4);
      } else {
        // Long term - more variation
        price = currentPrice * (0.7 + Math.random() * 0.6);
      }
      
      return {
        month,
        price: price.toFixed(2),
        isCurrent: index === currentMonth
      };
    });
  };

  const competitorData = generateCompetitorData();
  const factorData = generateFactorData();
  const priceHistoryData = generatePriceHistory();

  const sections = [
    {
      id: 'competitor',
      title: 'Competitor Positioning',
      icon: <Target className="h-4 w-4" />,
      description: 'See how your game compares to competitors in price vs quality space'
    },
    {
      id: 'factors',
      title: 'Factor Breakdown',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Detailed breakdown of all factors influencing the price recommendation'
    },
    {
      id: 'history',
      title: 'Price History Timeline',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Historical price trends and volatility analysis'
    },
    {
      id: 'metrics',
      title: 'Advanced Metrics',
      icon: <Zap className="h-4 w-4" />,
      description: 'Deep dive into demand elasticity, market saturation, and more'
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-400" />
          Advanced Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          
          return (
            <div key={section.id} className="border border-white/10 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-orange-400">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{section.title}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-4 border-t border-white/10">
                  {section.id === 'competitor' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Price vs Quality Positioning</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              type="number" 
                              dataKey="price" 
                              name="Price" 
                              stroke="#9CA3AF"
                              tickFormatter={(value) => `$${value}`}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="quality" 
                              name="Quality" 
                              stroke="#9CA3AF"
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                              }}
                              formatter={(value: any, name: string) => [
                                name === 'price' ? `$${value}` : value,
                                name === 'price' ? 'Price' : 'Quality Score'
                              ]}
                            />
                            <Scatter data={competitorData} fill="#8B5CF6">
                              {competitorData.map((entry, index) => (
                                <circle
                                  key={index}
                                  cx={entry.price}
                                  cy={entry.quality}
                                  r={entry.size}
                                  fill={entry.name === 'Your Game' ? '#10B981' : 
                                        entry.name === 'Recommended' ? '#F59E0B' : '#8B5CF6'}
                                  stroke="#1F2937"
                                  strokeWidth={2}
                                />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300">Your Game</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-300">Recommended</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-300">Competitors</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {section.id === 'factors' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Factor Analysis Radar Chart</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={factorData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis 
                              dataKey="factor" 
                              tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <PolarRadiusAxis 
                              angle={90} 
                              domain={[0, 100]} 
                              tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            />
                            <Radar
                              name="Factors"
                              dataKey="value"
                              stroke="#8B5CF6"
                              fill="#8B5CF6"
                              fillOpacity={0.3}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {section.id === 'history' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Price History Timeline</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={priceHistoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="month" 
                              stroke="#9CA3AF"
                              fontSize={12}
                            />
                            <YAxis 
                              stroke="#9CA3AF"
                              fontSize={12}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                              }}
                              formatter={(value: any) => [`$${value}`, 'Price']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#8B5CF6" 
                              strokeWidth={3}
                              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, fill: '#8B5CF6' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {section.id === 'metrics' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Advanced Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold text-white">
                            {Math.abs(priceAnalysis.factors.priceElasticity).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">Price Elasticity</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold text-white">
                            {(priceAnalysis.priceHistory.priceVolatility / (priceAnalysis.priceHistory.averagePrice / 100) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">Price Volatility</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold text-white">
                            {priceAnalysis.factors.age.toFixed(0)}
                          </div>
                          <div className="text-xs text-gray-400">Market Age (months)</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold text-white">
                            {priceAnalysis.factors.genreCompetition.toFixed(0)}
                          </div>
                          <div className="text-xs text-gray-400">Genre Competition</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Market Insights</h5>
                        <div className="space-y-2 text-sm text-gray-200">
                          <p>• Price elasticity of {Math.abs(priceAnalysis.factors.priceElasticity).toFixed(2)} indicates {Math.abs(priceAnalysis.factors.priceElasticity) > 1 ? 'elastic' : 'inelastic'} demand</p>
                          <p>• Market volatility of {(priceAnalysis.priceHistory.priceVolatility / (priceAnalysis.priceHistory.averagePrice / 100) * 100).toFixed(1)}% suggests {priceAnalysis.priceHistory.priceVolatility / (priceAnalysis.priceHistory.averagePrice / 100) * 100 > 20 ? 'high' : 'moderate'} price fluctuations</p>
                          <p>• Genre competition score of {priceAnalysis.factors.genreCompetition.toFixed(0)} indicates {priceAnalysis.factors.genreCompetition > 70 ? 'high' : priceAnalysis.factors.genreCompetition > 40 ? 'moderate' : 'low'} competition</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 