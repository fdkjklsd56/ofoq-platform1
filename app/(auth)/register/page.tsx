'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, User, Lock, ChevronDown } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'MALE',
    stage: '',
    grade: '',
  })

  const stages = [
    { value: 'primary', label: 'المرحلة الابتدائية' },
    { value: 'middle', label: 'المرحلة الإعدادية' },
    { value: 'secondary', label: 'المرحلة الثانوية' },
    { value: 'university', label: 'الجامعة' },
  ]

  const getGrades = (stage: string) => {
    switch (stage) {
      case 'primary':
        return [
          { value: '1', label: 'الصف الأول الابتدائي' },
          { value: '2', label: 'الصف الثاني الابتدائي' },
          { value: '3', label: 'الصف الثالث الابتدائي' },
          { value: '4', label: 'الصف الرابع الابتدائي' },
          { value: '5', label: 'الصف الخامس الابتدائي' },
          { value: '6', label: 'الصف السادس الابتدائي' },
        ]
      case 'middle':
        return [
          { value: '7', label: 'الصف الأول الإعدادي' },
          { value: '8', label: 'الصف الثاني الإعدادي' },
          { value: '9', label: 'الصف الثالث الإعدادي' },
        ]
      case 'secondary':
        return [
          { value: '10', label: 'الصف الأول الثانوي' },
          { value: '11', label: 'الصف الثاني الثانوي' },
          { value: '12', label: 'الصف الثالث الثانوي' },
        ]
      case 'university':
        return [
          { value: '1', label: 'السنة الأولى' },
          { value: '2', label: 'السنة الثانية' },
          { value: '3', label: 'السنة الثالثة' },
          { value: '4', label: 'السنة الرابعة' },
        ]
      default:
        return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          stage: formData.stage,
          grade: formData.grade,
          termsAccepted: true,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'حدث خطأ')
      }

      // ✅ روح مباشرة للـ login
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-white rounded-3xl p-12 max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          إنشاء حساب
        </h1>
        <p className="text-white/30 text-center mb-8">
          انضم إلى منصة أفق التعليمية
        </p>

        {error && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-white/60 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم */}
          <div>
            <label className="text-white/40 text-sm block mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              الاسم الثلاثي
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="أحمد محمد علي"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="text-white/40 text-sm block mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* رقم الهاتف */}
          <div>
            <label className="text-white/40 text-sm block mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01234567890"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              dir="ltr"
            />
          </div>

          {/* النوع */}
          <div>
            <label className="text-white/40 text-sm block mb-2">النوع</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'MALE' })}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  formData.gender === 'MALE'
                    ? 'border-white/30 bg-white/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className={`text-sm ${formData.gender === 'MALE' ? 'text-white' : 'text-white/40'}`}>
                  ذكر
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'FEMALE' })}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  formData.gender === 'FEMALE'
                    ? 'border-white/30 bg-white/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className={`text-sm ${formData.gender === 'FEMALE' ? 'text-white' : 'text-white/40'}`}>
                  أنثى
                </span>
              </button>
            </div>
          </div>

          {/* المرحلة التعليمية */}
          <div>
            <label className="text-white/40 text-sm block mb-2 flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              المرحلة التعليمية
            </label>
            <select
              value={formData.stage}
              onChange={(e) => {
                setFormData({ ...formData, stage: e.target.value, grade: '' })
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none"
            >
              <option value="" className="bg-dark">اختر المرحلة</option>
              {stages.map((s) => (
                <option key={s.value} value={s.value} className="bg-dark">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* الصف */}
          {formData.stage && (
            <div>
              <label className="text-white/40 text-sm block mb-2">الصف الدراسي</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none"
              >
                <option value="" className="bg-dark">اختر الصف</option>
                {getGrades(formData.stage).map((g) => (
                  <option key={g.value} value={g.value} className="bg-dark">
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* كلمة المرور */}
          <div>
            <label className="text-white/40 text-sm block mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              كلمة المرور
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
              minLength={8}
            />
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="text-white/40 text-sm block mb-2">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-white w-full flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              'جاري إنشاء الحساب...'
            ) : (
              <>
                إنشاء الحساب
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-white/20 text-center mt-6 text-sm">
          لديك حساب؟{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            تسجيل الدخول
          </button>
        </p>
      </motion.div>
    </div>
  )
}