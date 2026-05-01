import Link from 'next/link'
import Navigation from '@/components/Navigation'

const FEATURES = [
  {
    href: '/chat',
    emoji: '💬',
    title: 'AI税務相談',
    desc: '確定申告・税金・年金の疑問をAIが回答',
    accent: true,
  },
  {
    href: '/simulator/tax',
    emoji: '🧮',
    title: '損得シミュレーター',
    desc: '所得税・住民税・手取り額をリアルタイム計算',
    accent: false,
  },
  {
    href: '/checker',
    emoji: '✅',
    title: '申告要否判定',
    desc: '確定申告が必要か3問で即判定',
    accent: false,
  },
  {
    href: '/checker/deductions',
    emoji: '🔍',
    title: '見落とし控除チェッカー',
    desc: '使えるのに使っていない控除を自動発見',
    accent: false,
  },
  {
    href: '/guide/side-job',
    emoji: '💼',
    title: '副業バレ防止ガイド',
    desc: '住民税・20万円ルールを正しく理解',
    accent: false,
  },
  {
    href: '/guide/life-events',
    emoji: '📅',
    title: 'ライフイベント別ガイド',
    desc: '結婚・転職・退職時の手続きを一覧表示',
    accent: false,
  },
]

const TAX_DEADLINES = [
  { date: '2/16〜3/15', label: '確定申告期間', urgent: true },
  { date: '3/15', label: '振替納税口座振替日', urgent: false },
  { date: '6月', label: '住民税の納付書が届く', urgent: false },
  { date: '12/31', label: 'ふるさと納税の締め切り', urgent: false },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {/* ヘッダー */}
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">DASHBOARD</p>
            <h1 className="text-base font-bold">マイダッシュボード</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-2xl">
          {/* お知らせバナー */}
          <div className="bg-tax-orange-light border border-tax-orange/30 px-4 py-3 mb-6 flex items-start gap-3">
            <span className="text-tax-orange text-lg flex-shrink-0">📢</span>
            <div>
              <p className="text-xs font-bold text-tax-orange">2025年度 税制改正対応済み</p>
              <p className="text-xs text-tax-ink/60 mt-0.5">基礎控除58万円・配偶者控除上限123万円に更新しました</p>
            </div>
          </div>

          {/* メイン機能グリッド */}
          <div className="mb-1">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-3">【主要機能】</p>
          </div>
          <div className="grid gap-3 mb-8">
            {FEATURES.map(({ href, emoji, title, desc, accent }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-4 border transition-colors group ${
                  accent
                    ? 'border-tax-orange bg-tax-orange text-white hover:bg-tax-orange-dark'
                    : 'border-tax-rule bg-paper-light hover:border-tax-orange hover:bg-tax-orange-light'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${accent ? 'text-white' : 'text-tax-ink'}`}>{title}</p>
                  <p className={`text-xs mt-0.5 ${accent ? 'text-white/80' : 'text-tax-ink/50'}`}>{desc}</p>
                </div>
                <span className={`text-sm flex-shrink-0 ${accent ? 'text-white/60' : 'text-tax-orange'}`}>→</span>
              </Link>
            ))}
          </div>

          {/* 税務カレンダー */}
          <div className="border border-tax-rule bg-paper-light">
            <div className="bg-tax-navy text-white px-4 py-2.5 flex items-center gap-2">
              <span>📅</span>
              <p className="text-xs font-bold tracking-wider">税務カレンダー（主要期限）</p>
            </div>
            <div className="divide-y divide-tax-rule">
              {TAX_DEADLINES.map(({ date, label, urgent }) => (
                <div key={date} className="flex items-center gap-4 px-4 py-3">
                  <span className={`text-xs font-mono font-bold w-20 flex-shrink-0 ${urgent ? 'text-tax-stamp' : 'text-tax-orange'}`}>
                    {date}
                  </span>
                  <span className="text-sm text-tax-ink/70">{label}</span>
                  {urgent && <span className="ml-auto text-[10px] text-tax-stamp border border-tax-stamp px-1.5">重要</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border border-tax-rule bg-paper-light px-4 py-3">
            <p className="text-[10px] text-tax-ink/40 font-mono leading-relaxed">
              ※ 本サービスは情報提供を目的としており、税務・法律アドバイスではありません。
              正確な申告は税理士または国税庁のサイトでご確認ください。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
