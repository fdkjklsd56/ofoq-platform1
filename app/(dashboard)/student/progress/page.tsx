'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Award, Clock, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0, averageScore: 0, streak: 0 })
  const [progressData, setProgressData] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/student/progress')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setProgressData(data.progress)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchProgress()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">التقدم</h1>
            <p className="text-white/30 text-sm">تابع رحلة تقدمك التعليمي</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          {[
            { label: 'نسبة التقدم', value: `${stats.percentage}%`, icon: TrendingUp, color: 'text-purple-400' },
            { label: 'الدروس المكتملة', value: stats.completed, icon: BarChart3, color: 'text-green-400' },
            { label: 'المتوسط', value: `${stats.averageScore}%`, icon: Award, color: 'text-yellow-400' },
            { label: 'أيام متتالية', value: stats.streak, icon: Clock, color: 'text-blue-400' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-white rounded-2xl p-4 md:p-6 text-center"
            >
              <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
              <p className="text-2xl md:text-3xl font-bold text-white">{item.value}</p>
              <p className="text-white/40 text-xs md:text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-white rounded-2xl p-6"
        >
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">تفاصيل التقدم</h2>
          {progressData.length > 0 ? (
            <div className="space-y-4">
              {progressData.map((item: any, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">{item.courseTitle}</h3>
                    <span className="text-white/40 text-sm">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white/40 to-white/20 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-8">لا توجد بيانات تقدم حالياً</p>
          )}
        </motion.div>
      </div>

      <MobileNav role="STUDENT" />
    </div>
  )
}