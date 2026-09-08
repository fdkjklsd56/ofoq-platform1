import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // جلب البيانات الحقيقية
    const [users, teachers, courses] = await Promise.all([
      prisma.user.count(),
      prisma.teacher.count(),
      prisma.course.count(),
    ])

    const stats = {
      users,
      teachers,
      courses,
      revenue: 0 // هنضيف نظام الدفع بعدين
    }

    // جلب آخر الأنشطة
    const recentActivity = [
      // هنضيف الأنشطة الحقيقية بعدين
    ]

    return NextResponse.json({ stats, recentActivity })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}