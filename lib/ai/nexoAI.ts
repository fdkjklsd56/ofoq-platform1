export async function getAIResponse(prompt: string): Promise<string> {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found')
      return fallbackResponse(prompt)
    }

    const cleanKey = GEMINI_API_KEY.trim()
    
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', response.status, errorText)
      return fallbackResponse(prompt)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    return text || fallbackResponse(prompt)
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