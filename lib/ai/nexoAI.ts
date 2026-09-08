// lib/ai/nexoAI.ts

export async function getAIResponse(prompt: string): Promise<string> {
  // استخدام Google Gemini
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
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

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أستطع توليد رد. حاول تاني 😅'
    } catch (error) {
      console.error('Gemini error:', error)
      return fallbackResponse(prompt)
    }
  }

  // استخدام OpenAI
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'أنت NEXO، مساعد تعليمي عربي ذكي. تحدث بلهجة مصرية طبيعية، وساعد الطلاب في فهم المواد.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || fallbackResponse(prompt)
    } catch (error) {
      console.error('OpenAI error:', error)
      return fallbackResponse(prompt)
    }
  }

  return fallbackResponse(prompt)
}

// الرد الاحتياطي لو فشل الـ AI
function fallbackResponse(prompt: string): string {
  const responses = [
    "والله أنا هنا عشان أساعدك 😊 بس حصلت مشكلة تقنية بسيطة. جرب تاني بعد شوية!",
    "يا عم أنا NEXO، مساعدك الذكي 👋 بس أظن النت واجعني شوية. كرر سؤالك وانا هرد عليك!",
    "شكلك عندك سؤال مهم 📚 بس أنا محتاج شوية وقت عشان أفكر. قولي تاني بسرعة!",
    "يا سيدي أنا معاك 💪 بس الـ AI واجعني شوية. جرب تاني وهرد عليك فوراً!"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}