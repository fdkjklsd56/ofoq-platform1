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
        enrollments: {
          include: {
            course: {
              include: {
                lessons: true
              }
            }
          }
        },
        progress: true,
        examAttempts: true,
        user: true
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const totalLessons = student.enrollments.reduce((acc, e) => acc + e.course.lessons.length, 0)
    const completedLessons = student.progress.filter(p => p.completed).length

    const stats = {
      subjects: student.enrollments.length,
      lessons: completedLessons,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      exams: student.examAttempts.length,
      upcomingExams: [],
      recentActivities: []
    }

    const courses = student.enrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      teacher: enrollment.course.teacherId || 'المعلم',
      progress: enrollment.progress || 0,
      total: enrollment.course.lessons.length,
      completed: student.progress.filter(p => p.courseId === enrollment.course.id && p.completed).length
    }))

    return NextResponse.json({ stats, courses })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}