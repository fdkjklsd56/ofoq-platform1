'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Send, ChevronLeft, Search } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/shared/MobileNav'

export default function TeacherMessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState<any>(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    fetchConversations()
  }, [session])

  useEffect(() => {
    if (selectedConv) fetchMessages(selectedConv.id)
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/teacher/conversations')
      if (res.ok) setConversations(await res.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`)
      if (res.ok) setMessages(await res.json())
    } catch (error) {
      console.error(error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return
    const content = newMessage.trim()
    setNewMessage('')

    const tempMsg = {
      id: Date.now().toString(),
      content,
      senderId: session?.user?.id,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      await fetch(`/api/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
    } catch (error) {
      console.error(error)
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
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/teacher">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">الرسائل</h1>
            <p className="text-white/30 text-sm">تواصل مع طلابك</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* قائمة المحادثات */}
          <div className="glass-white rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2 pr-9 text-white text-sm placeholder:text-white/20 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full p-4 text-right border-b border-white/5 hover:bg-white/5 transition-all ${
                      selectedConv?.id === conv.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <p className="text-white font-medium text-sm">{conv.name}</p>
                    <p className="text-white/30 text-xs truncate mt-1">{conv.lastMessage}</p>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">لا توجد محادثات</p>
                </div>
              )}
            </div>
          </div>

          {/* المحادثة */}
          <div className="lg:col-span-2 glass-white rounded-2xl overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-white font-medium">{selectedConv.name}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === session?.user?.id ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-2xl ${
                        msg.senderId === session?.user?.id
                          ? 'bg-white/10 text-white'
                          : 'bg-white/5 text-white/80'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب رسالة..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">اختر محادثة للبدء</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav role="TEACHER" />
    </div>
  )
}