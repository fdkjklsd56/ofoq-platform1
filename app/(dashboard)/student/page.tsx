'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  GraduationCap, 
  Bot, 
  Trophy, 
  BookMarked,
  FileText,
  Users,
  ChevronLeft,
  Home,
  Library,
  Video,
  ClipboardList,
  BarChart3,
  MessageCircle,
  Settings,
  LogOut,
  Sparkles
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

  // إحصائيات وهمية (هنعدلها بعدين)
  const stats = [
    { label: 'المواد المسجلة', value: '6', icon: BookOpen },
    { label: 'الدروس المكتملة', value: '24', icon: GraduationCap },
    { label: 'التقدم الكلي', value: '68%', icon: BarChart3 },
    { label: 'الاختبارات', value: '12', icon: ClipboardList },
  ]

  const recentCourses = [
    { title: 'الرياضيات - الصف الثالث الثانوي', progress: 75, teacher: 'أ. أحمد محمد' },
    { title: 'الفيزياء - الصف الثاني الثانوي', progress: 40, teacher: 'د. سارة علي' },
    { title: 'الكيمياء - الصف الأول الثانوي', progress: 90, teacher: 'أ. خالد حسن' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* الشريط الجانبي */}
      <aside className="fixed top-0 right-0 w-20 h-full bg-white/5 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          أ
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          {[
            { icon: Home, id: 'home' },
            { icon: Library, id: 'library' },
            { icon: Video, id: 'courses' },
            { icon: ClipboardList, id: 'exams' },
            { icon: BarChart3, id: 'progress' },
            { icon: Bot, id: 'nexo' },
            { icon: MessageCircle, id: 'messages' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/20 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300">
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="pr-24 p-8">
        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              مرحباً، {session.user?.name?.split(' ')[0] || 'طالب'} 👋
            </h1>
            <p className="text-white/30 mt-1">هذه رحلتك التعليمية مع أفق</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5">
              <Sparkles className="w-4 h-4 inline-block ml-2" />
              NEXO
            </button>
          </div>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-white rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white/40" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/30 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* الكورسات الأخيرة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">كورساتي</h2>
            <button className="text-white/30 hover:text-white/60 text-sm transition-colors">
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course, i) => (
              <div
                key={i}
                className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-white font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-white/30 text-sm mb-4">{course.teacher}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-sm">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* NEXO - مساعد الذكاء الاصطناعي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 glass-white rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white/60" />
            </div>
            <div>
              <h3 className="text-white font-semibold">NEXO - مساعدك الذكي</h3>
              <p className="text-white/30 text-sm">اسألني أي شيء عن دراستك</p>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
            <button className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
              إرسال
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}