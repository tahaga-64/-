'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Navigation from './Navigation'
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
const LOCALSTORAGE_KEY = 'mw_anon_count'

const TABS: { mode: InputMode; emoji: string; label: string }[] = [
  { mode: 'photo', emoji: '📸', label: '書類撮影' },
  { mode: 'scan', emoji: '📄', label: 'スキャン' },
  { mode: 'chat', emoji: '✏️', label: 'チャット' },
]

const QUICK_QUESTIONS = [
  '確定申告が必要か教えて',
  '医療費控除の申請方法',
  'ふるさと納税の上限を知りたい',
  '副業収入の申告方法',
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'こんにちは！税金・年金・社会保険について何でもご質問ください 📋\n\n書類の写真・PDF をアップロードすることもできます。\n\n【よく聞かれる質問】\n• 確定申告が必要かどうか判定してほしい\n• 副業が会社にバレないか心配\n• 医療費控除・ふるさと納税の申請方法',
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

  const sendMessage = useCallback(async (userText: string, userFile?: File | null) => {
    if ((!userText.trim() && !userFile) || isLoading) return

    if (anonCount >= ANON_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🔒 無料の質問回数（3回）に達しました。\n\nアカウントを作成すると毎月5回まで無料でご利用いただけます。',
        },
      ])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText.trim() || (userFile ? `📎 ${userFile.name}` : ''),
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
      let res: Response

      if (userFile) {
        // ファイルありの場合は analyze ルート（Vision対応）を使用
        const formData = new FormData()
        if (userText.trim()) formData.append('message', userText.trim())
        formData.append('file', userFile)
        res = await fetch('/api/analyze', { method: 'POST', body: formData })
      } else {
        // テキストのみ → 新しい /api/chat ルート（Gemini優先）を使用
        const historyMessages = [
          ...messages.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user' as const, content: userText.trim() },
        ]
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyMessages }),
        })
      }

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
            ? { ...m, content: `⚠️ ${errorMsg}\n\nもう一度お試しください。`, isStreaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [text, file, isLoading, anonCount, messages])

  const handleSubmit = () => sendMessage(text, file)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />

      <div className="flex-1 flex flex-col h-svh md:h-screen min-w-0">
        {/* ヘッダー */}
        <header className="bg-tax-navy text-white flex-shrink-0">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[9px] text-white/40 font-mono tracking-widest leading-none">AI ADVISOR</p>
              <h1 className="text-base font-bold mt-0.5">税務AI相談室</h1>
            </div>
            <PlanBadge plan={null} remaining={remaining} />
          </div>
        </header>

        {/* モードタブ */}
        <div className="flex bg-paper-dark border-b border-tax-rule flex-shrink-0">
          {TABS.map(({ mode, emoji, label }) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors border-r last:border-r-0 border-tax-rule ${
                inputMode === mode ? 'bg-tax-orange text-white' : 'text-tax-ink/60 hover:bg-paper hover:text-tax-ink'
              }`}
            >
              <span className="text-sm">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 bg-paper-texture">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} isStreaming={msg.isStreaming} />
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center gap-2 text-tax-ink/50 text-sm pl-10 mb-4">
              <span className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="w-1.5 h-1.5 bg-tax-orange rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }} />
                ))}
              </span>
              書類を読み取っています...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* クイック質問（初回のみ） */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap bg-paper border-t border-tax-rule pt-2">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs border border-tax-orange text-tax-orange px-3 py-1.5 hover:bg-tax-orange hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 入力エリア */}
        <div className="bg-paper-light border-t-2 border-tax-orange px-4 py-3 flex-shrink-0">
          <div className="text-[10px] text-tax-ink/50 font-mono tracking-widest mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-tax-orange inline-block" />
            {inputMode === 'chat' ? '質問記入欄' : '書類添付欄'}
          </div>
          {(inputMode === 'photo' || inputMode === 'scan') && (
            <FileUploader mode={inputMode} onFileSelect={setFile} selectedFile={file} />
          )}
          {file && (
            <div className="text-xs text-tax-orange mb-2 flex items-center gap-1 bg-tax-orange-light px-2 py-1">
              <span>📎</span>
              <span className="truncate max-w-[200px]">{file.name}</span>
              <button onClick={() => setFile(null)} className="ml-auto text-tax-ink/40 hover:text-tax-ink">✕</button>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputMode === 'chat' ? '例：医療費控除はどこに記入しますか？' : '書類についての質問（省略可）'}
              rows={2}
              className="flex-1 resize-none bg-white border border-tax-rule px-3 py-2.5 text-sm text-tax-ink placeholder:text-tax-ink/30 focus:outline-none focus:border-tax-orange focus:ring-1 focus:ring-tax-orange/20"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || (!text.trim() && !file)}
              className="bg-tax-orange text-white px-4 py-3 text-sm font-bold disabled:opacity-30 hover:bg-tax-orange-dark transition-colors flex-shrink-0 tracking-wider"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : '送信'}
            </button>
          </div>
          {anonCount > 0 && anonCount < ANON_LIMIT && (
            <p className="text-[11px] text-tax-ink/40 mt-1.5 text-center font-mono">
              残り{remaining}回 · <a href="/auth" className="text-tax-orange hover:underline">ログインで5回/月まで無料</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
