import Link from 'next/link'
import Navigation from '@/components/Navigation'

const SECTIONS = [
  {
    title: '20万円ルールの正しい理解',
    icon: '📝',
    urgent: true,
    content: [
      {
        q: '「副業収入20万円以下なら申告不要」は本当？',
        a: `✅ 所得税は20万円以下なら確定申告不要（会社員の場合）
⚠️ でも住民税は1円でも申告義務があります！

これが最大の落とし穴です。副業収入が少額でも、住民税の申告（市区町村に直接提出）を怠ると追徴課税のリスクがあります。`,
      },
      {
        q: '「20万円」は収入ではなく「所得（利益）」',
        a: `例：副業でフリマアプリ売上100万円、仕入30万円、経費20万円の場合
→ 所得 = 100万円 − 30万円 − 20万円 = 50万円（確定申告必要）

「収入」ではなく「利益（売上−経費）」で判定します。`,
      },
    ],
  },
  {
    title: '副業が会社にバレる仕組みと対策',
    icon: '🔍',
    urgent: false,
    content: [
      {
        q: 'なぜ副業がバレるのか',
        a: `住民税が原因！

会社員は毎月の給与から住民税が天引き（特別徴収）されます。
副業収入が反映されると住民税が増え、会社の経理担当者に「なぜ税額が増えたのか」とバレます。`,
      },
      {
        q: '確実な対策：住民税を「普通徴収」に切り替える',
        a: `確定申告書の「住民税・事業税に関する事項」欄で
「自分で納付（普通徴収）」を選択する。

これにより、副業分の住民税は自宅に納付書が届き、
会社の給与には反映されません。

⚠️ この設定をしないと自動的に特別徴収（給与天引き）になります`,
      },
    ],
  },
  {
    title: '職業別チェックリスト',
    icon: '✅',
    urgent: false,
    content: [
      {
        q: '会社員で副業（ライター・ITエンジニア等）',
        a: `☑ 副業所得が20万円超 → 確定申告必要（所得税）
☑ 副業収入が1円でも → 住民税申告が必要
☑ 確定申告書で「普通徴収」を選択
☑ 経費（PC・通信費・書籍等）を漏れなく計上
☑ 開業届・青色申告も検討（65万円の特別控除）`,
      },
      {
        q: '会社員でフリマ・ネット販売',
        a: `☑ 「営利目的・継続的な販売」は事業所得として申告
☑ 趣味の不要品処分は原則非課税
☑ 仕入コスト・梱包材・送料は経費計上可
☑ プラットフォーム手数料も経費OK`,
      },
    ],
  },
]

export default function SideJobGuidePage() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">SIDE JOB GUIDE</p>
            <h1 className="text-base font-bold">副業バレ防止ガイド</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-2xl space-y-5">
          {/* 重要アラート */}
          <div className="border-2 border-tax-stamp bg-tax-stamp-light px-4 py-3 flex gap-3">
            <span className="text-tax-stamp text-xl flex-shrink-0">🚨</span>
            <div>
              <p className="text-sm font-bold text-tax-stamp">最重要：住民税の落とし穴</p>
              <p className="text-xs text-tax-ink/70 mt-1 leading-relaxed">
                副業収入が20万円以下でも住民税の申告は必要。
                確定申告で「普通徴収」を選ばないと給与に上乗せされ会社にバレます。
              </p>
            </div>
          </div>

          {SECTIONS.map(section => (
            <div key={section.title} className="border border-tax-rule bg-paper-light">
              <div className={`px-4 py-3 flex items-center gap-2 ${section.urgent ? 'bg-tax-stamp text-white' : 'bg-tax-navy text-white'}`}>
                <span>{section.icon}</span>
                <h2 className="text-sm font-bold tracking-wide">{section.title}</h2>
              </div>
              <div className="divide-y divide-tax-rule">
                {section.content.map(item => (
                  <div key={item.q} className="px-5 py-4">
                    <p className="text-sm font-bold text-tax-ink mb-2">{item.q}</p>
                    <p className="text-sm text-tax-ink/70 leading-relaxed whitespace-pre-wrap">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Link href="/chat"
            className="block text-center bg-tax-orange text-white py-4 text-sm font-bold tracking-wider hover:bg-tax-orange-dark transition-colors">
            AIに自分の状況を相談する →
          </Link>

          <div className="border border-tax-rule bg-paper-light px-4 py-3">
            <p className="text-[10px] text-tax-ink/30 font-mono leading-relaxed">
              ※ 本ガイドは情報提供目的です。個別の税務判断は税理士または税務署にご相談ください。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
