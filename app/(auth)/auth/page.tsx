'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/chat`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-[#2563EB]">確定申告AI</a>
          <p className="text-gray-500 text-sm mt-1">書類記入サポート</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-lg font-bold text-center mb-1">ログイン / 新規登録</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            メールアドレスを入力するとログインリンクを送信します
          </p>

          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm text-green-600 font-medium">メールを送信しました</p>
              <p className="text-xs text-gray-500 mt-2">
                受信ボックスを確認して、リンクをクリックしてください
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                {loading ? '送信中...' : 'ログインリンクを送る'}
              </button>
            </form>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          登録することで利用規約とプライバシーポリシーに同意したものとみなします
        </p>
      </div>
    </div>
  )
}
