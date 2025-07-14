"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Gamepad2, Star, ArrowRight, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Game {
  appId: number
  name: string
  price: number
  developer: string
  headerImage: string
  genres: string[]
  positive: number
  negative: number
  owners: string
  cluster?: string
}

interface GameSelectorProps {
  onGameSelect?: (game: Game) => void
  showSimilarGames?: boolean
  currentGameId?: number
}

export function GameSelector({ onGameSelect, showSimilarGames = true, currentGameId }: GameSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [similarGames, setSimilarGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (currentGameId && showSimilarGames) {
      loadSimilarGames(currentGameId)
    }
  }, [currentGameId, showSimilarGames])

  const loadSimilarGames = async (appId: number) => {
    try {
      // Get current game data to find similar games
      const currentGame = await api.getSteamData(appId.toString())
      if (currentGame.success && currentGame.data?.genres) {
        const genreQuery = currentGame.data.genres[0] || "action"
        const response = await api.searchGames(genreQuery, 6)
        if (response.success && response.data?.games) {
          setSimilarGames(response.data.games.filter((game: { appId: string }) => game.appId !== appId))
        }
      }
    } catch (error) {
      console.error("Failed to load similar games:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await api.searchGames(searchQuery, 8)
      if (response.success && response.data?.games) {
        setSearchResults(response.data.games)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
    if (onGameSelect) {
      onGameSelect(game)
    }
  }

  const handleAnalyzeGame = (game: Game) => {
    router.push(`/analyze/${game.appId}`)
  }

  const getRating = (game: Game) => {
    if (game.positive === 0 && game.negative === 0) return 0
    return Math.round((game.positive / (game.positive + game.negative)) * 100)
  }

  const GameCard = ({ game, variant = "default" }: { game: Game; variant?: "default" | "compact" }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#00D4FF]/50 hover:shadow-lg hover:shadow-[#00D4FF]/10 ${
        variant === "compact" ? "p-3" : "p-4"
      }`}
      onClick={() => handleGameSelect(game)}
    >
      <div className="flex items-start space-x-3">
        <img
          src={game.headerImage}
          alt={game.name}
          className={`rounded-md object-cover ${
            variant === "compact" ? "w-16 h-12" : "w-20 h-15"
          }`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white truncate ${
            variant === "compact" ? "text-sm" : "text-base"
          }`}>
            {game.name}
          </h3>
          <p className={`text-gray-400 ${
            variant === "compact" ? "text-xs" : "text-sm"
          }`}>
            {game.developer}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[#00D4FF] font-bold">
              ${game.price.toFixed(2)}
            </span>
            {game.positive > 0 && (
              <div className="flex items-center text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs ml-1">
                  {getRating(game)}%
                </span>
              </div>
            )}
          </div>
        </div>
        {variant === "default" && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleAnalyzeGame(game)
            }}
            className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white"
          >
            Analyze
          </Button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Search className="w-6 h-6 mr-2 text-[#00D4FF]" />
          Find Games (PriceValveScript.js Style)
        </h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search games by name, genre, or developer..."
            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              <h3 className="text-lg font-semibold text-[#00D4FF]">Search Results</h3>
              <div className="grid gap-3">
                {searchResults.map((game) => (
                  <GameCard key={game.appId} game={game} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Similar Games Section (like getSimilarGames in PriceValveScript.js) */}
      {showSimilarGames && similarGames.length > 0 && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Gamepad2 className="w-6 h-6 mr-2 text-[#00D4FF]" />
            Similar Games (Cluster-based)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarGames.map((game) => (
              <GameCard key={game.appId} game={game} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {/* Selected Game Details (like pickGame in PriceValveScript.js) */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/50 border border-[#00D4FF]/30 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-[#00D4FF]">Selected Game</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGame(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
            
            <div className="flex items-start space-x-4">
              <img
                src={selectedGame.headerImage}
                alt={selectedGame.name}
                className="w-24 h-18 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">{selectedGame.name}</h4>
                <p className="text-gray-400 text-sm">{selectedGame.developer}</p>
                {selectedGame.cluster && (
                  <p className="text-[#00D4FF] text-sm">Cluster {selectedGame.cluster}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-[#00D4FF] font-bold text-lg">
                    ${selectedGame.price.toFixed(2)}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">{getRating(selectedGame)}%</span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() => handleAnalyzeGame(selectedGame)}
                    className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white"
                  >
                    Analyze Game
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => loadSimilarGames(selectedGame.appId)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Find Similar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 