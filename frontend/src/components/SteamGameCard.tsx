'use client';

import { useState, useEffect } from 'react';
import { apiClient, SteamGame } from '../utils/api';

interface SteamGameCardProps {
  appId: number;
}

export default function SteamGameCard({ appId }: SteamGameCardProps) {
  const [game, setGame] = useState<SteamGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const gameData = await apiClient.getGameDetails(appId);
        setGame(gameData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [appId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">Game not found</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.name}</h3>
      <p className="text-sm text-gray-600 mb-4">App ID: {game.appid}</p>
      
      {game.price_overview && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Price:</span>
            <span className="font-medium text-green-600">
              {formatPrice(game.price_overview.final)}
            </span>
          </div>
          
          {game.price_overview.discount_percent > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Original Price:</span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(game.price_overview.initial)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-sm font-medium text-red-600">
                  -{game.price_overview.discount_percent}%
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Currency:</span>
            <span className="text-sm text-gray-600">
              {game.price_overview.currency}
            </span>
          </div>
        </div>
      )}
      
      {!game.price_overview && (
        <p className="text-sm text-gray-500">Price information not available</p>
      )}
    </div>
  );
} 