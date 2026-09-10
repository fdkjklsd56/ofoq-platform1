'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, ChevronLeft, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/student/messages')
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchMessages()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">الرسائل</h1>
            <p className="text-white/30 text-sm">تواصل مع معلميك</p>
          </div>
        </div>

        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((msg: any, i) => (
              <div key={i} className="glass-white rounded-2xl p-4">
                <p className="text-white">{msg.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-white rounded-2xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">لا توجد رسائل حالياً</p>
          </div>
        )}
      </div>

      <MobileNav role="STUDENT" />
    </div>
  )
}