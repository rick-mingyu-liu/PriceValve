"use client";

import { motion } from 'framer-motion';

interface ExecutiveSummaryProps {
  summaryText: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summaryText }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Executive Summary</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          A high-level overview of our findings and key recommendation.
        </p>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        <p className="text-slate-300 whitespace-pre-line leading-relaxed text-justify">
          {summaryText}
        </p>
      </div>
    </motion.section>
  );
}; 