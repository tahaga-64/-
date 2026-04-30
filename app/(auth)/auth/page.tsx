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
      options: { emailRedirectTo: `${location.origin}/chat` },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 申告書の表紙風ヘッダー */}
        <div className="bg-tax-navy text-white rounded-t overflow-hidden">
          <div className="h-1 bg-tax-orange" />
          <div className="px-6 py-5 text-center">
            <p className="text-[10px] text-white/50 tracking-widest font-mono mb-1">KAKUTEISHINKOKU AI</p>
            <h1 className="text-lg font-bold tracking-wide">ログイン / 新規登録</h1>
          </div>
        </div>

        {/* フォーム本体：申告書の記入欄風 */}
        <div className="bg-paper-light border border-tax-rule border-t-0 rounded-b px-6 py-6">
          <p className="text-xs text-tax-ink/60 mb-5 leading-relaxed border-b border-tax-rule pb-4">
            メールアドレスを入力するとログインリンクを送信します。
            パスワードは不要です。
          </p>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full border-2 border-tax-stamp flex items-center justify-center mx-auto mb-3">
                <span className="text-tax-stamp text-2xl">✓</span>
              </div>
              <p className="text-sm font-bold text-tax-ink mb-1">メールを送信しました</p>
              <p className="text-xs text-tax-ink/50 leading-relaxed">
                受信ボックスを確認して、<br />リンクをクリックしてください
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              {error && (
                <p className="text-xs text-tax-stamp bg-tax-stamp-light px-3 py-2 rounded border border-tax-stamp/20">
                  {error}
                </p>
              )}
              <div>
                <label className="text-[10px] text-tax-ink/50 font-mono tracking-widest block mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-tax-rule rounded px-3 py-3 text-sm text-tax-ink placeholder:text-tax-ink/30 focus:outline-none focus:border-tax-orange focus:ring-1 focus:ring-tax-orange/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tax-orange text-white rounded py-3 text-sm font-bold disabled:opacity-50 hover:bg-tax-orange-dark transition-colors tracking-wider"
              >
                {loading ? '送信中...' : 'ログインリンクを送る'}
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-tax-rule text-center">
            <a href="/" className="text-xs text-tax-ink/40 hover:text-tax-orange transition-colors">
              ← トップページに戻る
            </a>
          </div>
        </div>
        <p className="text-[10px] text-tax-ink/30 text-center mt-3">
          登録することで利用規約とプライバシーポリシーに同意したものとみなします
        </p>
      </div>
    </div>
  )
}
