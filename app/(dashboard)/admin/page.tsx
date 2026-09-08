'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, BookOpen, Video, FileText, 
  ClipboardList, BarChart3, Settings, 
  LogOut, Plus, Calendar, MessageCircle,
  Home, GraduationCap, Award, Star,
  Shield, Database, Globe, DollarSign,
  TrendingUp, Activity, UserPlus, BookMarked,
  Lock, AlertTriangle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    users: 0,
    teachers: 0,
    courses: 0,
    revenue: 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    // التحقق من صلاحيات الادمن
    // بدل ما نعتمد على session.user.role، نستخدم API
const checkAdmin = async () => {
  try {
    const res = await fetch('/api/admin/verify')
    const data = await res.json()
    
    if (data.isAdmin) {
      setIsAdmin(true)
      await fetchData()
    } else {
      router.push('/student')
    }
  } catch (error) {
    router.push('/student')
  } finally {
    setLoading(false)
  }
}

    if (session) {
      checkAdmin()
    }
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-white rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">🚫 غير مصرح</h2>
          <p className="text-white/40 text-sm mb-6">
            هذه الصفحة مخصصة للمشرفين فقط.
          </p>
          <Link href="/student">
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300">
              العودة للرئيسية
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const statsData = [
    { label: 'المستخدمين', value: stats.users, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'المعلمين', value: stats.teachers, icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
    { label: 'الكورسات', value: stats.courses, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'الإيرادات', value: `EGP ${stats.revenue}`, icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* الشريط الجانبي */}
      <aside className="fixed top-0 right-0 w-20 h-full bg-white/5 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          م
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { icon: Home, id: 'home', label: 'الرئيسية' },
            { icon: Users, id: 'users', label: 'المستخدمين' },
            { icon: BookOpen, id: 'courses', label: 'الكورسات' },
            { icon: Shield, id: 'admin', label: 'الإدارة' },
            { icon: Database, id: 'content', label: 'المحتوى' },
            { icon: BarChart3, id: 'analytics', label: 'الإحصائيات' },
            { icon: Settings, id: 'settings', label: 'الإعدادات' },
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

      {/* المحتوى الرئيسي */}
      <main className="pr-24 p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">
              مرحباً، {session.user?.name?.split(' ')[0] || 'مدير'} 👋
            </h1>
            <p className="text-white/30 mt-2 text-lg">لوحة تحكم منصة أفق</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 flex items-center gap-2 border border-white/10">
              <Plus className="w-4 h-4" />
              <span>إضافة جديدة</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {statsData.map((stat, i) => (
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
            <h3 className="text-white font-semibold text-lg mb-4">آخر الأنشطة</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity: any, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm ${
                        activity.type === 'user' ? 'text-blue-400' :
                        activity.type === 'course' ? 'text-purple-400' :
                        activity.type === 'payment' ? 'text-green-400' :
                        'text-yellow-400'
                      }`}>
                        {activity.type === 'user' ? '👤' :
                         activity.type === 'course' ? '📚' :
                         activity.type === 'payment' ? '💰' :
                         '📝'}
                      </div>
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-white/20 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm">لا توجد أنشطة حالياً</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-white rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4">إحصائيات سريعة</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">إجمالي المستخدمين</span>
                <span className="text-white font-semibold">{stats.users || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">المستخدمين النشطين</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">معدل النمو</span>
                <span className="text-green-400 font-semibold">+0%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-white/60">الاشتراكات</span>
                <span className="text-white font-semibold">0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}