'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Intro1() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/intro/2')
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <button
        onClick={() => router.push('/start')}
        className="absolute top-8 left-8 text-white/30 hover:text-white/60 text-sm transition-colors z-20"
      >
        تخطي
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl md:text-7xl font-bold text-white leading-[1.3]"
        >
          تعلّم
          <br />
          <span className="text-gradient-premium">بشكل أفضل</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/30 text-xl mt-6 max-w-2xl mx-auto"
        >
          تجربة تعليمية فريدة تجمع بين المتعة والفائدة
        </motion.p>
      </motion.div>
    </div>
  )
}