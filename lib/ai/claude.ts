import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function streamClaude(
  messages: { role: 'user' | 'assistant'; text: string }[],
  systemPrompt: string,
  onChunk: (text: string) => void
) {
  const client = getAnthropic()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.text })),
    stream: true,
  })

  for await (const event of response) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onChunk(event.delta.text)
    }
  }
}
