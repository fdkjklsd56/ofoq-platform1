'use client'

import { motion } from 'framer-motion'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

interface LogoProps {
  className?: string
  size?: LogoSize
}

export default function Logo({
  className = '',
  size = 'md',
}: LogoProps) {
  const sizes: Record<LogoSize, string> = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-48 h-48 text-7xl',
  }

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute inset-2 rounded-full border border-white/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white/50 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white/30 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white/30 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-white">أفق</span>
      </div>
    </motion.div>
  )
}