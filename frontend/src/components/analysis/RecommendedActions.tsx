"use client";

import { DollarSign, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';


interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  priority: 'High' | 'Medium' | 'Low';
  iconBgColor: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, benefit, priority, iconBgColor }) => {
  const priorityColors = {
    High: 'border-red-500/50 bg-red-900/30 text-red-400',
    Medium: 'border-yellow-500/50 bg-yellow-900/30 text-yellow-400',
    Low: 'border-sky-500/50 bg-sky-900/30 text-sky-400',
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col h-full"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
        <div className={`px-3 py-1 text-xs font-bold rounded-full border ${priorityColors[priority]}`}>
          {priority}
        </div>
      </div>
      <div className="flex-grow mt-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm mt-2">{description}</p>
      </div>
      <div className="pt-4 mt-auto">
        <p className="text-sm font-semibold text-green-400">{benefit}</p>
      </div>
    </motion.div>
  );
};

interface RecommendedActionsProps {
  currentPrice: number;
  recommendedPrice: number;
  revenueIncrease: number;
  underpricedComparedToSimilar: boolean;
  marketPositioningStatement: string;
  closestCompetitorName: string;
  competitorPriceComparison?: Array<{ name: string; price: number; isTarget?: boolean; isRecommended?: boolean }>;
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({
  currentPrice,
  recommendedPrice,
  revenueIncrease,
  underpricedComparedToSimilar,
  marketPositioningStatement,
  closestCompetitorName,
  competitorPriceComparison = [],
}) => {
  // Add null checks and fallback values
  const safeCurrentPrice = currentPrice || 0;
  const safeRecommendedPrice = recommendedPrice || 0;
  const safeRevenueIncrease = revenueIncrease || 0;
  const safeMarketPositioningStatement = marketPositioningStatement || "Position as premium indie title. Your quality justifies higher pricing tier.";

  // Get top competitors for more specific recommendations
  const topCompetitors = competitorPriceComparison
    .filter(comp => !comp.isTarget)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  const priceDirection = safeRecommendedPrice > safeCurrentPrice ? 'increase' : 'decrease';
  const priceChange = Math.abs(safeRecommendedPrice - safeCurrentPrice);

  return (
    <section>
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Recommended Actions</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          Strategic steps to optimize your pricing and market position, prioritized by impact.
        </p>
      </div>
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        <ActionCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconBgColor="bg-green-600/30"
          title={priceDirection === 'increase' ? "Increase Base Price" : "Adjust Base Price"}
          description={
            priceDirection === 'increase' 
              ? `Your game is underpriced compared to similar titles. Increase from $${(safeCurrentPrice / 100).toFixed(2)} to $${(safeRecommendedPrice / 100).toFixed(2)}.`
              : `Consider adjusting your price from $${(safeCurrentPrice / 100).toFixed(2)} to $${(safeRecommendedPrice / 100).toFixed(2)} for better market positioning.`
          }
          benefit={`+${safeRevenueIncrease.toFixed(0)}% revenue potential`}
          priority="High"
        />
        <ActionCard
          icon={<Target className="w-6 h-6 text-white" />}
          iconBgColor="bg-red-600/30"
          title="Market Positioning"
          description={
            closestCompetitorName 
              ? `${safeMarketPositioningStatement} Focus on differentiating from ${closestCompetitorName}.`
              : safeMarketPositioningStatement
          }
          benefit="Better brand perception"
          priority="High"
        />
        <ActionCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          iconBgColor="bg-yellow-600/30"
          title="Optimal Launch Window"
          description="Best time to implement price change is during your next major update or DLC release."
          benefit="Minimize player backlash"
          priority="Medium"
        />
        <ActionCard
          icon={<Users className="w-6 h-6 text-white" />}
          iconBgColor="bg-sky-600/30"
          title="Competitor Analysis"
          description={
            topCompetitors.length > 0
              ? `Monitor ${topCompetitors.map(c => c.name).join(', ')} - they're your key competitors in this price range.`
              : `Monitor ${closestCompetitorName} - they're your closest competitor at the same price point.`
          }
          benefit="Stay competitive"
          priority="Low"
        />
      </motion.div>

      {/* Additional Competitor Insights */}
      {topCompetitors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-slate-900/30 border border-slate-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#00D4FF]" />
            Key Competitor Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {topCompetitors.map((competitor, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-white text-sm">{competitor.name}</h4>
                <p className="text-[#00D4FF] font-bold">${(competitor.price / 100).toFixed(2)}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {competitor.price > safeCurrentPrice ? 'Higher priced' : 'Lower priced'} than your game
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}; 