"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, Check, X, Target, Search, TrendingUp, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
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

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00D4FF] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
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
          <Gamepad2 className="w-8 h-8 mr-2 text-[#00D4FF]" />
          PriceValve
        </motion.div>
        <div className="flex space-x-8 items-center">
          {["Home", "Contact"].map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className="hover:text-[#00D4FF] transition-colors cursor-pointer"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Button
              className="bg-transparent border border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-white px-4 py-2 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </Button>
          </motion.div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center px-8 py-20 relative">
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
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="inline-block mr-2"
              >
                🎲
              </motion.span>
              From guessing →
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, delay: 1 }}
                className="inline-block mx-2"
              >
                💰
              </motion.span>
              profit
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white px-8 py-4 text-lg rounded-lg transition-all duration-300 group"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
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
        </motion.div>{" "}
        {/* Closing tag for motion.div */}
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#00D4FF] rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </section>{" "}
      {/* Closing tag for section */}
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
            <blockquote className="text-3xl lg:text-4xl font-bold mb-8 leading-relaxed">
              "<AnimatedCounter end={18000} /> games launched on Steam in 2024 🎮. Most failed due to poor pricing
              decisions, not bad gameplay 💔"
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
              <h3 className="text-2xl font-bold mb-8 text-red-400">Common Problems</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎲", text: "Pricing guesswork" },
                  { icon: "💸", text: "Missing revenue opportunities" },
                  { icon: "⏰", text: "Poor launch timing" },
                  { icon: "👁️‍🗨️", text: "No competitor insights" },
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
              <h3 className="text-2xl font-bold mb-8 text-[#00D4FF]">Our Solutions</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎯", text: "Data-driven pricing recommendations" },
                  { icon: "🔍", text: "Real-time competitor analysis" },
                  { icon: "⏰", text: "Optimal launch timing" },
                  { icon: "📈", text: "Revenue impact tracking" },
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
      {/* Features List */}
      <section ref={featuresRef} className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            How PriceValve Powers Your Success 🚀
          </motion.h2>

          <div className="space-y-12">
            {[
              {
                emoji: "🎯",
                title: "PRICING INTELLIGENCE",
                description: "Get optimal price points with confidence scores 💯",
                arrow: "Stop guessing prices, start hitting revenue targets",
              },
              {
                emoji: "🕵️",
                title: "COMPETITOR ANALYSIS",
                description: "Track similar games and market positioning 📊",
                arrow: "Know what competitors charge and position yourself to win",
              },
              {
                emoji: "📈",
                title: "MARKET INSIGHTS",
                description: "Understand player behavior and market trends 🌟",
                arrow: "Make decisions based on real data, not assumptions",
              },
              {
                emoji: "🚀",
                title: "LAUNCH TIMING",
                description: "Identify perfect windows for releases and sales ⭐",
                arrow: "Launch when your audience is most engaged",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-6 py-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300 rounded-lg px-4 group cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0, 212, 255, 0.1)",
                }}
              >
                <motion.div
                  className="text-4xl"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {feature.emoji}
                </motion.div>
                <div className="flex-1">
                  <motion.h3 className="text-2xl font-bold mb-2" whileHover={{ color: "#00D4FF" }}>
                    {feature.title}
                  </motion.h3>
                  <p className="text-lg text-gray-300 mb-2 leading-relaxed">{feature.description}</p>
                  <motion.p className="text-[#00D4FF] italic flex items-center" whileHover={{ x: 10 }}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {feature.arrow}
                  </motion.p>
                </div>
              </motion.div>
            ))}
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
                <motion.div
                  className="bg-[#00D4FF] w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-6 relative"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 30px rgba(0, 212, 255, 0.6)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 212, 255, 0.3)",
                      "0 0 40px rgba(0, 212, 255, 0.6)",
                      "0 0 20px rgba(0, 212, 255, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                >
                  {step.number}
                </motion.div>
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
            <motion.span
              className="inline-block ml-4"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              🎮➡️💰
            </motion.span>
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
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              className="bg-[#00D4FF] hover:bg-[#00B8E6] text-white px-8 py-4 text-lg group"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Analysis
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                🚀
              </motion.span>
            </Button>
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
