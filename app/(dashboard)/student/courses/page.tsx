'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, BookOpen, User, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/student/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchCourses()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  const filteredCourses = courses.filter((course: any) =>
    course.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/student">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">الكورسات</h1>
            <p className="text-white/30 text-sm">استكشف كل الكورسات المتاحة</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن كورس..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-white rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white/40" />
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      course.isFree ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {course.isFree ? 'مجاني' : 'مدفوع'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-white/30 text-sm mb-4 line-clamp-2">{course.description || ''}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/30 text-sm">
                      <User className="w-4 h-4" />
                      <span>{course.teacher || 'المعلم'}</span>
                    </div>
                    <Link href={`/student/courses/${course.id}`}>
                      <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300">
                        عرض
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/40">لا توجد كورسات متاحة حالياً</p>
            </div>
          )}
        </div>
      </div>

      <MobileNav role="STUDENT" />
    </div>
  )
}