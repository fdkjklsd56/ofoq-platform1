import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // جلب بيانات المعلم
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
      include: {
        courses: true,
        exams: true,
      }
    })

    if (!teacher) {
      // لو مش معلم، جرب تجيب من الـ user
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      })

      if (user?.role !== 'TEACHER') {
        return NextResponse.json({ error: 'Not a teacher' }, { status: 403 })
      }
    }

    const stats = {
      students: 0,
      courses: teacher?.courses?.length || 0,
      exams: teacher?.exams?.length || 0,
      rating: 0
    }

    // جلب الطلاب
    const students = await prisma.student.findMany({
      take: 5,
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    })

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.user.fullName,
      email: s.user.email,
      progress: 0,
      lastActive: 'منذ فترة'
    }))

    return NextResponse.json({ stats, students: formattedStudents })
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}