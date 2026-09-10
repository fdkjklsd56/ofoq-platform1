'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Home, BookOpen, Video, Bot, 
  ClipboardList, BarChart3, Users 
} from 'lucide-react'

interface MobileNavProps {
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname()

  const studentItems = [
    { icon: Home, label: 'الرئيسية', href: '/student' },
    { icon: BookOpen, label: 'المكتبة', href: '/student/books' },
    { icon: Video, label: 'الكورسات', href: '/student/courses' },
    { icon: ClipboardList, label: 'الاختبارات', href: '/student/exams' },
    { icon: Bot, label: 'NEXO', href: '/student/nexo' },
  ]

  const teacherItems = [
    { icon: Home, label: 'الرئيسية', href: '/teacher' },
    { icon: Users, label: 'الطلاب', href: '/teacher/students' },
    { icon: BookOpen, label: 'الكورسات', href: '/teacher/courses' },
    { icon: ClipboardList, label: 'الاختبارات', href: '/teacher/exams' },
  ]

  const adminItems = [
    { icon: Home, label: 'الرئيسية', href: '/admin' },
    { icon: Users, label: 'المستخدمين', href: '/admin/users' },
    { icon: BookOpen, label: 'الكورسات', href: '/admin/courses' },
    { icon: BarChart3, label: 'الإحصائيات', href: '/admin/analytics' },
  ]

  const items = role === 'ADMIN' ? adminItems : role === 'TEACHER' ? teacherItems : studentItems

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-xl border-t border-white/5">
      <div className="flex justify-around items-center py-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                isActive
                  ? 'text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}