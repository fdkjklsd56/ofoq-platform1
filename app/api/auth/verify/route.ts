import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const verifySchema = z.object({
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  code: z
    .string()
    .regex(/^\d{6}$/, 'رمز التحقق يجب أن يتكون من 6 أرقام'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validated = verifySchema.parse(body)

    const { userId, code } = validated

    // التأكد من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // لو البريد متحقق بالفعل
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'البريد الإلكتروني متحقق منه بالفعل',
      })
    }

    // جلب رمز التحقق
    const verificationCode = await prisma.verificationCode.findUnique({
      where: { userId },
    })

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'رمز التحقق غير موجود أو انتهت صلاحيته' },
        { status: 400 }
      )
    }

    // التأكد من أن الرمز لم تنتهِ صلاحيته
    if (verificationCode.expiresAt < new Date()) {
      await prisma.verificationCode.delete({
        where: { userId },
      })

      return NextResponse.json(
        { error: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد' },
        { status: 400 }
      )
    }

    // التأكد من صحة الرمز
    if (verificationCode.code !== code) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح' },
        { status: 400 }
      )
    }

    // تأكيد البريد وحذف الرمز في عملية واحدة
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
        },
      }),

      prisma.verificationCode.delete({
        where: { userId },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'تم التحقق من البريد الإلكتروني بنجاح',
    })
  } catch (error) {
    console.error('Verification error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message || 'بيانات التحقق غير صحيحة',
        },
        { status: 400 }
      )
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير صالحة' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' },
      { status: 500 }
    )
  }
}