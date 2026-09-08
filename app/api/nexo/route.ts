import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/db/prisma'
import { getAIResponse } from '@/lib/ai/nexoAI'

// السياق الخاص بالطالب
const getStudentContext = async (userId: string) => {
  if (!userId) {
    console.log('❌ No userId provided')
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user?.student) {
      console.log('❌ No student found for user:', userId)
      return null
    }

    const progress = user.student.progress || []
    const totalLessons = progress.length
    const completedLessons = progress.filter((p: any) => p.completed).length
    const averageProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return {
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
  } catch (error) {
    console.error('Error getting student context:', error)
    return null
  }
}

// توليد الـ Prompt
const generateNEXOPrompt = (context: any, userMessage: string, history: any[] = []) => {
  const historyText = history.length > 0 
    ? `\n\nسجل المحادثة السابق:\n${history.map((m: any) => `${m.role === 'USER' ? 'الطالب' : 'NEXO'}: ${m.content}`).join('\n')}`
    : ''

  const basePrompt = `أنت NEXO، مساعد ذكي على منصة أفق التعليمية. 
تحدث بلهجة مصرية ودية وجذابة (زي: "يا عم"، "يلا بينا"، "شكلك"، "والله").
ساعد الطالب في فهم المواد وتوجيهه للمحتوى المناسب.
لا تقدم حلولاً مباشرة للواجبات ولا تساعد في الغش.

رسالة الطالب: ${userMessage}${historyText}`

  if (!context) {
    return basePrompt
  }

  return `أنت NEXO، مساعد ذكي على منصة أفق التعليمية.

معلومات الطالب:
- الاسم: ${context.name}
- المرحلة: ${context.stage}
- الصف: ${context.grade}
- عدد الدروس الكلي: ${context.totalLessons}
- الدروس المكتملة: ${context.completedLessons}
- نسبة التقدم: ${context.averageProgress}%

${context.recentLessons.length > 0 ? `آخر الدروس:\n${context.recentLessons.map((l: any) => `- ${l.title}: ${l.completed ? '✅ مكتمل' : `⏳ ${l.progress}%`}`).join('\n')}` : ''}

تعليمات:
1. تحدث بلهجة مصرية طبيعية ودية
2. ساعد الطالب في فهم المواد بأسلوب مبسط
3. لا تقدم حلولاً مباشرة للغش

${historyText}

رسالة الطالب: ${userMessage}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 NEXO API called')
    
    const session = await getServerSession(authOptions)
    console.log('📋 Session:', session?.user?.email, 'ID:', session?.user?.id)
    
    if (!session?.user) {
      console.log('❌ No session')
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    // ✅ تأكد من وجود user id
    const userId = session.user.id
    if (!userId) {
      console.log('❌ No user ID in session')
      return NextResponse.json({ error: 'معرف المستخدم غير موجود' }, { status: 400 })
    }

    const { message, conversationId } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 })
    }

    console.log('📝 User message:', message.substring(0, 50))

    // جلب السياق
    const context = await getStudentContext(userId)
    console.log('📊 Context:', context ? 'Found' : 'Not found')

    // جلب المحادثة السابقة
    let conversation
    if (conversationId) {
      conversation = await prisma.nexoConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
    }

    if (!conversation) {
      conversation = await prisma.nexoConversation.create({
        data: {
          userId: userId,
          title: message.slice(0, 50),
          context: context || {}
        }
      })
      console.log('💬 New conversation created:', conversation.id)
    }

    // حفظ رسالة المستخدم
    await prisma.nexoMessage.create({
      data: {
        conversationId: conversation.id,
        userId: userId,
        role: 'USER',
        content: message
      }
    })

    // توليد الـ Prompt
    const history = conversation.messages || []
    const prompt = generateNEXOPrompt(context, message, history)

    // استدعاء الـ AI
    let aiResponse = await getAIResponse(prompt)

    if (!aiResponse || aiResponse.trim().length < 3) {
      aiResponse = "آسف، مش عارف أرد دلوقتي 😅 جرب تسأل بطريقة تانية وانا هساعدك!"
    }

    // حفظ رد الـ AI
    await prisma.nexoMessage.create({
      data: {
        conversationId: conversation.id,
        userId: userId,
        role: 'ASSISTANT',
        content: aiResponse
      }
    })

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id
    })

  } catch (error) {
    console.error('💥 NEXO Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في NEXO: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    )
  }
}