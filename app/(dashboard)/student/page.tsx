'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpen, GraduationCap, Bot, 
  Home, Library, Video, ClipboardList, 
  BarChart3, MessageCircle, LogOut,
  Sparkles, Calendar, Menu, X
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // بيانات حقيقية من قاعدة البيانات (مؤقتاً وهمية)
  const stats = [
    { label: 'المواد المسجلة', value: '0', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'الدروس المكتملة', value: '0', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
    { label: 'التقدم الكلي', value: '0%', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { label: 'الاختبارات', value: '0', icon: ClipboardList, color: 'from-orange-500 to-amber-500' },
  ]

  const menuItems = [
    { icon: Home, id: 'home', label: 'الرئيسية' },
    { icon: Library, id: 'library', label: 'المكتبة' },
    { icon: Video, id: 'courses', label: 'الكورسات' },
    { icon: ClipboardList, id: 'exams', label: 'الاختبارات' },
    { icon: BarChart3, id: 'progress', label: 'التقدم' },
    { icon: Bot, id: 'nexo', label: 'NEXO' },
    { icon: MessageCircle, id: 'messages', label: 'الرسائل' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* شريط جانبي للموبايل */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="text-white font-bold text-lg">أفق</span>
        <button className="text-white/40">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* الشريط الجانبي */}
      <aside className={`fixed top-0 right-0 h-full bg-dark/95 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${window.innerWidth < 1024 && !sidebarOpen ? '-translate-x-full' : ''}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          أ
        </div>

        <nav className="flex-1 flex flex-col gap-4 w-full px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full rounded-2xl flex items-center gap-4 p-3 transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/20 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <button className="w-full rounded-2xl flex items-center gap-4 p-3 text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            تسجيل الخروج
          </span>
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className={`lg:pr-24 p-4 md:p-8 max-w-7xl mx-auto transition-all duration-300 ${window.innerWidth < 1024 ? 'pt-20' : ''}`}>
        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              مرحباً، {session.user?.name?.split(' ')[0] || 'طالب'} 👋
            </h1>
            <p className="text-white/30 mt-1 text-sm md:text-lg">استمر في رحلتك التعليمية مع أفق</p>
          </div>
          <button className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5 flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>NEXO</span>
          </button>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8"
        >
          {stats.map((stat, i) => (
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

        {/* الكورسات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">كورساتي</h2>
            <button className="text-white/30 hover:text-white/60 text-sm transition-colors">
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="glass-white rounded-2xl p-4 md:p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                <h3 className="text-white font-semibold text-base md:text-lg group-hover:text-white/90 transition-colors">
                  ليس لديك كورسات مسجلة
                </h3>
                <p className="text-white/30 text-sm mt-1">ابدأ رحلتك التعليمية الآن</p>
                <button className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300">
                  استكشف الكورسات
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* NEXO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-white rounded-2xl p-4 md:p-6 bg-gradient-to-br from-white/5 to-transparent"
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
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors"
            />
            <button className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-sm">
              إرسال
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}