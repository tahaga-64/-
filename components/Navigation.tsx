'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'ホーム', emoji: '🏠' },
  { href: '/chat', label: 'AI相談', emoji: '💬' },
  { href: '/simulator/tax', label: '損得計算', emoji: '🧮' },
  { href: '/checker', label: '申告判定', emoji: '✅' },
  { href: '/guide/side-job', label: '副業', emoji: '💼' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* デスクトップ：サイドバー */}
      <aside className="hidden md:flex flex-col w-52 bg-tax-navy text-white min-h-screen flex-shrink-0">
        <div className="h-1 bg-tax-orange" />
        <div className="px-4 py-5 border-b border-white/10">
          <p className="text-[9px] text-white/40 font-mono tracking-widest">MONEYWISE JP</p>
          <span className="font-bold text-white text-base tracking-wide">MoneyWise JP</span>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(({ href, label, emoji }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-tax-orange text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{emoji}</span>
              {label}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-3 pt-3">
            {[
              { href: '/guide/life-events', label: 'ライフイベント', emoji: '📅' },
              { href: '/checker/deductions', label: '控除チェック', emoji: '🔍' },
              { href: '/settings', label: '設定', emoji: '⚙️' },
            ].map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  pathname === href
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <Link href="/pricing" className="text-xs text-tax-orange hover:underline block mb-1">
            プランをアップグレード
          </Link>
          <p className="text-[10px] text-white/20 font-mono">© 2025 MoneyWise JP</p>
        </div>
      </aside>

      {/* モバイル：ボトムナビ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-tax-navy border-t-2 border-tax-orange z-50 flex">
        {NAV_ITEMS.map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] transition-colors ${
              pathname.startsWith(href) ? 'text-tax-orange' : 'text-white/50'
            }`}
          >
            <span className="text-xl leading-tight">{emoji}</span>
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
