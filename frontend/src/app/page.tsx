"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, Check, X, Target, Search, TrendingUp, Gamepad2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { extractAppIdFromUrl, isValidSteamUrl } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { GameSelector } from "@/components/GameSelector"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor((progress * end) / 100) * 100)
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const isHeroInView = useInView(heroRef)
  const isFeaturesInView = useInView(featuresRef)
  const [isClient, setIsClient] = useState(false)
  const [steamUrl, setSteamUrl] = useState("")
  const [error, setError] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: 10, top: 20 },
    { left: 80, top: 60 },
    { left: 30, top: 80 },
    { left: 70, top: 30 },
    { left: 50, top: 70 },
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnalyze = async (url: string) => {
    if (!url.trim()) {
      setError("Please enter a Steam game URL")
      return
    }

    if (!isValidSteamUrl(url)) {
      setError("Please enter a valid Steam game URL (e.g., https://store.steampowered.com/app/123456)")
      return
    }

    const appId = extractAppIdFromUrl(url)
    if (!appId) {
      setError("Could not extract App ID from the provided URL")
      return
    }

    setIsAnalyzing(true)
    setError("")
    
    try {
      // Redirect to analysis page
      router.push(`/analyze/${appId}`)
    } catch (error) {
      setError("Failed to start analysis. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze(steamUrl)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center px-8 py-10 relative">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold leading-tight"
            >
              Is Your Steam Game Priced Right? Let's Find Out! 🎮
            </motion.h1>

            <motion.p
              initial={{ x: -100, opacity: 0 }}
              animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Drop your Steam URL, get math-backed pricing advice in seconds. 
              No guesswork, just data.
              <br />
              (And you'll make more money!)
            </motion.p>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl font-semibold text-[#00D4FF]"
            >
              <span className="inline-block mr-2">🎲</span>
              Stop guessing →<span className="inline-block mx-2">💰</span>
              start earning
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full space-y-4"
            >
              <div className="relative">
                <input
                  type="url"
                  value={steamUrl}
                  onChange={(e) => {
                    setSteamUrl(e.target.value)
                    setError("")
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="https://store.steampowered.com/app/730/Counter-Strike-2"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white placeholder-gray-400"
                  disabled={isAnalyzing}
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </motion.div>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={() => handleAnalyze(steamUrl)}
                  disabled={isAnalyzing}
                  className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] disabled:bg-gray-600 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 group"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Game
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative">
              <motion.div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Pricing Analysis</span>
                </div>

                <div className="space-y-3">
                  <motion.div
                    className="flex justify-between items-center"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 212, 255, 0.1)" }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span>Your Game</span>
                    <span className="text-[#00D4FF] font-bold">$19.99</span>
                  </motion.div>

                  {[
                    { name: "Competitor A", price: "$24.99" },
                    { name: "Competitor B", price: "$14.99" },
                    { name: "Market Average", price: "$18.50" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-400"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, color: "#ffffff" }}
                    >
                      <span>{item.name}</span>
                      <span>{item.price}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Revenue Projection</div>
                  <div className="text-2xl font-bold text-green-400 flex items-center">+47% 📈</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        {/* Floating particles - only render on client to avoid hydration mismatch */}
        {isClient &&
          particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00D4FF] rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, 50 - i * 25, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
            />
          ))}
      </section>
      {/* Problem Statement */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-relaxed">
              "<AnimatedCounter end={18000} /> games hit Steam in 2024 🎮. Most failed from bad pricing, not bad code 💔"
            </blockquote>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-8 text-red-400">The Usual Suspects</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎲", text: "Throwing darts at price tags" },
                  { icon: "💸", text: "Leaving money on the table" },
                  { icon: "⏰", text: "Launching at the wrong time" },
                  { icon: "👁️‍🗨️", text: "Blind to what competitors charge" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <X className="text-red-400 w-6 h-6" />
                    <motion.span
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, delay: index * 0.5 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-8 text-[#00D4FF]">How We Fix It</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎯", text: "Data-backed price recommendations" },
                  { icon: "🔍", text: "Spy on your competitors (legally)" },
                  { icon: "⏰", text: "Find the perfect launch window" },
                  { icon: "📈", text: "Track your revenue wins" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: -10, scale: 1.02 }}
                  >
                    <Check className="text-[#00D4FF] w-6 h-6" />
                    <motion.span
                      className="text-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, delay: index * 0.5 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            How It Works (It's Pretty Simple)
          </motion.h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Drop Your Steam URL 🎮",
                description: "Paste your game's Steam page link",
                icon: <Target className="w-8 h-8" />,
              },
              {
                number: "2",
                title: "Get Instant Analysis 🤖",
                description: "We crunch the numbers and give you insights",
                icon: <Search className="w-8 h-8" />,
              },
              {
                number: "3",
                title: "Price Smarter, Earn More 💰",
                description: "Apply our recommendations and watch revenue grow",
                icon: <TrendingUp className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-[#00D4FF] w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-6 relative">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Features List */}
      <section ref={featuresRef} className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            What PriceValve Actually Does 🚀
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Column 1 */}
            <div className="space-y-12">
              {[
                {
                  emoji: "🎯",
                  title: "PRICE ANALYSIS",
                  description: "Is your game priced too high, too low, or just right 🤔",
                  arrow: "Get a confidence score for your current price point",
                },
                {
                  emoji: "🕵️",
                  title: "COMPETITOR COMPARISON",
                  description: "Compare your game to similar titles in your genre",
                  arrow: "Knowledge is power, especially about your competition",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 py-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 rounded-lg px-4 group cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00D4FF]/10"
                >
                  <div className="text-4xl">{feature.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#00D4FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-2 leading-relaxed">{feature.description}</p>
                    <p className="text-[#00D4FF] italic flex items-center group-hover:translate-x-2 transition-transform">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {feature.arrow}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-12">
              {[
                {
                  emoji: "📈",
                  title: "MARKET INSIGHTS",
                  description: "Understand what players actually want (and pay for)",
                  arrow: "Data beats assumptions every time",
                },
                {
                  emoji: "🚀",
                  title: "OPTIMIZATION TIPS",
                  description: "Get recommendations to improve your pricing ⭐",
                  arrow: "Actionable advice based on your game's data",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 py-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 rounded-lg px-4 group cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00D4FF]/10"
                >
                  <div className="text-4xl">{feature.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#00D4FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-2 leading-relaxed">{feature.description}</p>
                    <p className="text-[#00D4FF] italic flex items-center group-hover:translate-x-2 transition-transform">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {feature.arrow}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Game Discovery Section */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Discover Games (PriceValveScript.js Style) 🎮
          </motion.h2>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto"
          >
            Search for games, find similar titles, and get instant pricing analysis. 
            Just like the PriceValveScript.js functionality, but with a modern interface.
          </motion.p>

          <GameSelector />
        </div>
      </section>
      {/* Footer */}
      <motion.footer
        className="bg-[#0a0a0a] py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 PriceValve |
            {["Privacy Policy", "Contact", "Support"].map((link, index) => (
              <motion.a
                key={link}
                href="#"
                className="hover:text-gray-400 transition-colors ml-2"
                whileHover={{ color: "#00D4FF" }}
              >
                {link}
              </motion.a>
            ))}
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
