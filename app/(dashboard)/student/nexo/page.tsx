'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Send, User, Sparkles, 
  MessageCircle, Loader2, ArrowRight,
  ChevronLeft, Home
} from 'lucide-react'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: Date
}

export default function NexoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // إضافة رسالة المستخدم مؤقتاً
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content: userMessage,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const res = await fetch('/api/nexo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      // حفظ معرف المحادثة
      if (data.conversationId) {
        setConversationId(data.conversationId)
      }

      // إضافة رد الـ AI
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        role: 'ASSISTANT',
        content: data.response,
        createdAt: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('NEXO Error:', error)
      // رسالة خطأ
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'ASSISTANT',
        content: 'عذراً، حدث خطأ. حاول تاني أو تواصل مع الدعم الفني. 😅',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* الشريط الجانبي */}
      <aside className="fixed top-0 right-0 w-20 h-full bg-white/5 backdrop-blur-xl border-l border-white/5 flex flex-col items-center py-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-white/80 mb-8">
          أ
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          <button
            onClick={() => router.push('/student')}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 text-white"
          >
            <Bot className="w-5 h-5" />
          </button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="pr-24 h-screen flex flex-col">
        {/* الهيدر */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center p-6 border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NEXO</h1>
              <p className="text-white/20 text-sm">مساعدك الذكي في الدراسة</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/20 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              متصل
            </span>
          </div>
        </motion.div>

        {/* منطقة المحادثة */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">مرحباً في NEXO 👋</h2>
              <p className="text-white/30 max-w-md">
                أنا مساعدك الذكي في الدراسة. اسألني أي حاجة عن دراستك، المواد، أو أي سؤال يخطر في بالك.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  'شرح درس الرياضيات',
                  'أفهم الفيزياء',
                  'الكيمياء سهلة؟',
                  'إزاي أحسن مستوايا'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion)
                      setTimeout(sendMessage, 100)
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all duration-300 border border-white/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === 'USER' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'USER'
                      ? 'bg-gradient-to-br from-white/10 to-white/5'
                      : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                  }`}>
                    {message.role === 'USER' ? (
                      <User className="w-4 h-4 text-white/40" />
                    ) : (
                      <Bot className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'USER' ? 'text-right' : ''
                  }`}>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'USER'
                        ? 'bg-white/5 text-white'
                        : 'bg-white/5 text-white/90'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-white/20 text-xs mt-1">
                      {message.role === 'USER' ? 'أنت' : 'NEXO'} • 
                      {new Date(message.createdAt).toLocaleTimeString('ar-EG')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white/60" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                input.trim() && !loading
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}