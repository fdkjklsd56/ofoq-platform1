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
        progress: {
          include: {
            course: true,
            lesson: true
          }
        },
        enrollments: {
          include: {
            course: {
              include: {
                lessons: true
              }
            }
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const progress = student.enrollments.map(enrollment => {
      const courseProgress = student.progress.filter(p => p.courseId === enrollment.course.id)
      const completed = courseProgress.filter(p => p.completed).length
      const total = enrollment.course.lessons.length

      return {
        courseTitle: enrollment.course.title,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        completed,
        total
      }
    })

    const stats = {
      total: student.enrollments.reduce((acc, e) => acc + e.course.lessons.length, 0),
      completed: student.progress.filter(p => p.completed).length,
      percentage: 0,
      averageScore: 0,
      streak: 0
    }

    return NextResponse.json({ progress, stats })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}