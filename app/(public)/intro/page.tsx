'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const slides = [
  {
    title: 'تعلّم بشكل أفضل',
    description: 'نقدم لك تجربة تعليمية فريدة تجمع بين المتعة والفائدة، مع محتوى منظم وشرح مبسط يناسب جميع المستويات',
  },
  {
    title: 'كل شيء في مكانه',
    description: 'كتب، كورسات، اختبارات، وواجبات - كل ما تحتاجه في منصة واحدة منظمة وسهلة الاستخدام',
  },
  {
    title: 'تابع تقدّمك',
    description: 'نظام متابعة ذكي يوضح لك مستواك ونقاط قوتك وضعفك لتحسين أدائك باستمرار',
  },
  {
    title: 'تعلّم مع معلميك',
    description: 'تواصل مباشر مع معلميك واحصل على دعم فوري وإجابات لأسئلتك في أي وقت',
  },
  {
    title: 'رحلتك تبدأ من هنا',
    description: 'انطلق في رحلة تعليمية ممتعة مع أفق ومساعدها الذكي NEXO الذي سيرافقك خطوة بخطوة',
  },
]

export default function IntroScreen() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  // الانتقال التلقائي كل 2.5 ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => {
        if (prev >= slides.length - 1) {
          clearInterval(timer)
          setTimeout(() => router.push('/start'), 1000)
          return prev
        }
        return prev + 1
      })
    }, 2500)

    return () => clearInterval(timer)
  }, [router])

  const skip = () => router.push('/start')

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* زر تخطي */}
      <button
        onClick={skip}
        className="absolute top-8 right-8 text-white/30 hover:text-white/60 transition-colors z-20"
      >
        <X className="w-6 h-6" />
      </button>

      {/* النقاط */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? 'w-12 h-1.5 bg-white/40'
                : 'w-1.5 h-1.5 bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {slides[current].title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/40 leading-relaxed max-w-2xl mx-auto"
          >
            {slides[current].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}