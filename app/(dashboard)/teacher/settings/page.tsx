'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Settings, User, Mail, Phone, Save, ChevronLeft, Lock, Bell, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function TeacherSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/teacher/profile')
        if (res.ok) {
          const data = await res.json()
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            specialization: data.specialization || '',
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (session) fetchProfile()
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) alert('تم الحفظ بنجاح')
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/teacher">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">الإعدادات</h1>
            <p className="text-white/30 text-sm">إدارة حسابك</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-white rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5" /> المعلومات الشخصية
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-sm block mb-2">الاسم</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-white/40 text-sm block mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white/40 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-white/40 text-sm block mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-white/40 text-sm block mb-2">التخصص</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="مثال: رياضيات، فيزياء..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-white/40 text-sm block mb-2">نبذة عنك</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20 resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full md:w-auto px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </motion.div>
      </div>
      <MobileNav role="TEACHER" />
    </div>
  )
}