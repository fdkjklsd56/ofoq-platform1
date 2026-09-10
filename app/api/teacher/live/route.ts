import { NextRequest, NextResponse } from 'next/server'
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

    const streams = await prisma.liveStream.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(streams)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })
    if (!teacher) return NextResponse.json({ error: 'Not a teacher' }, { status: 403 })

    const data = await request.json()

    const stream = await prisma.liveStream.create({
      data: {
        teacherId: teacher.id,
        title: data.title,
        description: data.description,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration,
        status: 'SCHEDULED',
        streamKey: `stream_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }
    })

    return NextResponse.json(stream)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}