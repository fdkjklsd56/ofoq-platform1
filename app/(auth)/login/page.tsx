'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // التوجيه حسب الدور
        const role = result?.user?.role || 'STUDENT'
        router.push(`/${role.toLowerCase()}`)
        router.refresh()
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-white rounded-3xl p-12 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          مرحباً بعودتك
        </h1>
        <p className="text-white/30 text-center mb-8">
          سجل دخولك إلى منصة أفق
        </p>

        {error && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-white/60 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white/40 text-sm block mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-white/40 text-sm block mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          <div className="text-left">
            <button
              type="button"
              className="text-white/20 hover:text-white/40 text-sm transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-white w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              'جاري تسجيل الدخول...'
            ) : (
              <>
                تسجيل الدخول
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-white/20 text-center mt-6 text-sm">
          ليس لديك حساب؟{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </motion.div>
    </div>
  )
}