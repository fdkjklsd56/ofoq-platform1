'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, BookOpen, Video, FileText, 
  ClipboardList, BarChart3, Settings, 
  LogOut, Plus, Calendar, MessageCircle,
  Home, GraduationCap, Award, Star
} from 'lucide-react'
import { useEffect } from 'react'

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const stats = [
    { label: 'الطلاب', value: '48', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'الكورسات', value: '12', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { label: 'الاختبارات', value: '24', icon: ClipboardList, color: 'from-purple-500 to-pink-500' },
    { label: 'تقييم الطلاب', value: '4.8 ⭐', icon: Star, color: 'from-yellow-500 to-orange-500' },
  ]

  const recentStudents = [
    { name: 'أحمد محمد', progress: 75, lastActive: 'منذ ساعتين' },
    { name: 'سارة علي', progress: 40, lastActive: 'منذ 5 ساعات' },
    { name: 'خالد حسن', progress: 90, lastActive: 'منذ يوم' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <aside className="fixed top-0 right-0 w-20 h-full bg-white/5 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          م
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { icon: Home, id: 'home', label: 'الرئيسية' },
            { icon: Users, id: 'students', label: 'الطلاب' },
            { icon: BookOpen, id: 'courses', label: 'الكورسات' },
            { icon: Video, id: 'videos', label: 'الفيديوهات' },
            { icon: ClipboardList, id: 'exams', label: 'الاختبارات' },
            { icon: BarChart3, id: 'progress', label: 'التقدم' },
            { icon: MessageCircle, id: 'messages', label: 'الرسائل' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
                item.id === 'home'
                  ? 'bg-white/10 text-white'
                  : 'text-white/20 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="absolute right-full mr-3 px-2 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300">
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      <main className="pr-24 p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">
              مرحباً، {session.user?.name?.split(' ')[0] || 'معلم'} 👨‍🏫
            </h1>
            <p className="text-white/30 mt-2 text-lg">إدارة التعليم مع أفق</p>
          </div>
          <button className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 flex items-center gap-2 border border-white/10">
            <Plus className="w-4 h-4" />
            <span>إضافة جديدة</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-white rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4">أحدث الطلاب</h3>
            <div className="space-y-4">
              {recentStudents.map((student, i) => (
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-white rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4">الإحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">إجمالي الدروس</span>
                <span className="text-white font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">معدل التقدم</span>
                <span className="text-white font-semibold">68%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">الاختبارات</span>
                <span className="text-white font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">تقييم الطلاب</span>
                <span className="text-yellow-400 font-semibold">4.8 ⭐</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}