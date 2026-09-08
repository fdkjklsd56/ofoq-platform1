import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { sendVerificationEmail } from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // حذف الرمز القديم
    await prisma.verificationCode.deleteMany({
      where: { userId },
    })

    // إنشاء رمز جديد
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.verificationCode.create({
      data: {
        userId,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    // إرسال الإيميل
    await sendVerificationEmail(user.email, code, user.fullName)

    return NextResponse.json({
      success: true,
      message: 'تم إعادة إرسال رمز التحقق',
    })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    )
  }
}