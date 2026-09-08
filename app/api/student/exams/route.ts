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

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        examAttempts: {
          include: {
            exam: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // اختبارات قادمة (مؤقتاً)
    const upcomingExams = [
      // هنضيفها بعدين من قاعدة البيانات
    ]

    // اختبارات منتهية
    const completedExams = student.examAttempts.map(attempt => ({
      id: attempt.id,
      title: attempt.exam.title,
      score: attempt.score || 0,
      passingScore: attempt.exam.passingScore || 60,
      date: attempt.completedAt || attempt.startedAt,
      status: 'completed'
    }))

    return NextResponse.json([...upcomingExams, ...completedExams])
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}