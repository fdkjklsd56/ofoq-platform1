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
        user: true,
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
        examAttempts: true
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const stats = {
      subjects: student.enrollments.length,
      lessons: student.progress.filter(p => p.completed).length,
      progress: student.enrollments.length > 0 
        ? Math.round((student.progress.filter(p => p.completed).length / student.enrollments.reduce((acc, e) => acc + e.course.lessons.length, 0)) * 100)
        : 0,
      exams: student.examAttempts.length
    }

    const courses = student.enrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      teacher: enrollment.course.teacherId || 'المعلم',
      progress: enrollment.progress || 0
    }))

    return NextResponse.json({ stats, courses })
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}