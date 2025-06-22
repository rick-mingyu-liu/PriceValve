"use client";

import Image from 'next/image';

interface OptimizationScoreProps {
  score: number;
}

const OptimizationScore: React.FC<OptimizationScoreProps> = ({ score }) => {
  const getStatus = () => {
    if (score >= 71) {
      return {
        text: 'Well Optimized',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        textColor: 'text-green-400',
        ringColor: 'ring-green-500',
      };
    }
    if (score >= 50) {
      return {
        text: 'Needs Attention',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        textColor: 'text-yellow-400',
        ringColor: 'ring-yellow-500',
      };
    }
    return {
      text: 'Action Needed',
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      textColor: 'text-red-400',
      ringColor: 'ring-red-500',
    };
  };

  const status = getStatus();
  const circumference = 2 * Math.PI * 56; // 2 * pi * r
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="60"
            cy="60"
          />
          <circle
            className={status.ringColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${status.textColor}`}>{Math.round(score)}%</span>
          <span className="text-xs text-gray-400">Score</span>
        </div>
      </div>
      <div className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
        {status.text}
      </div>
    </div>
  );
};


interface GameHeaderProps {
  gameName: string;
  developer: string;
  releaseDate: string;
  currentPrice: number;
  headerImage: string;
  optimizationScore: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameName,
  developer,
  releaseDate,
  currentPrice,
  headerImage,
  optimizationScore,
}) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 h-80">
      <Image
        src={headerImage}
        alt={`${gameName} background`}
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
      
      <div className="relative h-full p-8 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              {gameName}
            </h1>
            <p className="text-lg text-gray-300 font-light">
              by {developer}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-gray-400 text-sm">
                Released: {new Date(releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-white font-semibold text-lg bg-black/50 px-3 py-1 rounded-md">
                ${(currentPrice / 100).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <OptimizationScore score={optimizationScore} />
          </div>
        </div>
      </div>
    </div>
  );
}; 