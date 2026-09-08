export async function getAIResponse(
  prompt: string
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim()

    if (!apiKey) {
      console.error(
        '❌ GEMINI_API_KEY is missing'
      )

      return 'NEXO غير متاح حاليًا بسبب إعدادات الخادم. حاول مرة أخرى لاحقًا.'
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },

        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText =
        await response.text()

      console.error(
        '❌ Gemini API Error:',
        response.status,
        errorText
      )

      return getFallbackResponse(
        response.status
      )
    }

    const data = await response.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (
      typeof text !== 'string' ||
      text.trim().length === 0
    ) {
      console.error(
        '❌ Gemini returned no text:',
        JSON.stringify(data)
      )

      return 'NEXO استقبل سؤالك، لكن حصلت مشكلة في تكوين الرد 😅 جرّب تاني.'
    }

    return text.trim()
  } catch (error) {
    console.error(
      '💥 NEXO AI Error:',
      error
    )

    return 'حصلت مشكلة في الاتصال بالذكاء الاصطناعي 😅 جرّب تاني بعد لحظة.'
  }
}

function getFallbackResponse(
  status: number
): string {
  if (status === 400) {
    return 'حصل خطأ في طلب NEXO 😅 جرّب صياغة السؤال بطريقة تانية.'
  }

  if (status === 401 || status === 403) {
    return 'NEXO مش قادر يتصل بخدمة الذكاء الاصطناعي حاليًا. راجع إعدادات API.'
  }

  if (status === 429) {
    return 'NEXO عليه ضغط شوية دلوقتي 😅 استنى لحظة وجرب تاني.'
  }

  if (status >= 500) {
    return 'خدمة الذكاء الاصطناعي مش متاحة مؤقتًا. جرّب تاني بعد شوية.'
  }

  return 'حصلت مشكلة تقنية بسيطة في NEXO 😅 جرّب تاني.'
}