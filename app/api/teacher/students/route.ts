import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true
          }
        }
      },
      take: 100
    })

    const formatted = students.map(s => ({
      id: s.id,
      name: s.user.fullName,
      email: s.user.email,
      phone: s.user.phone,
      progress: 0,
      stage: s.stage,
      grade: s.grade
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}