'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '../../../data-models/types/game';

interface DataFetchingDemoProps {
  apiUrl?: string;
}

export default function DataFetchingDemo({ apiUrl = 'http://localhost:3001/api' }: DataFetchingDemoProps) {
  const [appId, setAppId] = useState('730'); // Counter-Strike 2
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeReviews, setIncludeReviews] = useState(true);
  const [includePlayerCount, setIncludePlayerCount] = useState(true);
  const [includeSalesHistory, setIncludeSalesHistory] = useState(true);
  const [cacheStats, setCacheStats] = useState<any>(null);

  const fetchGameData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        includeReviews: includeReviews.toString(),
        includePlayerCount: includePlayerCount.toString(),
        includeSalesHistory: includeSalesHistory.toString()
      });

      const response = await fetch(`${apiUrl}/data/game/${appId}?${params}`);
      const result = await response.json();

      if (result.success) {
        setGameData(result.data);
      } else {
        setError(result.error || 'Failed to fetch game data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCacheStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/data/cache/stats`);
      const result = await response.json();
      
      if (result.success) {
        setCacheStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch cache stats:', err);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch(`${apiUrl}/data/cache`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        alert('Cache cleared successfully!');
        fetchCacheStats();
      }
    } catch (err) {
      alert('Failed to clear cache');
    }
  };

  useEffect(() => {
    fetchCacheStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">🎮 PriceValve Data Fetching Demo</h2>
        
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Steam App ID:</label>
            <input
              type="number"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 730 for Counter-Strike 2"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchGameData}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch Game Data'}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeReviews}
              onChange={(e) => setIncludeReviews(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include Reviews</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includePlayerCount}
              onChange={(e) => setIncludePlayerCount(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include Player Count</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeSalesHistory}
              onChange={(e) => setIncludeSalesHistory(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include Sales History</span>
          </label>
        </div>

        {/* Cache Stats */}
        {cacheStats && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Cache Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Cache Size:</span> {cacheStats.size} entries
              </div>
              <div>
                <button
                  onClick={clearCache}
                  className="text-red-600 hover:text-red-800 underline"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Game Data Display */}
        {gameData && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{gameData.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">App ID:</span> {gameData.appId}</div>
                  <div><span className="font-medium">Price:</span> ${gameData.price}</div>
                  {gameData.discountPercent && (
                    <div><span className="font-medium">Discount:</span> {gameData.discountPercent}%</div>
                  )}
                  <div><span className="font-medium">Free:</span> {gameData.isFree ? 'Yes' : 'No'}</div>
                  {gameData.releaseDate && (
                    <div><span className="font-medium">Release Date:</span> {gameData.releaseDate}</div>
                  )}
                  {gameData.developer && (
                    <div><span className="font-medium">Developer:</span> {gameData.developer}</div>
                  )}
                  {gameData.publisher && (
                    <div><span className="font-medium">Publisher:</span> {gameData.publisher}</div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="font-semibold mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  {gameData.owners && (
                    <div><span className="font-medium">Owners:</span> {gameData.owners}</div>
                  )}
                  {gameData.averagePlaytime && (
                    <div><span className="font-medium">Avg Playtime:</span> {gameData.averagePlaytime}h</div>
                  )}
                  {gameData.reviewScore && (
                    <div><span className="font-medium">Review Score:</span> {gameData.reviewScore}%</div>
                  )}
                  {gameData.totalReviews && (
                    <div><span className="font-medium">Total Reviews:</span> {gameData.totalReviews.toLocaleString()}</div>
                  )}
                  <div><span className="font-medium">Sales History Points:</span> {gameData.salesHistory.length}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {gameData.shortDescription && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-700 line-clamp-3">{gameData.shortDescription}</p>
              </div>
            )}

            {/* Tags */}
            {gameData.tags && gameData.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {gameData.tags.slice(0, 10).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {gameData.tags.length > 10 && (
                    <span className="text-gray-500 text-xs">+{gameData.tags.length - 10} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Sales History Chart */}
            {gameData.salesHistory && gameData.salesHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Sales History (Last 30 Days)</h4>
                <div className="bg-white rounded border p-4">
                  <div className="h-32 flex items-end justify-between space-x-1">
                    {gameData.salesHistory.slice(-10).map((point, index) => {
                      const maxOwners = Math.max(...gameData.salesHistory.map(p => p.owners));
                      const height = (point.owners / maxOwners) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="bg-blue-500 w-full rounded-t"
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {point.owners.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 