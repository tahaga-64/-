import Link from 'next/link'

const FEATURES = [
  { emoji: '🧮', title: '損得シミュレーター', desc: '所得税・住民税・手取り額をリアルタイム計算。翌年の国保料も同時表示。', href: '/simulator/tax' },
  { emoji: '✅', title: '申告要否判定', desc: '3問に答えるだけで確定申告が必要か即判定。住民税の落とし穴も警告。', href: '/checker' },
  { emoji: '💬', title: 'AI税務相談', desc: 'Gemini × Claude の二重AIで、「なぜそうなるか」まで丁寧に回答。', href: '/chat' },
  { emoji: '🔍', title: '控除チェッカー', desc: '使えるのに申告していない控除を自動発見。金額まで提示。', href: '/checker/deductions' },
  { emoji: '💼', title: '副業バレ防止', desc: '20万円ルールの正しい理解と住民税「普通徴収」の設定手順を解説。', href: '/guide/side-job' },
  { emoji: '📅', title: 'ライフイベント別ガイド', desc: '結婚・転職・退職・介護など、状況別の税金手続きを一覧。', href: '/guide/life-events' },
]

const AGE_ISSUES = [
  { age: '20代', issues: ['副業が会社にバレる恐怖', '20万円ルールの誤解', '国民年金免除を知らず未納'] },
  { age: '30代', issues: ['複数収入源の整理が煩雑', 'ふるさと納税の併用ミス', '配偶者控除の上限変更に追いつけない'] },
  { age: '40代', issues: ['住宅ローン控除×経費の矛盾', 'iDeCoの出口戦略がわからない', '法人化の損益分岐点が不明'] },
  { age: '50代', issues: ['退職金とiDeCoの同年受取で税負担激増', '親の介護費を控除合算できるか不明', '相続・贈与の事前準備が不明'] },
  { age: '60代+', issues: ['申告が必要か不要かの判断が困難', '住民税申告を知らずに追徴課税', '加給年金・給付金の未申請'] },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper font-sans">
      {/* ナビ */}
      <nav className="bg-tax-navy text-white sticky top-0 z-10">
        <div className="h-1 bg-tax-orange" />
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div>
            <p className="text-[9px] text-white/40 font-mono tracking-widest leading-none">MONEYWISE JP</p>
            <span className="font-bold text-white tracking-wide text-base leading-tight">MoneyWise JP</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-xs text-white/60 hover:text-white">料金</Link>
            <Link href="/dashboard" className="text-xs text-white/60 hover:text-white">ダッシュボード</Link>
            <Link href="/auth" className="text-xs border border-white/30 text-white px-3 py-1.5 hover:border-tax-orange hover:text-tax-orange transition-colors">
              ログイン
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-tax-rule" />
          <span className="text-[10px] text-tax-ink/40 font-mono tracking-widest">2025年度 税制改正対応済み</span>
          <div className="h-px flex-1 bg-tax-rule" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="border-l-4 border-tax-orange pl-4 mb-6">
              <h1 className="text-3xl font-bold text-tax-ink leading-tight">
                税金・年金・保険、<br />全部まとめて解決。
              </h1>
            </div>
            <p className="text-tax-ink/60 text-sm leading-relaxed mb-2">
              日本の社会人が抱える税金・年金・社会保険のあらゆる疑問を<br />
              AIシミュレーター＋専門ガイドで徹底サポート。
            </p>
            <p className="text-xs text-tax-stamp font-bold mb-6">
              ⚡ freee・マネフォにない「損得シミュレーター」搭載
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/simulator/tax"
                className="inline-flex items-center gap-2 bg-tax-orange text-white px-7 py-3.5 text-sm font-bold hover:bg-tax-orange-dark transition-colors tracking-wider shadow-lg shadow-tax-orange/20">
                損得を今すぐ計算 →
              </Link>
              <Link href="/chat"
                className="inline-flex items-center gap-2 border border-tax-navy text-tax-navy px-6 py-3.5 text-sm font-medium hover:bg-tax-navy hover:text-white transition-colors">
                AIに相談する
              </Link>
            </div>
            <p className="text-[11px] text-tax-ink/40 mt-2 font-mono">登録不要・3回まで無料</p>
          </div>

          {/* 申告書風カード */}
          <div className="w-full md:w-56 border border-tax-rule bg-paper-light flex-shrink-0">
            <div className="bg-tax-navy text-white px-3 py-2.5">
              <p className="text-[9px] font-mono tracking-widest text-white/50">QUICK CALC</p>
              <p className="text-xs font-bold">損得シミュレーター</p>
            </div>
            {[
              { label: '年収', value: '600万円' },
              { label: '所得税', value: '約32万円' },
              { label: '住民税', value: '約37万円' },
              { label: '手取り', value: '約469万円' },
              { label: '翌年国保', value: '約47万円/年' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-3 py-2 border-b border-tax-rule last:border-b-0">
                <p className="text-[10px] text-tax-ink/50 font-mono">{label}</p>
                <p className="text-xs font-bold text-tax-ink font-mono">{value}</p>
              </div>
            ))}
            <div className="px-3 py-2.5 bg-tax-orange-light">
              <p className="text-[10px] text-tax-orange font-bold">iDeCo追加で+2.8万円節税</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-tax-rule" />

      {/* 年齢別課題 */}
      <section className="bg-paper-dark px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">AGE-SPECIFIC ISSUES</p>
            <h2 className="text-lg font-bold text-tax-ink">年齢層別の「よくある落とし穴」</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {AGE_ISSUES.map(({ age, issues }) => (
              <div key={age} className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-3 py-2 text-center">
                  <p className="text-xs font-bold">{age}</p>
                </div>
                <ul className="px-3 py-3 space-y-1.5">
                  {issues.map(issue => (
                    <li key={issue} className="text-[11px] text-tax-ink/60 flex gap-1">
                      <span className="text-tax-stamp flex-shrink-0">▸</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-tax-rule" />

      {/* 機能一覧 */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">FEATURES</p>
            <h2 className="text-lg font-bold text-tax-ink">6つの解決機能</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {FEATURES.map(({ emoji, title, desc, href }) => (
              <Link key={href} href={href}
                className="border border-tax-rule bg-paper-light px-4 py-4 hover:border-tax-orange hover:bg-tax-orange-light transition-colors group flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div>
                  <p className="font-bold text-sm text-tax-ink group-hover:text-tax-orange transition-colors">{title}</p>
                  <p className="text-xs text-tax-ink/50 mt-1 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-tax-navy text-white px-4 py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] text-white/40 font-mono tracking-widest mb-3">GET STARTED</p>
          <h2 className="text-xl font-bold mb-2">今すぐ無料で試してみる</h2>
          <div className="w-12 h-0.5 bg-tax-orange mx-auto mb-4" />
          <p className="text-white/50 text-sm mb-7">登録不要・3回まで無料 / 有料プランで無制限</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/simulator/tax"
              className="inline-flex items-center gap-2 bg-tax-orange text-white px-7 py-4 text-sm font-bold hover:bg-tax-orange-dark transition-colors tracking-wider">
              損得計算を始める →
            </Link>
            <Link href="/chat"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-4 text-sm hover:border-white transition-colors">
              AIに相談する
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-tax-ink text-white/40 px-4 py-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] leading-relaxed font-mono mb-4">
            【免責事項】本サービスは情報提供を目的としており、税務・法律・ファイナンシャルアドバイスではありません。
            正確な申告・年金・保険については、税理士・社会保険労務士または各官公庁のウェブサイトでご確認ください。
          </p>
          <div className="flex items-center justify-center gap-5 text-[11px] mb-3">
            <Link href="/dashboard" className="hover:text-tax-orange">ダッシュボード</Link>
            <Link href="/simulator/tax" className="hover:text-tax-orange">シミュレーター</Link>
            <Link href="/checker" className="hover:text-tax-orange">申告判定</Link>
            <Link href="/pricing" className="hover:text-tax-orange">料金</Link>
          </div>
          <p className="text-[10px] text-white/20 font-mono">© 2025 MoneyWise JP</p>
        </div>
      </footer>
    </div>
  )
}
