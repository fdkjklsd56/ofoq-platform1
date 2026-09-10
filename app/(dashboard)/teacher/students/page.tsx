'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Search, ChevronLeft, Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function TeacherStudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/teacher/students')
        if (res.ok) setStudents(await res.json())
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (session) fetchStudents()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = students.filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/teacher">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">الطلاب</h1>
            <p className="text-white/30 text-sm">إدارة طلابك</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن طالب..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((student: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-white rounded-2xl p-4 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{student.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {student.email}
                      </span>
                      {student.phone && (
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {student.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{student.progress || 0}%</p>
                    <p className="text-white/30 text-xs">التقدم</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-white rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">لا يوجد طلاب حالياً</p>
          </div>
        )}
      </div>
      <MobileNav role="TEACHER" />
    </div>
  )
}