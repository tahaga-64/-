import { NextRequest, NextResponse } from 'next/server'
import { streamAI, buildSystemPrompt, type AIMessage, type UserProfile } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY または ANTHROPIC_API_KEY が設定されていません' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json() as {
      messages: AIMessage[]
      profile?: UserProfile
    }

    const { messages, profile } = body

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages が必要です' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt(profile)

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          await streamAI(messages, systemPrompt, (text) => {
            controller.enqueue(encoder.encode(text))
          })
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('/api/chat error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
