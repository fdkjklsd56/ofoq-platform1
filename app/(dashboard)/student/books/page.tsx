'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, BookOpen, Download, Eye, ChevronLeft, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BooksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/student/books')
        if (res.ok) {
          const data = await res.json()
          setBooks(data)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchBooks()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  const filteredBooks = books.filter((book: any) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.subject?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student">
            <button className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">المكتبة</h1>
            <p className="text-white/30 text-sm">جميع الكتب والمراجع</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن كتاب..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/5 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>تصفية</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-white rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white/40" />
                  </div>
                  <span className="text-xs text-white/20">{book.type || 'PDF'}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{book.title}</h3>
                <p className="text-white/30 text-sm mb-4">{book.subject}</p>
                <div className="flex items-center gap-3">
                  <button className="flex-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>عرض</span>
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/40">لا توجد كتب في المكتبة حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}