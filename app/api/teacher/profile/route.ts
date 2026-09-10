import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { teacher: true }
    })

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      bio: user.teacher?.bio || '',
      specialization: user.teacher?.specialization || ''
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
      }
    })

    if (data.bio !== undefined || data.specialization !== undefined) {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })
      if (teacher) {
        await prisma.teacher.update({
          where: { id: teacher.id },
          data: {
            bio: data.bio,
            specialization: data.specialization
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}