'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, CheckCircle, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function ExamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/student/exams')
        if (res.ok) {
          const data = await res.json()
          setExams(data)
        }
      } catch (error) {
        console.error('Error fetching exams:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchExams()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  const upcomingExams = exams.filter((e: any) => e.status === 'upcoming')
  const completedExams = exams.filter((e: any) => e.status === 'completed')

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
            <h1 className="text-2xl md:text-4xl font-bold text-white">الاختبارات</h1>
            <p className="text-white/30 text-sm">جميع الاختبارات المتاحة والنتائج</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-white rounded-2xl p-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              اختبارات قادمة
            </h2>
            {upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {upcomingExams.map((exam: any, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <h3 className="text-white font-medium">{exam.title}</h3>
                    <p className="text-white/30 text-sm">{exam.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-8">لا توجد اختبارات قادمة</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-white rounded-2xl p-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              الاختبارات المنتهية
            </h2>
            {completedExams.length > 0 ? (
              <div className="space-y-3">
                {completedExams.map((exam: any, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-medium">{exam.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        exam.score >= exam.passingScore 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {exam.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-8">لا توجد اختبارات منتهية</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* الشريط السفلي للموبايل */}
      <MobileNav role="STUDENT" />
    </div>
  )
}