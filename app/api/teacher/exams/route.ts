import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) return NextResponse.json([])

    const exams = await prisma.exam.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}