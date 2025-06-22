"use client";

import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceOptimizationCardProps {
  optimalPrice: number;
  currentPrice: number;
  revenueIncrease: number;
  confidence: number;
}

export const PriceOptimizationCard: React.FC<PriceOptimizationCardProps> = ({
  optimalPrice,
  currentPrice,
  revenueIncrease,
  confidence,
}) => {
  const priceChange = optimalPrice - currentPrice;

  return (
    <motion.div 
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-blue-600/30 p-3 rounded-lg">
          <Coins className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Price Optimization</h3>
          <p className="text-sm text-slate-400">What price should you charge?</p>
        </div>
      </div>
      
      <div className="my-8 text-center flex-grow flex flex-col justify-center">
        <p className="text-6xl font-extrabold text-blue-400">${(optimalPrice / 100).toFixed(2)}</p>
        <p className="text-sm text-slate-300 mt-2">Recommended Price</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Price Change</span>
          <span className={`font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}${(priceChange / 100).toFixed(2)} from current
          </span>
        </div>
        <div className="w-full bg-slate-700 h-px" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Revenue Impact</span>
          <span className="font-semibold text-green-400">+{revenueIncrease.toFixed(0)}% potential</span>
        </div>
        <div className="w-full bg-slate-700 h-px" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Confidence</span>
          <span className="font-semibold text-white">{confidence.toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  );
}; 