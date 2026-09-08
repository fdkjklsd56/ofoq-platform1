// lib/ai/nexoAI.ts

export async function getAIResponse(prompt: string): Promise<string> {
  try {
    // استخدام Gemini API مباشرة
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found')
      return fallbackResponse(prompt)
    }

    // تنظيف المفتاح
    const cleanKey = GEMINI_API_KEY.trim().replace(/^AQ\./, '')
    
    console.log('API Key (first 10 chars):', cleanKey.substring(0, 10))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${cleanKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API Error:', data)
      throw new Error(`API Error: ${response.status}`)
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (text) {
      return text
    }

    return fallbackResponse(prompt)
  } catch (error) {
    console.error('AI Error:', error)
    return fallbackResponse(prompt)
  }
}

function fallbackResponse(prompt: string): string {
  const responses = [
    "والله أنا هنا عشان أساعدك 😊 بس حصلت مشكلة تقنية بسيطة. جرب تاني بعد شوية!",
    "يا عم أنا NEXO، مساعدك الذكي 👋 بس أظن النت واجعني شوية. كرر سؤالك وانا هرد عليك!",
    "شكلك عندك سؤال مهم 📚 بس أنا محتاج شوية وقت عشان أفكر. قولي تاني بسرعة!",
    "يا سيدي أنا معاك 💪 بس الـ AI واجعني شوية. جرب تاني وهرد عليك فوراً!"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}