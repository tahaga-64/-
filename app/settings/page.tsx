'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { createSupabaseBrowser, isSupabaseConfigured } from '@/lib/supabase'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    createSupabaseBrowser().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function handleSignOut() {
    if (isSupabaseConfigured()) await createSupabaseBrowser().auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">SETTINGS</p>
            <h1 className="text-base font-bold">設定</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-md space-y-4">
          {/* アカウント情報 */}
          <div className="border border-tax-rule bg-paper-light">
            <div className="bg-tax-navy text-white px-4 py-2.5">
              <p className="text-xs font-bold tracking-wider">アカウント</p>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div>
                <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">メールアドレス</p>
                <p className="text-sm text-tax-ink">{user?.email ?? '未ログイン'}</p>
              </div>
              <div className="border-t border-tax-rule pt-3">
                <button
                  onClick={() => router.push('/onboarding')}
                  className="text-sm text-tax-orange hover:underline"
                >
                  プロフィールを再設定する →
                </button>
              </div>
            </div>
          </div>

          {/* プランと料金 */}
          <div className="border border-tax-rule bg-paper-light">
            <div className="bg-tax-navy text-white px-4 py-2.5">
              <p className="text-xs font-bold tracking-wider">プランと料金</p>
            </div>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-tax-ink">現在のプラン</p>
                <span className="text-xs bg-paper-dark text-tax-ink/60 border border-tax-rule px-2 py-0.5">無料プラン</span>
              </div>
              <a href="/pricing"
                className="block text-center bg-tax-orange text-white py-2.5 text-sm font-bold tracking-wider hover:bg-tax-orange-dark transition-colors">
                有料プランに変更する
              </a>
            </div>
          </div>

          {/* リンク集 */}
          <div className="border border-tax-rule bg-paper-light">
            <div className="bg-tax-navy text-white px-4 py-2.5">
              <p className="text-xs font-bold tracking-wider">関連リンク</p>
            </div>
            <div className="divide-y divide-tax-rule">
              {[
                { label: '国税庁 確定申告書等作成コーナー', url: 'https://www.nta.go.jp/taxes/shiraberu/shinkoku/kakutei.htm' },
                { label: '国民年金機構', url: 'https://www.nenkin.go.jp/' },
                { label: 'e-Tax（電子申告）', url: 'https://www.e-tax.nta.go.jp/' },
              ].map(({ label, url }) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 hover:bg-paper transition-colors">
                  <span className="text-sm text-tax-ink/70">{label}</span>
                  <span className="text-tax-orange text-xs">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* サインアウト */}
          <button onClick={handleSignOut}
            className="w-full border border-tax-rule text-tax-ink/50 py-3 text-sm hover:border-tax-stamp hover:text-tax-stamp transition-colors">
            ログアウト
          </button>

          <p className="text-[10px] text-tax-ink/30 text-center font-mono">MoneyWise JP v0.2.0</p>
        </div>
      </main>
    </div>
  )
}
