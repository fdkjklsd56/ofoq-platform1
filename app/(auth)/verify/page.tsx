'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, X, Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timer, setTimer] = useState(60)

  // عد تنازلي لإعادة إرسال الكود
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'رمز التحقق غير صحيح')
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        setTimer(60)
        setError('')
      }
    } catch (err) {
      setError('حدث خطأ في إعادة الإرسال')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h2>
          <p className="text-white/40">جاري التوجيه إلى تسجيل الدخول...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-white rounded-3xl p-12 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          تحقق من بريدك
        </h1>
        <p className="text-white/30 text-center mb-8">
          أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="text-white/40 text-sm block mb-2">
              رمز التحقق
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              required
              maxLength={6}
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-white w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'تحقق'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={resendCode}
            disabled={timer > 0}
            className={`text-sm transition-colors ${
              timer > 0
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {timer > 0 ? `إعادة الإرسال بعد ${timer} ثانية` : 'إعادة إرسال الرمز'}
          </button>
        </div>

        <p className="text-white/20 text-center mt-6 text-sm">
          لم يصلك الرمز؟{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            العودة للتسجيل
          </button>
        </p>
      </motion.div>
    </div>
  )
}