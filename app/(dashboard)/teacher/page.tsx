'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, BookOpen, Video, FileText, 
  ClipboardList, BarChart3, Settings, 
  LogOut, Plus, Calendar, MessageCircle,
  Home, GraduationCap, Award, Star,
  Menu, X, ChevronLeft
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    exams: 0,
    rating: 0
  })
  const [students, setStudents] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/teacher/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
          setStudents(data.students)
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchData()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const menuItems = [
    { icon: Home, id: 'home', label: 'الرئيسية', href: '/teacher' },
    { icon: Users, id: 'students', label: 'الطلاب', href: '/teacher/students' },
    { icon: BookOpen, id: 'courses', label: 'الكورسات', href: '/teacher/courses' },
    { icon: Video, id: 'videos', label: 'الفيديوهات', href: '/teacher/videos' },
    { icon: ClipboardList, id: 'exams', label: 'الاختبارات', href: '/teacher/exams' },
    { icon: BarChart3, id: 'progress', label: 'التقدم', href: '/teacher/progress' },
    { icon: MessageCircle, id: 'messages', label: 'الرسائل', href: '/teacher/messages' },
  ]

  const statsData = [
    { label: 'الطلاب', value: stats.students, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'الكورسات', value: stats.courses, icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { label: 'الاختبارات', value: stats.exams, icon: ClipboardList, color: 'from-purple-500 to-pink-500' },
    { label: 'تقييم الطلاب', value: stats.rating > 0 ? `${stats.rating} ⭐` : '—', icon: Star, color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* شريط علوي للموبايل */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="text-white font-bold text-lg">أفق</span>
        <button className="text-white/40" onClick={() => router.push('/api/auth/signout')}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* الشريط الجانبي */}
      <aside className={`fixed top-0 right-0 h-full bg-dark/95 backdrop-blur-xl border-l border-white/5 flex flex-col py-6 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${typeof window !== 'undefined' && window.innerWidth < 1024 && !sidebarOpen ? '-translate-x-full' : ''}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8 mx-auto">
          م
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full px-3">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`w-full rounded-2xl flex items-center gap-4 p-3 transition-all duration-300 ${
                item.id === 'home'
                  ? 'bg-white/10 text-white'
                  : 'text-white/20 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => router.push('/api/auth/signout')}
          className="w-full rounded-2xl flex items-center gap-4 p-3 text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            تسجيل الخروج
          </span>
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className={`lg:pr-24 p-4 md:p-8 max-w-7xl mx-auto transition-all duration-300 ${typeof window !== 'undefined' && window.innerWidth < 1024 ? 'pt-20' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              مرحباً، {session.user?.name?.split(' ')[0] || 'معلم'} 👨‍🏫
            </h1>
            <p className="text-white/30 mt-1 text-sm md:text-lg">إدارة التعليم مع أفق</p>
          </div>
          <Link href="/teacher/courses/new">
            <button className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5 flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>إضافة جديدة</span>
            </button>
          </Link>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8"
        >
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass-white rounded-2xl p-4 md:p-6 hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs md:text-sm truncate">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* أحدث الطلاب */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-white rounded-2xl p-4 md:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">أحدث الطلاب</h3>
              <Link href="/teacher/students">
                <button className="text-white/30 hover:text-white/60 text-sm transition-colors">
                  عرض الكل
                </button>
              </Link>
            </div>
            {students.length > 0 ? (
              <div className="space-y-3">
                {students.map((student: any, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-white/20 text-xs">{student.lastActive}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-white/40 to-white/20 rounded-full transition-all duration-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-white/40 text-sm">{student.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-8">لا يوجد طلاب مسجلين حالياً</p>
            )}
          </motion.div>

          {/* الإحصائيات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-white rounded-2xl p-4 md:p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4">الإحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">إجمالي الدروس</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">معدل التقدم</span>
                <span className="text-white font-semibold">0%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">الاختبارات</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">تقييم الطلاب</span>
                <span className="text-white/40 font-semibold">—</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}