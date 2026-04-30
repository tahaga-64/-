import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper font-sans">
      {/* ナビ */}
      <nav className="bg-tax-navy text-white sticky top-0 z-10">
        <div className="h-1 bg-tax-orange" />
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <div>
            <p className="text-[9px] text-white/40 font-mono tracking-widest leading-none">KAKUTEISHINKOKU</p>
            <span className="font-bold text-white tracking-wide text-base leading-tight">確定申告AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-xs text-white/60 hover:text-white transition-colors">
              料金
            </Link>
            <Link
              href="/auth"
              className="text-xs border border-white/30 text-white px-3 py-1.5 hover:border-tax-orange hover:text-tax-orange transition-colors rounded-sm"
            >
              ログイン
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー：確定申告書の表紙風 */}
      <section className="max-w-3xl mx-auto px-4 pt-12 pb-10">
        {/* 申告書番号風の装飾 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-tax-rule" />
          <span className="text-[10px] text-tax-ink/40 font-mono tracking-widest">
            令和7年分 確定申告サポート
          </span>
          <div className="h-px flex-1 bg-tax-rule" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            {/* 様式タイトル風 */}
            <div className="border-l-4 border-tax-orange pl-4 mb-6">
              <h1 className="text-3xl font-bold text-tax-ink leading-tight">
                確定申告、<br />もう迷わない。
              </h1>
            </div>
            <p className="text-tax-ink/60 text-sm leading-relaxed mb-6">
              書類を写真に撮るか、質問するだけ。<br />
              AIが専門用語ゼロで、ステップごとに案内します。
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-tax-orange text-white px-7 py-3.5 text-sm font-bold hover:bg-tax-orange-dark transition-colors tracking-wider"
            >
              無料で試す（3回）
              <span>→</span>
            </Link>
            <p className="text-[11px] text-tax-ink/40 mt-2 font-mono">登録不要・クレジットカード不要</p>
          </div>

          {/* 申告書フォーム風のイメージカード */}
          <div className="w-full md:w-52 border border-tax-rule bg-paper-light p-4 flex-shrink-0">
            <div className="border-b border-tax-rule pb-2 mb-3">
              <p className="text-[9px] text-tax-ink/40 font-mono tracking-widest">確定申告書 B</p>
              <p className="text-xs font-bold text-tax-ink mt-0.5">所得税及び</p>
              <p className="text-xs font-bold text-tax-ink">復興特別所得税の申告</p>
            </div>
            {/* ダミーフォームフィールド */}
            {['氏名', '住所', '生年月日', '電話番号'].map((label) => (
              <div key={label} className="mb-2">
                <p className="text-[9px] text-tax-ink/40 font-mono">{label}</p>
                <div className="h-5 border-b border-tax-rule mt-0.5 bg-white/60" />
              </div>
            ))}
            {/* AI サポート表示 */}
            <div className="mt-3 pt-2 border-t border-tax-rule">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-tax-stamp flex items-center justify-center">
                  <span className="text-tax-stamp text-[7px]">AI</span>
                </div>
                <p className="text-[9px] text-tax-ink/50">AIが記入方法を案内</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 区切り線 */}
      <div className="border-t border-tax-rule" />

      {/* 課題セクション */}
      <section className="bg-paper-dark px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">PROBLEM</p>
            <h2 className="text-lg font-bold text-tax-ink">こんな悩み、ありませんか？</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { no: '01', text: '書類の専門用語がわからない', icon: '📝' },
              { no: '02', text: 'どの欄に何を書くか迷う', icon: '🤔' },
              { no: '03', text: '税理士に頼むほどでもないが不安', icon: '😰' },
            ].map(({ no, text, icon }) => (
              <div key={no} className="bg-paper-light border border-tax-rule p-4">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] text-tax-orange font-mono font-bold mt-0.5">{no}</span>
                  <div>
                    <span className="text-xl block mb-1">{icon}</span>
                    <p className="text-sm text-tax-ink leading-relaxed">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-tax-rule" />

      {/* 使い方セクション */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">HOW TO USE</p>
            <h2 className="text-lg font-bold text-tax-ink">使い方は3ステップ</h2>
          </div>
          <div className="space-y-4">
            {[
              { step: 'STEP 1', icon: '📸', title: '書類を撮影 or アップロード', desc: '確定申告書、源泉徴収票、医療費領収書など何でも対応' },
              { step: 'STEP 2', icon: '✏️', title: 'AIに質問するだけ', desc: '「この欄には何を書けばいい？」「この数字はどこに入力する？」' },
              { step: 'STEP 3', icon: '✅', title: 'ステップごとに案内', desc: '専門用語ゼロで、1つずつわかりやすく教えます' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex gap-4 items-stretch border border-tax-rule bg-paper-light">
                {/* 左側：申告書の欄番号風 */}
                <div className="bg-tax-navy text-white w-14 flex-shrink-0 flex flex-col items-center justify-center py-4">
                  <span className="text-[9px] font-mono tracking-widest text-white/50 block text-center leading-none mb-1">
                    {step.split(' ')[0]}
                  </span>
                  <span className="text-lg font-bold">{step.split(' ')[1]}</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-bold text-sm text-tax-ink">{title}</p>
                    <p className="text-xs text-tax-ink/50 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-tax-rule" />

      {/* 料金ティーザー */}
      <section className="bg-paper-dark px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">PRICING</p>
            <h2 className="text-lg font-bold text-tax-ink">シンプルな料金プラン</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: '無料', price: '¥0', note: '5回/月', accent: false },
              { label: 'スタンダード', price: '¥980', note: '/月・無制限', accent: true },
              { label: 'シーズンパス', price: '¥2,980', note: '/3ヶ月', accent: false },
            ].map((p) => (
              <div
                key={p.label}
                className={`border p-3 text-center ${
                  p.accent
                    ? 'border-tax-orange bg-tax-orange-light'
                    : 'border-tax-rule bg-paper-light'
                }`}
              >
                <p className="text-[9px] text-tax-ink/50 font-mono mb-1">{p.label}</p>
                <p className={`font-bold text-sm ${p.accent ? 'text-tax-orange' : 'text-tax-ink'}`}>
                  {p.price}
                </p>
                <p className="text-[9px] text-tax-ink/40 mt-0.5">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/pricing" className="text-sm text-tax-orange hover:underline font-mono">
              詳しいプランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-tax-navy text-white px-4 py-14 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] text-white/40 font-mono tracking-widest mb-3">START FOR FREE</p>
          <h2 className="text-xl font-bold mb-2">今すぐ無料で試してみる</h2>
          <div className="w-12 h-0.5 bg-tax-orange mx-auto mb-4" />
          <p className="text-white/50 text-sm mb-7">登録不要・3回まで無料</p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-tax-orange text-white px-8 py-4 text-sm font-bold hover:bg-tax-orange-dark transition-colors tracking-wider"
          >
            はじめる →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-tax-ink text-white/40 px-4 py-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] leading-relaxed font-mono mb-4">
            【免責事項】本サービスは情報提供を目的としており、税務・法律アドバイスではありません。
            正確な申告は税理士または国税庁のウェブサイトでご確認ください。
          </p>
          <div className="flex items-center justify-center gap-5 text-[11px] mb-3">
            <Link href="/pricing" className="hover:text-tax-orange transition-colors">料金プラン</Link>
            <Link href="/auth" className="hover:text-tax-orange transition-colors">ログイン</Link>
            <Link href="/chat" className="hover:text-tax-orange transition-colors">チャット</Link>
          </div>
          <p className="text-[10px] text-white/20 font-mono">© 2025 確定申告AI</p>
        </div>
      </footer>
    </div>
  )
}
