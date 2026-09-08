'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpen, GraduationCap, Bot, Trophy, 
  BookMarked, FileText, Users, ChevronLeft,
  Home, Library, Video, ClipboardList, 
  BarChart3, MessageCircle, Settings, LogOut,
  Sparkles, Calendar, Clock, Award
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')

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
    { label: 'المواد المسجلة', value: '6', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'الدروس المكتملة', value: '24', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
    { label: 'التقدم الكلي', value: '68%', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { label: 'الاختبارات', value: '12', icon: ClipboardList, color: 'from-orange-500 to-amber-500' },
  ]

  const recentCourses = [
    { title: 'الرياضيات - الصف الثالث الثانوي', progress: 75, teacher: 'أ. أحمد محمد', lessons: 12, completed: 9 },
    { title: 'الفيزياء - الصف الثاني الثانوي', progress: 40, teacher: 'د. سارة علي', lessons: 10, completed: 4 },
    { title: 'الكيمياء - الصف الأول الثانوي', progress: 90, teacher: 'أ. خالد حسن', lessons: 8, completed: 7 },
  ]

  const recentActivities = [
    { title: 'أنهيت درس "الاشتقاق" في الرياضيات', time: 'منذ ساعتين', icon: '✅' },
    { title: 'بدأت كورس "الفيزياء الحديثة"', time: 'منذ 5 ساعات', icon: '📚' },
    { title: 'حصلت على 85% في اختبار "الكيمياء"', time: 'منذ يوم', icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <aside className="fixed top-0 right-0 w-20 h-full bg-white/5 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          أ
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { icon: Home, id: 'home', label: 'الرئيسية' },
            { icon: Library, id: 'library', label: 'المكتبة' },
            { icon: Video, id: 'courses', label: 'الكورسات' },
            { icon: ClipboardList, id: 'exams', label: 'الاختبارات' },
            { icon: BarChart3, id: 'progress', label: 'التقدم' },
            { icon: Bot, id: 'nexo', label: 'NEXO' },
            { icon: MessageCircle, id: 'messages', label: 'الرسائل' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
                activeTab === item.id
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
              مرحباً، {session.user?.name?.split(' ')[0] || 'طالب'} 👋
            </h1>
            <p className="text-white/30 mt-2 text-lg">استمر في رحلتك التعليمية مع أفق</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>NEXO</span>
            </button>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">كورساتي</h2>
                <button className="text-white/30 hover:text-white/60 text-sm transition-colors">
                  عرض الكل
                </button>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg group-hover:text-white/90 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-white/30 text-sm mt-1">{course.teacher}</p>
                        <p className="text-white/20 text-xs mt-1">
                          {course.completed} / {course.lessons} درس
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-32">
                          <div className="flex justify-between text-white/30 text-xs mb-1">
                            <span>التقدم</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-white/40 to-white/20 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 text-sm border border-white/5">
                          متابعة
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-white rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold text-lg mb-4">آخر الأنشطة</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm">{activity.title}</p>
                      <p className="text-white/20 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 glass-white rounded-2xl p-6 bg-gradient-to-br from-white/5 to-transparent"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">NEXO</h4>
                  <p className="text-white/20 text-xs">اسألني أي شيء</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="اكتب سؤالك هنا..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors"
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}