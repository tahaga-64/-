import Link from 'next/link'
import Navigation from '@/components/Navigation'

const EVENTS = [
  {
    id: 'marriage',
    emoji: '💍',
    title: '結婚',
    thisYear: ['配偶者控除・配偶者特別控除の適用確認', '年末調整に配偶者情報を追加', '扶養義務者への変更手続き（健康保険・年金）'],
    nextYear: ['配偶者収入に応じた控除額の把握', 'ふるさと納税の上限額が変わる'],
  },
  {
    id: 'baby',
    emoji: '👶',
    title: '出産・育児',
    thisYear: ['扶養控除（16歳未満は対象外、でも住民税の扶養に影響）', '医療費控除（出産費用・入院費用が対象）', '出産育児一時金（50万円）は非課税'],
    nextYear: ['育児休業給付金は非課税', '保育料は医療費控除の対象外'],
  },
  {
    id: 'job_change',
    emoji: '💼',
    title: '転職・退職',
    thisYear: ['確定申告が必要（年末調整が受けられない）', '退職後の健康保険：任意継続 or 国民健康保険の比較', '失業給付は非課税（申告不要）'],
    nextYear: ['国民健康保険料は前年所得で決まる', '退職所得控除の計算（勤続年数で異なる）'],
  },
  {
    id: 'housing',
    emoji: '🏠',
    title: '住宅購入・住宅ローン',
    thisYear: ['住宅ローン控除の初年度は確定申告が必須', '控除期間：最長13年間（年末残高×0.7%）', '自宅兼事務所は按分計算に注意'],
    nextYear: ['2年目以降は年末調整で対応（会社員の場合）', '繰上げ返済するとローン残高が減り控除額も減る'],
  },
  {
    id: 'retirement',
    emoji: '🎌',
    title: '退職・年金受給開始',
    thisYear: ['退職金は分離課税（退職所得控除を差し引いた金額に課税）', '同年にiDeCoを受け取ると退職所得控除の重複不可に注意', '年金収入が400万円超 → 確定申告必須'],
    nextYear: ['公的年金等控除（65歳以上：最大110万円）を活用', '所得税は不要でも住民税申告が必要なケースあり'],
  },
  {
    id: 'nursing',
    emoji: '👵',
    title: '親の介護',
    thisYear: ['介護費・医療費を合算して医療費控除を申告可', '親が70歳以上で扶養可能 → 老人扶養控除48〜58万円', '訪問看護・デイサービス等の医療費は控除対象'],
    nextYear: ['相続・贈与の事前計画（毎年110万円の贈与は非課税）'],
  },
]

export default function LifeEventsGuidePage() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">LIFE EVENTS GUIDE</p>
            <h1 className="text-base font-bold">ライフイベント別 税金ガイド</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-2xl">
          <p className="text-xs text-tax-ink/50 mb-5 border-b border-tax-rule pb-4">
            各ライフイベントで発生する税金・年金・保険の手続きをまとめました。
          </p>

          <div className="space-y-4">
            {EVENTS.map(event => (
              <div key={event.id} className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">{event.emoji}</span>
                  <h2 className="text-sm font-bold tracking-wide">{event.title}</h2>
                </div>
                <div className="p-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-tax-orange font-mono font-bold tracking-widest mb-2">今年の確定申告でやること</p>
                    <ul className="space-y-1.5">
                      {event.thisYear.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-tax-ink/70">
                          <span className="text-tax-orange flex-shrink-0">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-2">来年以降に注意すること</p>
                    <ul className="space-y-1.5">
                      {event.nextYear.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-tax-ink/50">
                          <span className="text-tax-rule flex-shrink-0">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-4 pb-3">
                  <Link href={`/chat?event=${event.id}`}
                    className="text-xs text-tax-orange hover:underline">
                    この状況をAIに相談する →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-tax-rule bg-paper-light px-4 py-3">
            <p className="text-[10px] text-tax-ink/30 font-mono leading-relaxed">
              ※ 税制は毎年改正されます。最新情報は国税庁のウェブサイト（nta.go.jp）でご確認ください。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
