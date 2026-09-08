import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'
import { getAIResponse } from '@/lib/ai/nexoAI'

export async function POST(request: NextRequest) {
  try {
    // 1. التحقق من الجلسة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    // 2. جلب البيانات
    const { message } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 })
    }

    console.log('📝 User message:', message)
    console.log('👤 User ID:', session.user.id)

    // 3. جلب السياق (بـ prisma)
    let context = null
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          student: {
            include: {
              progress: {
                include: {
                  lesson: true,
                  course: true
                }
              }
            }
          }
        }
      })

      if (user?.student) {
        const progress = user.student.progress || []
        const totalLessons = progress.length
        const completedLessons = progress.filter((p: any) => p.completed).length
        const averageProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

        context = {
          name: user.fullName || 'طالب',
          stage: user.student.stage || 'غير محدد',
          grade: user.student.grade || 'غير محدد',
          totalLessons,
          completedLessons,
          averageProgress,
          recentLessons: progress.slice(-3).map((p: any) => ({
            title: p.lesson?.title || 'درس غير محدد',
            completed: p.completed,
            progress: p.progress || 0
          }))
        }
      }
    } catch (error) {
      console.error('❌ Error getting context:', error)
    }

    console.log('📊 Context:', context ? 'Found' : 'Not found')

    // 4. توليد الـ Prompt
    let prompt = `أنت NEXO، مساعد ذكي على منصة أفق التعليمية.
تحدث بلهجة مصرية ودية وجذابة.
ساعد الطالب في فهم المواد وتوجيهه للمحتوى المناسب.
لا تقدم حلولاً مباشرة للواجبات ولا تساعد في الغش.

رسالة الطالب: ${message}`

    if (context) {
      prompt = `أنت NEXO، مساعد ذكي على منصة أفق التعليمية.

معلومات الطالب:
- الاسم: ${context.name}
- المرحلة: ${context.stage}
- الصف: ${context.grade}
- نسبة التقدم: ${context.averageProgress}%

تعليمات:
1. تحدث بلهجة مصرية طبيعية ودية
2. ساعد الطالب في فهم المواد بأسلوب مبسط
3. لا تقدم حلولاً مباشرة للغش

رسالة الطالب: ${message}`
    }

    // 5. استدعاء الـ AI
    console.log('🤖 Calling AI...')
    let aiResponse = await getAIResponse(prompt)
    console.log('✅ AI response:', aiResponse?.substring(0, 50))

    if (!aiResponse || aiResponse.trim().length < 3) {
      aiResponse = "آسف، مش عارف أرد دلوقتي 😅 جرب تسأل بطريقة تانية وانا هساعدك!"
    }

    // 6. حفظ المحادثة (مع try/catch)
    try {
      const conversation = await prisma.nexoConversation.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50),
          context: context || {}
        }
      })

      await prisma.nexoMessage.create({
        data: {
          conversationId: conversation.id,
          userId: session.user.id,
          role: 'USER',
          content: message
        }
      })

      await prisma.nexoMessage.create({
        data: {
          conversationId: conversation.id,
          userId: session.user.id,
          role: 'ASSISTANT',
          content: aiResponse
        }
      })

      return NextResponse.json({
        response: aiResponse,
        conversationId: conversation.id
      })
    } catch (dbError) {
      console.error('💾 DB Error:', dbError)
      // حتى لو فشل الحفظ، نرجع الرد
      return NextResponse.json({
        response: aiResponse,
        conversationId: null
      })
    }

  } catch (error) {
    console.error('💥 NEXO Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في NEXO' },
      { status: 500 }
    )
  }
}