"use client"

import { motion } from "framer-motion"
import { Gamepad2 } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
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
        <Link
          href="/"
          className="text-2xl font-bold flex items-center cursor-pointer"
        >
          <Gamepad2 className="w-8 h-8 mr-2 text-[#00D4FF]" />
          PriceValve
        </Link>
      </motion.div>
    </motion.nav>
  )
} 