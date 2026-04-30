'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import FileUploader from './FileUploader'
import PlanBadge from './PlanBadge'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

type InputMode = 'photo' | 'scan' | 'chat'

const ANON_LIMIT = 3
const LOCALSTORAGE_KEY = 'tax_anon_count'

const TABS: { mode: InputMode; emoji: string; label: string }[] = [
  { mode: 'photo', emoji: '📸', label: '写真' },
  { mode: 'scan', emoji: '📄', label: 'スキャン' },
  { mode: 'chat', emoji: '💬', label: 'チャット' },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'こんにちは！確定申告のお手伝いをします 📋\n\n書類の写真を撮るか、PDFをアップロードするか、直接質問してください。\n\n例：「源泉徴収票の見方を教えて」「医療費控除はどこに書く？」',
    },
  ])
  const [inputMode, setInputMode] = useState<InputMode>('chat')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [anonCount, setAnonCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(LOCALSTORAGE_KEY) ?? '0', 10)
    setAnonCount(stored)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const remaining = Math.max(0, ANON_LIMIT - anonCount)

  const handleSubmit = useCallback(async () => {
    if ((!text.trim() && !file) || isLoading) return

    if (anonCount >= ANON_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            '🔒 無料の質問回数（3回）に達しました。\n\nアカウントを作成すると毎月5回まで無料でご利用いただけます。',
        },
      ])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim() || (file ? `📎 ${file.name}` : ''),
    }
    const assistantId = `ai-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: 'assistant', content: '', isStreaming: true },
    ])
    setText('')
    setFile(null)
    setIsLoading(true)

    const newCount = anonCount + 1
    setAnonCount(newCount)
    localStorage.setItem(LOCALSTORAGE_KEY, newCount.toString())

    try {
      const formData = new FormData()
      if (text.trim()) formData.append('message', text.trim())
      if (file) formData.append('file', file)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'APIエラーが発生しました' }))
        throw new Error(err.error ?? 'APIエラー')
      }

      if (!res.body) throw new Error('レスポンスが空です')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated, isStreaming: true } : m
          )
        )
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: accumulated, isStreaming: false } : m
        )
      )
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'エラーが発生しました'
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: `⚠️ ${errorMsg}\n\nもう一度お試しください。`,
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [text, file, isLoading, anonCount])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-svh max-w-2xl mx-auto bg-gray-50">
      {/* Header */}
      <header className="bg-[#2563EB] text-white px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
        <div className="flex-1">
          <h1 className="text-base font-bold leading-none">確定申告AI</h1>
          <p className="text-xs text-blue-200 mt-0.5">書類記入サポート</p>
        </div>
        <PlanBadge plan={null} remaining={remaining} />
      </header>

      {/* Mode Tabs */}
      <div className="flex border-b bg-white flex-shrink-0">
        {TABS.map(({ mode, emoji, label }) => (
          <button
            key={mode}
            onClick={() => setInputMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              inputMode === mode
                ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-center gap-2 text-gray-500 text-sm pl-10 mb-4">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
            書類を読み取っています...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t px-4 py-3 flex-shrink-0">
        {(inputMode === 'photo' || inputMode === 'scan') && (
          <FileUploader mode={inputMode} onFileSelect={setFile} selectedFile={file} />
        )}
        {file && (
          <div className="text-xs text-blue-600 mb-2 flex items-center gap-1">
            <span>📎</span>
            <span className="truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="ml-1 text-gray-400 hover:text-gray-600"
              aria-label="ファイルを削除"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              inputMode === 'chat'
                ? '質問を入力してください... (Enterで送信)'
                : '書類についての質問やメモ（省略可）'
            }
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!text.trim() && !file)}
            className="bg-[#2563EB] text-white rounded-xl p-3 disabled:opacity-40 hover:bg-blue-700 transition-colors flex-shrink-0"
            aria-label="送信"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
        {anonCount > 0 && anonCount < ANON_LIMIT && (
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            残り{remaining}回 ·{' '}
            <a href="/auth" className="text-blue-500 hover:underline">
              ログインで5回/月まで無料
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
