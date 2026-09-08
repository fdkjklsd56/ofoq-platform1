'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      const role = session.user?.role || 'STUDENT'
      const dashboardPath = role === 'ADMIN' ? '/admin' : 
                            role === 'TEACHER' ? '/teacher' : '/student'
      router.replace(dashboardPath)
    } else {
      router.replace('/splash')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
    </div>
  )
}