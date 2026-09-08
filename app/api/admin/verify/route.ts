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

    // ✅ جلب الدور من قاعدة البيانات مباشرة (أضمن)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    const isAdmin = user?.role === 'ADMIN'

    console.log('Admin check:', { userId: session.user.id, role: user?.role, isAdmin })

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}