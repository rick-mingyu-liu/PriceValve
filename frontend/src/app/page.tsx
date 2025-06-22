"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calculator, 
  BarChart3, 
  Target,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { extractAppIdFromUrl } from "@/lib/api";

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const isHeroInView = useInView(heroRef)
  const isFeaturesInView = useInView(featuresRef)
  const [isClient, setIsClient] = useState(false)
  const [steamUrl, setSteamUrl] = useState("")
  const [ctaSteamUrl, setCtaSteamUrl] = useState("")

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

  const handleAnalyze = (url: string) => {
    if (url.trim()) {
      console.log("Analyzing Steam game:", url)
      // Here you would typically send the URL to your backend for analysis
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-between px-8 py-6 relative z-40"
      >
        <motion.div
          className="text-2xl font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.a
            href="#"
            className="text-2xl font-bold flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Gamepad2 className="w-8 h-8 mr-2 text-[#00D4FF]" />
            PriceValve
          </motion.a>
        </motion.div>
      </motion.nav>
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
              Data-Driven Pricing for Indie Success
            </motion.h1>

            <motion.p
              initial={{ x: -100, opacity: 0 }}
              animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Turn pricing guesswork into profit 🎯 with AI-powered insights from real Steam marketplace data 📊
            </motion.p>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={isHeroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl font-semibold text-[#00D4FF]"
            >
              <span className="inline-block mr-2">🎲</span>
              From guessing →<span className="inline-block mx-2">💰</span>
              profit
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full space-y-4"
            >
              <input
                type="url"
                value={steamUrl}
                onChange={(e) => setSteamUrl(e.target.value)}
                placeholder="Paste your Steam game URL here..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white placeholder-gray-400"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={() => handleAnalyze(steamUrl)}
                  className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 group"
                >
                  Analyze Game
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Optimize Your Steam Game Pricing with Mathematical Precision
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Leverage advanced algorithms and real-time market data to maximize your game's revenue. 
            Get data-driven pricing recommendations backed by Steam, SteamSpy, and market analysis.
          </p>

          {/* Main Input Section */}
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-xl">Start Your Analysis</CardTitle>
              <CardDescription className="text-gray-300">
                Paste your Steam game URL below to get comprehensive pricing insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
                  placeholder="https://store.steampowered.com/app/367520/Hollow_Knight/"
                  value={steamUrl}
                  onChange={(e) => setSteamUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Analyze Game
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-purple-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Calculator className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white text-lg">Mathematical Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Advanced algorithms using price elasticity, demand curves, and market analysis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white text-lg">Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Live integration with Steam, SteamSpy, and market data sources
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-green-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-white text-lg">Precision Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Get exact price recommendations with confidence scores and market trends
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="text-center">
              <div className="bg-orange-600/20 p-3 rounded-full w-fit mx-auto mb-2">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-white text-lg">Instant Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-center">
                Comprehensive analysis with charts, recommendations, and actionable insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-8">Trusted by Game Developers Worldwide</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-gray-300">Games Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$2M+</div>
              <div className="text-gray-300">Revenue Optimized</div>
            </div>
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
            How It Works
          </motion.h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Connect Your Game 🎮",
                description: "Enter your Steam URL or select your genre",
                icon: <Target className="w-8 h-8" />,
              },
              {
                number: "2",
                title: "Get Instant Analysis 🤖",
                description: "AI analyzes competitors and market data",
                icon: <Search className="w-8 h-8" />,
              },
              {
                number: "3",
                title: "Optimize & Profit 💰",
                description: "Apply recommendations and track results",
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
      {/* Final CTA */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl font-bold mb-6"
          >
            Ready to Level Up Your Revenue?
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Join hundreds of indie developers using data to make smarter pricing decisions 🚀
          </motion.p>

          <motion.div
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-3 max-w-4xl mx-auto">
              <input
                type="url"
                value={ctaSteamUrl}
                onChange={(e) => setCtaSteamUrl(e.target.value)}
                placeholder="Paste your Steam game URL here..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white placeholder-gray-400"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => handleAnalyze(ctaSteamUrl)}
                  className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 group whitespace-nowrap"
                >
                  Get Free Analysis
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🚀
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            className="text-[#00D4FF] text-lg font-semibold"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Free analysis shows you exactly what your competitors charge 🕵️
          </motion.p>
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
            {["Privacy Policy", "Contact", "Support"].map((link) => (
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
