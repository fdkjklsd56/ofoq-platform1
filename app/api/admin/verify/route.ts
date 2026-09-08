import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    const isAdmin = user?.role === 'ADMIN'

    return NextResponse.json({ isAdmin })
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}