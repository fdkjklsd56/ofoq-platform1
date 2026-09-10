'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardList, Plus, ChevronLeft, Clock, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function TeacherExamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/teacher/exams')
        if (res.ok) setExams(await res.json())
      } catch (error) {
        console.error(error)
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

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/teacher">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-white">الاختبارات</h1>
            <p className="text-white/30 text-sm">إدارة اختباراتك</p>
          </div>
          <button className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">اختبار جديد</span>
          </button>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{exam.title}</h3>
                <p className="text-white/30 text-sm mb-4">{exam.duration} دقيقة</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    exam.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {exam.isPublished ? 'منشور' : 'مسودة'}
                  </span>
                  <button className="text-white/40 hover:text-white text-sm">تعديل</button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-white rounded-2xl p-12 text-center">
            <ClipboardList className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 mb-4">لا توجد اختبارات حالياً</p>
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
              إنشاء اختبار جديد
            </button>
          </div>
        )}
      </div>
      <MobileNav role="TEACHER" />
    </div>
  )
}