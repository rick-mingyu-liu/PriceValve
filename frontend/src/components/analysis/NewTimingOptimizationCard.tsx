"use client";

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimingOptimizationCardProps {
  urgency: 'high' | 'medium' | null;
  timingRecommendation: string;
  timingReason: string;
}

const UrgencyLevel: React.FC<{ urgency: 'high' | 'medium' | null }> = ({ urgency }) => {
  if (!urgency) return null;
  
  const urgencyConfig = {
    high: { text: 'High Urgency', color: 'bg-red-900/50 text-red-400 border-red-500/50' },
    medium: { text: 'Medium Urgency', color: 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' },
  };

  const config = urgencyConfig[urgency];

  return (
    <div className={`px-3 py-1 text-xs font-bold rounded-full border ${config.color}`}>
      {config.text}
    </div>
  );
};

export const TimingOptimizationCard: React.FC<TimingOptimizationCardProps> = ({
  urgency,
  timingRecommendation,
  timingReason,
}) => {
  return (
    <motion.div 
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="bg-yellow-600/30 p-3 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Timing Strategy</h3>
            <p className="text-sm text-slate-400">When should you make changes?</p>
          </div>
        </div>
        <UrgencyLevel urgency={urgency} />
      </div>

      <div className="mt-6 flex-grow flex flex-col justify-center">
        <p className="text-xl font-semibold text-white leading-relaxed">{timingRecommendation}</p>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">{timingReason}</p>
      </div>
    </motion.div>
  );
}; 