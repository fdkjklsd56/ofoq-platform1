'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Logo from '@/components/shared/Logo'

export default function StartScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto"
      >
        <Logo size="lg" className="mx-auto mb-12" />

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6"
        >
          رحلتك تبدأ من هنا
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/30 leading-relaxed max-w-2xl mx-auto mb-12"
        >
          انضم إلى آلاف الطلاب في رحلة التعلم مع منصة أفق
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/register')}
            className="btn-white"
          >
            إنشاء حساب جديد
          </button>
          <button
            onClick={() => router.push('/login')}
            className="btn-white-outline"
          >
            تسجيل الدخول
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}