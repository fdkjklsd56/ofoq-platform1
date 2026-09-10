'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Video, Plus, Radio, Users, Clock, Play, Square, ChevronLeft, Settings, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function LiveStreamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    fetchStreams()
  }, [session])

  const fetchStreams = async () => {
    try {
      const res = await fetch('/api/teacher/live')
      if (res.ok) setStreams(await res.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const createStream = async () => {
    try {
      const res = await fetch('/api/teacher/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setShowCreate(false)
        setFormData({ title: '', description: '', scheduledAt: '', duration: 60 })
        fetchStreams()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const copyStreamLink = (id: string) => {
    const url = `${window.location.origin}/live/${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  const activeStreams = streams.filter((s: any) => s.status === 'LIVE')
  const scheduledStreams = streams.filter((s: any) => s.status === 'SCHEDULED')

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
            <h1 className="text-2xl md:text-4xl font-bold text-white">البث المباشر</h1>
            <p className="text-white/30 text-sm">بث مباشر لطلابك</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 flex items-center gap-2 text-sm transition-all"
          >
            <Radio className="w-4 h-4" />
            <span className="hidden md:inline">بث جديد</span>
          </button>
        </div>

        {/* البثوث المباشرة */}
        {activeStreams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              بث مباشر الآن
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStreams.map((stream: any) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-white rounded-2xl overflow-hidden border-2 border-red-500/30"
                >
                  <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                    <Video className="w-16 h-16 text-white/20" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 rounded-full text-white text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      مباشر
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" /> {stream.viewers || 0}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">{stream.title}</h3>
                    <div className="flex gap-2">
                      <Link href={`/teacher/live/${stream.id}`}>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm transition-all">
                          إدارة البث
                        </button>
                      </Link>
                      <button
                        onClick={() => copyStreamLink(stream.id)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* البثوث المجدولة */}
        <h2 className="text-xl font-bold text-white mb-4">البثوث المجدولة</h2>
        {scheduledStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledStreams.map((stream: any, i) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <Radio className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{stream.title}</h3>
                <p className="text-white/30 text-sm mb-4 line-clamp-2">{stream.description || ''}</p>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(stream.scheduledAt).toLocaleString('ar-EG')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-white rounded-2xl p-12 text-center">
            <Radio className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 mb-4">لا توجد بثوث مجدولة</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              جدول بث جديد
            </button>
          </div>
        )}

        {/* Modal إنشاء بث */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-white rounded-3xl p-6 md:p-8 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">بث مباشر جديد</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-sm block mb-2">عنوان البث</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: مراجعة الرياضيات"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-sm block mb-2">وصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف البث..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-sm block mb-2">موعد البث</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-sm block mb-2">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createStream}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
                >
                  جدولة البث
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <MobileNav role="TEACHER" />
    </div>
  )
}