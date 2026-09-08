import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const student = await prisma.student.findUnique({
      where: {
        userId: userId,
      },

      include: {
        enrollments: {
          include: {
            course: {
              include: {
                lessons: true,
              },
            },
          },
        },

        progress: true,

        examAttempts: true,

        user: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const totalLessons = student.enrollments.reduce(
      (total, enrollment) =>
        total + enrollment.course.lessons.length,
      0
    )

    const completedLessons = student.progress.filter(
      progress => progress.completed
    ).length

    const progressPercentage =
      totalLessons > 0
        ? Math.round(
            (completedLessons / totalLessons) * 100
          )
        : 0

    const stats = {
      subjects: student.enrollments.length,

      lessons: completedLessons,

      progress: progressPercentage,

      exams: student.examAttempts.length,

      upcomingExams: [],

      recentActivities: [],
    }

    const courses = student.enrollments.map(
      enrollment => ({
        id: enrollment.course.id,

        title: enrollment.course.title,

        teacher:
          enrollment.course.teacherId ||
          'المعلم',

        progress:
          enrollment.progress || 0,

        total:
          enrollment.course.lessons.length,

        completed:
          student.progress.filter(
            progress =>
              progress.courseId ===
                enrollment.course.id &&
              progress.completed
          ).length,
      })
    )

    return NextResponse.json({
      stats,
      courses,
    })
  } catch (error) {
    console.error(
      'Error fetching dashboard:',
      error
    )

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}