import { NextRequest, NextResponse } from 'next/server'
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは4MB以下にしてください' },
        { status: 413 }
      )
    }

    const formData = await req.formData()
    const message = formData.get('message') as string | null
    const file = formData.get('file') as File | null

    if (!message && !file) {
      return NextResponse.json({ error: 'メッセージまたはファイルが必要です' }, { status: 400 })
    }

    type UserContentBlock =
      | { type: 'text'; text: string }
      | {
          type: 'image'
          source: { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string }
        }

    const userContent: UserContentBlock[] = []

    if (file) {
      if (file.type === 'application/pdf') {
        // For PDFs, extract text and send as text block
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        try {
          const pdfParse = (await import('pdf-parse')).default
          const pdfData = await pdfParse(buffer)
          const pdfText = pdfData.text.slice(0, 8000)
          userContent.push({
            type: 'text',
            text: `[PDF書類の内容]\n${pdfText}\n\n${message ?? '上記の書類について、記入方法をやさしく説明してください'}`,
          })
        } catch {
          userContent.push({
            type: 'text',
            text: `[PDFのアップロードがありましたが読み取りに失敗しました]\n\n${message ?? 'PDF書類について質問があります'}`,
          })
        }
      } else if (file.type.startsWith('image/')) {
        const bytes = await file.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
        userContent.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        })
        if (message) {
          userContent.push({ type: 'text', text: message })
        } else {
          userContent.push({
            type: 'text',
            text: 'この書類の種類を識別し、記入方法をやさしく説明してください',
          })
        }
      }
    } else if (message) {
      userContent.push({ type: 'text', text: message })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userContent }],
            stream: true,
          })

          for await (const event of response) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
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
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('/api/analyze error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
