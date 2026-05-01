import { GoogleGenerativeAI } from '@google/generative-ai'

function getGemini() {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

export async function streamGemini(
  messages: { role: 'user' | 'model'; text: string }[],
  systemPrompt: string,
  onChunk: (text: string) => void
) {
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))

  const lastMessage = messages[messages.length - 1].text

  const chat = model.startChat({ history })
  const result = await chat.sendMessageStream(lastMessage)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) onChunk(text)
  }
}
