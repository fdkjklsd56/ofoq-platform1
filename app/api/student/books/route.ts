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

    const books = await prisma.book.findMany({
      where: {
        isPublished: true,
        OR: [
          { isFree: true },
          { student: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        subject: true,
        stage: true
      }
    })

    const formattedBooks = books.map(book => ({
      id: book.id,
      title: book.title,
      subject: book.subject?.name || 'عام',
      type: book.fileType || 'PDF',
      isFree: book.isFree
    }))

    return NextResponse.json(formattedBooks)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}