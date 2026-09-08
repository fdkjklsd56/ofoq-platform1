import {
  NextRequest,
  NextResponse,
} from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth.config'

import { prisma } from '@/lib/db/prisma'

import { getAIResponse } from '@/lib/ai/nexoAI'

export async function POST(
  request: NextRequest
) {
  try {
    // ==========================================
    // 1. التحقق من تسجيل الدخول
    // ==========================================

    const session =
      await getServerSession(authOptions)

    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        {
          error: 'غير مصرح به',
        },
        {
          status: 401,
        }
      )
    }

    // ==========================================
    // 2. قراءة رسالة الطالب
    // ==========================================

    const body = await request.json()

    const message = body?.message

    if (
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error: 'الرسالة مطلوبة',
        },
        {
          status: 400,
        }
      )
    }

    const cleanMessage = message.trim()

    console.log(
      '📝 User message:',
      cleanMessage
    )

    console.log(
      '👤 User ID:',
      userId
    )

    // ==========================================
    // 3. جلب بيانات الطالب
    // ==========================================

    let context: {
      name: string
      stage: string
      grade: string
      totalLessons: number
      completedLessons: number
      averageProgress: number
      recentLessons: {
        title: string
        completed: boolean
        progress: number
      }[]
    } | null = null

    try {
      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },

          include: {
            student: {
              include: {
                progress: {
                  include: {
                    lesson: true,
                    course: true,
                  },
                },
              },
            },
          },
        })

      if (user?.student) {
        const progress =
          user.student.progress || []

        const totalLessons =
          progress.length

        const completedLessons =
          progress.filter(
            item => item.completed
          ).length

        const averageProgress =
          totalLessons > 0
            ? Math.round(
                (completedLessons /
                  totalLessons) *
                  100
              )
            : 0

        context = {
          name:
            user.fullName || 'طالب',

          stage:
            user.student.stage ||
            'غير محدد',

          grade:
            user.student.grade ||
            'غير محدد',

          totalLessons,

          completedLessons,

          averageProgress,

          recentLessons:
            progress
              .slice(-3)
              .map(item => ({
                title:
                  item.lesson?.title ||
                  'درس غير محدد',

                completed:
                  item.completed,

                progress:
                  item.progress || 0,
              })),
        }
      }
    } catch (error) {
      console.error(
        '❌ Error getting student context:',
        error
      )
    }

    console.log(
      '📊 Context:',
      context ? 'Found' : 'Not found'
    )

    // ==========================================
    // 4. إنشاء Prompt
    // ==========================================

    let prompt = `
أنت NEXO، المساعد الذكي الرسمي لمنصة أفق التعليمية.

مهمتك مساعدة الطالب على فهم المواد الدراسية
وتنظيم مذاكرته وتوجيهه للمحتوى المناسب.

أسلوبك:
- تحدث باللهجة المصرية بشكل طبيعي وودود.
- كن واضحًا ومختصرًا.
- اشرح المعلومة بطريقة بسيطة.
- شجع الطالب بدون مبالغة.
- إذا كان السؤال دراسيًا، ساعده على الفهم خطوة بخطوة.
- لا تساعد على الغش في الامتحانات.
- لا تقدم إجابات جاهزة بهدف الغش أو التحايل على الاختبارات.

رسالة الطالب:
${cleanMessage}
`

    if (context) {
      prompt = `
أنت NEXO، المساعد الذكي الرسمي لمنصة أفق التعليمية.

بيانات الطالب:

الاسم:
${context.name}

المرحلة:
${context.stage}

الصف:
${context.grade}

نسبة التقدم:
${context.averageProgress}%

عدد الدروس الموجودة في سجل التقدم:
${context.totalLessons}

عدد الدروس المكتملة:
${context.completedLessons}

تعليمات NEXO:

1. تحدث باللهجة المصرية بشكل طبيعي وودود.
2. ساعد الطالب في فهم المواد بطريقة مبسطة.
3. استخدم بيانات الطالب عندما تكون مفيدة.
4. شجع الطالب على الاستمرار.
5. لا تساعد على الغش.
6. لا تقدم إجابات جاهزة بهدف الغش في الامتحانات.
7. إذا كان الطالب يريد فهم سؤال، اشرح له الفكرة والخطوات.
8. لا تدّعي أنك إنسان.

رسالة الطالب:
${cleanMessage}
`
    }

    // ==========================================
    // 5. استدعاء الذكاء الاصطناعي
    // ==========================================

    console.log(
      '🤖 Calling NEXO AI...'
    )

    let aiResponse =
      await getAIResponse(prompt)

    console.log(
      '✅ AI response:',
      aiResponse?.substring(0, 100)
    )

    if (
      !aiResponse ||
      aiResponse.trim().length < 3
    ) {
      aiResponse =
        'آسف، مش عارف أرد دلوقتي 😅 جرب تسأل بطريقة تانية وأنا هساعدك!'
    }

    // ==========================================
    // 6. إرجاع الرد
    // ==========================================
    //
    // حفظ المحادثة متوقف حاليًا لأن
    // Prisma Client الحالي لا يحتوي على
    // nexоConversation / nexoMessage.
    //
    // الـAI نفسه يعمل بشكل طبيعي.
    //

    return NextResponse.json({
      response: aiResponse,
      conversationId: null,
    })

  } catch (error) {
    console.error(
      '💥 NEXO Error:',
      error
    )

    return NextResponse.json(
      {
        error: 'حدث خطأ في NEXO',
      },
      {
        status: 500,
      }
    )
  }
}