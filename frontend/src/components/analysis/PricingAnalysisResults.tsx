"use client";

import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  change?: string;
  iconBgColor: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const MetricCard: React.FC<MetricCardProps> = ({ icon, value, label, sublabel, change, iconBgColor }) => {
  const valueColor = label === "Revenue Increase" ? "text-green-400" : "text-white";
  const changeColor = label === "Recommended Price" && change && change.startsWith('+') ? "text-green-400" : "text-red-400";
  
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex items-start space-x-5 shadow-lg"
    >
      <div className={`p-4 rounded-lg ${iconBgColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className="flex items-baseline space-x-2 mt-1">
          {change && <p className={`text-sm font-medium ${changeColor}`}>{change}</p>}
          <p className="text-xs text-slate-500">{sublabel}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface PricingAnalysisResultsProps {
  recommendedPrice: number;
  priceIncrease: number;
  revenueIncrease: number;
  confidenceScore: number;
}

export const PricingAnalysisResults: React.FC<PricingAnalysisResultsProps> = ({
  recommendedPrice,
  priceIncrease,
  revenueIncrease,
  confidenceScore,
}) => {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Pricing Analysis Results</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          A summary of our core findings based on market data and competitor analysis.
        </p>
      </div>
      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <MetricCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconBgColor="bg-blue-600/50"
          value={`$${(recommendedPrice / 100).toFixed(2)}`}
          label="Recommended Price"
          change={`${priceIncrease >= 0 ? '+' : ''}$${(priceIncrease / 100).toFixed(2)} from current`}
          sublabel="Optimal price point"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBgColor="bg-green-600/50"
          value={`+${revenueIncrease.toFixed(0)}%`}
          label="Revenue Increase"
          sublabel="Potential uplift"
        />
        <MetricCard
          icon={<Target className="w-6 h-6 text-white" />}
          iconBgColor="bg-yellow-600/50"
          value={`${confidenceScore.toFixed(0)}%`}
          label="Confidence Score"
          sublabel="High confidence"
        />
      </motion.div>
    </section>
  );
}; 