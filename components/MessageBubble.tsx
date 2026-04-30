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
        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#2563EB] text-white rounded-br-sm'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-current opacity-70 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
