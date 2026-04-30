'use client'

type Props = {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function MessageBubble({ role, content, isStreaming }: Props) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center">
          {/* 申告書風の公印アイコン */}
          <div className="w-8 h-8 rounded-full border-2 border-tax-stamp flex items-center justify-center">
            <span className="text-tax-stamp text-xs font-bold leading-none">AI</span>
          </div>
        </div>
      )}
      <div
        className={`max-w-[85%] text-sm leading-relaxed ${
          isUser
            ? 'bg-tax-navy text-white rounded-2xl rounded-br-sm px-4 py-3'
            : 'bg-paper-light border border-tax-rule rounded-2xl rounded-bl-sm px-4 py-3 text-tax-ink shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-current opacity-60 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
