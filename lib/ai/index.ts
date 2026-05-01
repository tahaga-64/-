import { streamGemini } from './gemini'
import { streamClaude } from './claude'

export type AIMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type UserProfile = {
  ageGroup?: string
  employmentType?: string
  prefecture?: string
  annualIncome?: number
  hasSpouse?: boolean
  hasChildren?: boolean
  hasMortgage?: boolean
  hasIdeco?: boolean
}

export function buildSystemPrompt(profile?: UserProfile): string {
  const profileSection = profile
    ? `【ユーザー情報】
- 年齢層：${profile.ageGroup ?? '不明'}
- 職業：${profile.employmentType ?? '不明'}
- 都道府県：${profile.prefecture ?? '不明'}
- 年収目安：${profile.annualIncome ? `${(profile.annualIncome / 10000).toFixed(0)}万円` : '不明'}
- 配偶者：${profile.hasSpouse ? 'あり' : 'なし'}
- 子供：${profile.hasChildren ? 'あり' : 'なし'}
- 住宅ローン：${profile.hasMortgage ? 'あり' : 'なし'}
- iDeCo：${profile.hasIdeco ? '加入中' : '未加入'}
`
    : ''

  return `あなたは日本の税金・年金・社会保険のプロフェッショナルアドバイザーです。

${profileSection}
【回答の原則】
1. 必ず「なぜそうなるのか」の理由を説明する
2. ユーザーの具体的な状況に当てはめて説明する
3. 「あなたの場合は○○円の節税ができます」のように金額を具体的に示す
4. 専門用語は使うが、必ず平易な言葉で補足する
5. 回答の最後に「次にやること」を1〜3個提示する
6. 絵文字を適度に使い、親しみやすいトーンを維持する
7. 回答はステップ形式で、1つずつ案内する

【注意事項】
- 税務申告の最終判断は税理士・税務署に確認するよう促す
- 不確実な情報は「〜の可能性があります」と明示する
- 2025年度の税制改正（基礎控除58万円、配偶者控除上限123万円等）を反映する
- 最後に必ず「この内容は参考情報です。正確な申告は税理士または国税庁のサイトでご確認ください」と添える`
}

/**
 * AI応答をストリーミング。Gemini を優先し、失敗時は Claude にフォールバック。
 */
export async function streamAI(
  messages: AIMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const geminiMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
    text: m.content,
  }))

  const claudeMessages = messages.map((m) => ({
    role: m.role,
    text: m.content,
  }))

  // Gemini優先
  if (process.env.GEMINI_API_KEY) {
    try {
      await streamGemini(geminiMessages, systemPrompt, onChunk)
      return
    } catch (err) {
      console.warn('Gemini failed, falling back to Claude:', err)
    }
  }

  // Claudeフォールバック
  if (process.env.ANTHROPIC_API_KEY) {
    await streamClaude(claudeMessages, systemPrompt, onChunk)
    return
  }

  throw new Error('No AI API key configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY.')
}
