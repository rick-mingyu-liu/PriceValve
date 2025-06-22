"use client"

import { motion } from "framer-motion"
import { Star, Users, Calendar, Tag } from "lucide-react"
import { ComprehensiveAnalysis } from "@/lib/api"

interface GameHeaderProps {
  analysis: ComprehensiveAnalysis
}

export default function GameHeader({ analysis }: GameHeaderProps) {
  const gameName = analysis.name || "Unknown Game"
  const headerImage = analysis.steamData?.headerImage || "/placeholder-game.jpg"
  const developer = analysis.steamData?.developer || analysis.steamSpyData?.developer || "Unknown"
  const publisher = analysis.steamData?.publisher || analysis.steamSpyData?.publisher || "Unknown"
  const releaseDate = analysis.steamData?.releaseDate || analysis.steamSpyData?.releaseDate || "Unknown"
  const genres = analysis.steamData?.genres || []
  const tags = analysis.steamData?.tags || []
  
  // Calculate review score
  const positiveReviews = analysis.steamSpyData?.positive || 0
  const negativeReviews = analysis.steamSpyData?.negative || 0
  const totalReviews = positiveReviews + negativeReviews
  const reviewScore = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0
  
  // Format owners
  const owners = analysis.steamSpyData?.owners || "0"
  const formattedOwners = formatOwners(owners)
  
  // Format release date
  const formattedReleaseDate = formatReleaseDate(releaseDate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* Header Image */}
      <div className="relative h-64 lg:h-80">
        <img
          src={headerImage}
          alt={gameName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-game.jpg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-2"
          >
            {gameName}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 text-sm text-gray-300"
          >
            <span>by {developer}</span>
            {publisher !== developer && <span>• Published by {publisher}</span>}
            <span>• App ID: {analysis.appId}</span>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Review Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-lg font-semibold text-white">
                {reviewScore.toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Positive Reviews</p>
            <p className="text-xs text-gray-500">
              {totalReviews.toLocaleString()} total
            </p>
          </motion.div>

          {/* Owners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-400 mr-1" />
              <span className="text-lg font-semibold text-white">
                {formattedOwners}
              </span>
            </div>
            <p className="text-sm text-gray-400">Owners</p>
          </motion.div>

          {/* Release Date */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-green-400 mr-1" />
              <span className="text-lg font-semibold text-white">
                {formattedReleaseDate}
              </span>
            </div>
            <p className="text-sm text-gray-400">Release Date</p>
          </motion.div>

          {/* Current Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-lg font-semibold text-[#00D4FF]">
                ${analysis.steamData?.price ? (analysis.steamData.price / 100).toFixed(2) : "Free"}
              </span>
            </div>
            <p className="text-sm text-gray-400">Current Price</p>
            {analysis.steamData?.discountPercent && (
              <p className="text-xs text-green-400">
                {analysis.steamData.discountPercent}% off
              </p>
            )}
          </motion.div>
        </div>

        {/* Genres and Tags */}
        {(genres.length > 0 || tags.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            {genres.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.slice(0, 5).map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-xs rounded-full border border-[#00D4FF]/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Utility functions
function formatOwners(owners: string): string {
  const num = parseInt(owners.replace(/[^\d]/g, ''))
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

function formatReleaseDate(dateString: string): string {
  if (dateString === "Unknown") return "Unknown"
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
} 