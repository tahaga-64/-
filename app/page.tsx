import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-4 border-b bg-white sticky top-0 z-10">
        <span className="font-bold text-[#2563EB] text-lg">確定申告AI</span>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#2563EB] transition-colors">
            料金
          </Link>
          <Link
            href="/auth"
            className="text-sm bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログイン
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center max-w-lg mx-auto">
        <span className="inline-block bg-blue-50 text-[#2563EB] text-xs font-medium px-3 py-1 rounded-full mb-5">
          確定申告 2025年版 対応
        </span>
        <h1 className="text-3xl font-bold mb-4 leading-tight text-gray-900">
          確定申告、<br />もう迷わない。
        </h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          書類を写真に撮るか、質問するだけ。<br />
          AIがやさしく、ステップごとに案内します。
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-2xl text-base font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors"
        >
          無料で試す（3回）
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="text-xs text-gray-400 mt-3">クレジットカード不要・登録不要</p>
      </section>

      {/* Pain points */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">こんな悩み、ありませんか？</h2>
          <div className="space-y-3">
            {[
              { emoji: '😰', text: '書類の専門用語がわからない' },
              { emoji: '🤔', text: 'どの欄に何を書くか迷う' },
              { emoji: '😓', text: '税理士に頼むほどでもないけど不安' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-center">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">使い方は3ステップ</h2>
          <div className="space-y-6">
            {[
              {
                emoji: '📸',
                step: '1',
                title: '書類を撮影 or アップロード',
                desc: '確定申告書、源泉徴収票、医療費領収書など何でもOK',
              },
              {
                emoji: '💬',
                step: '2',
                title: 'AIに質問するだけ',
                desc: '「この欄には何を書けばいい？」と話しかけてみてください',
              },
              {
                emoji: '✅',
                step: '3',
                title: 'ステップごとに案内',
                desc: 'わかりやすい言葉で、1つずつ丁寧に教えます',
              },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  {emoji}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-bold mb-6">シンプルな料金プラン</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: '無料', price: '¥0', note: '5回/月' },
              { label: 'スタンダード', price: '¥980', note: '/月・無制限' },
              { label: 'シーズンパス', price: '¥2,980', note: '/3ヶ月・無制限' },
            ].map((p) => (
              <div key={p.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{p.label}</p>
                <p className="font-bold text-sm">{p.price}</p>
                <p className="text-xs text-gray-400">{p.note}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="text-sm text-[#2563EB] hover:underline">
            詳しいプランを見る →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2563EB] px-4 py-14 text-center">
        <h2 className="text-xl font-bold text-white mb-2">今すぐ無料で試してみる</h2>
        <p className="text-blue-200 text-sm mb-6">登録不要・3回まで無料</p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 bg-white text-[#2563EB] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-blue-50 transition-colors"
        >
          はじめる
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center bg-white border-t">
        <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto mb-4">
          ⚠️ 本サービスは情報提供を目的としており、税務・法律アドバイスを提供するものではありません。
          正確な申告については、税理士または国税庁のウェブサイトでご確認ください。
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <Link href="/pricing" className="hover:text-[#2563EB]">料金プラン</Link>
          <Link href="/auth" className="hover:text-[#2563EB]">ログイン</Link>
          <Link href="/chat" className="hover:text-[#2563EB]">チャット</Link>
        </div>
        <p className="text-xs text-gray-300 mt-4">© 2025 確定申告AI</p>
      </footer>
    </div>
  )
}
