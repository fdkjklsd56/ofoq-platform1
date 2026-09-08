import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { sendVerificationEmail } from '@/lib/email/sendEmail'

const registerSchema = z.object({
  fullName: z.string().regex(/^[\u0600-\u06FF]+\s[\u0600-\u06FF]+\s[\u0600-\u06FF]+$/),
  email: z.string().email().regex(/@gmail\.com$/),
  phone: z.string().optional(),
  password: z.string().min(8),
  gender: z.enum(['MALE', 'FEMALE']),
  stage: z.string().optional(),
  grade: z.string().optional(),
  termsAccepted: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    // التحقق من وجود البريد
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await hash(validated.password, 12)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        fullName: validated.fullName,
        phone: validated.phone || null,
        gender: validated.gender,
        termsAccepted: validated.termsAccepted,
        termsAcceptedAt: new Date(),
        student: {
          create: {
            studentCode: `STU${Date.now().toString(36).toUpperCase()}`,
            stage: validated.stage || null,
            grade: validated.grade || null,
            phone: validated.phone || null,
          },
        },
      },
    })

    // إنشاء كود التحقق
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    // إرسال الإيميل
    await sendVerificationEmail(validated.email, code, validated.fullName)

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'تم إنشاء الحساب بنجاح',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    )
  }
}