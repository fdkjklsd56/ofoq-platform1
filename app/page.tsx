'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/splash')
  }, [router])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
    </div>
  )
}