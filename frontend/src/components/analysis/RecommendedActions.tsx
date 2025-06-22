"use client";

import { DollarSign, Calendar, Target, Users } from 'lucide-react';
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
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({
  currentPrice,
  recommendedPrice,
  revenueIncrease,
  underpricedComparedToSimilar,
  marketPositioningStatement,
  closestCompetitorName,
}) => {
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
          title="Increase Base Price"
          description={`Your game is underpriced compared to similar titles. Increase from $${(currentPrice / 100).toFixed(2)} to $${(recommendedPrice / 100).toFixed(2)}.`}
          benefit={`+${revenueIncrease.toFixed(0)}% revenue potential`}
          priority="High"
        />
        <ActionCard
          icon={<Target className="w-6 h-6 text-white" />}
          iconBgColor="bg-red-600/30"
          title="Market Positioning"
          description={marketPositioningStatement}
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
          description={`Monitor ${closestCompetitorName} - they're your closest competitor at the same price point.`}
          benefit="Stay competitive"
          priority="Low"
        />
      </motion.div>
    </section>
  );
}; 