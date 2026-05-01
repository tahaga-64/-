'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

type Step = {
  id: string
  question: string
  yes: string | 'NEED' | 'SKIP'
  no: string | 'NONEED'
  yesLabel?: string
  noLabel?: string
}

const FLOW: Step[] = [
  {
    id: 'q1',
    question: '給与収入は2,000万円を超えていますか？',
    yes: 'NEED',
    no: 'q2',
    yesLabel: 'はい（2,000万円超）',
    noLabel: 'いいえ',
  },
  {
    id: 'q2',
    question: '給与以外の収入（副業・不動産・投資等）はありますか？',
    yes: 'q3',
    no: 'q4',
  },
  {
    id: 'q3',
    question: '給与以外の所得合計が20万円を超えていますか？',
    yes: 'NEED',
    no: 'q3b',
    yesLabel: '20万円超',
    noLabel: '20万円以下',
  },
  {
    id: 'q3b',
    question: '※重要：副業収入が20万円以下でも住民税の申告は必要です。\n給与以外の収入は1円でも住民税の申告義務があります。',
    yes: 'q4',
    no: 'q4',
    yesLabel: '理解した',
    noLabel: '理解した',
  },
  {
    id: 'q4',
    question: '医療費・ふるさと納税・住宅ローン控除など、年末調整で処理されていない控除はありますか？',
    yes: 'NEED',
    no: 'q5',
    yesLabel: 'ある',
    noLabel: 'ない',
  },
  {
    id: 'q5',
    question: '年金収入は400万円を超えていますか？（公的年金等に係る雑所得のみの場合）',
    yes: 'NEED',
    no: 'q6',
    yesLabel: '400万円超',
    noLabel: '400万円以下',
  },
  {
    id: 'q6',
    question: '複数の会社から給与を受け取っていますか？',
    yes: 'NEED',
    no: 'NONEED',
  },
]

type Result = 'NEED' | 'NONEED' | null

export default function CheckerPage() {
  const [currentId, setCurrentId] = useState('q1')
  const [result, setResult] = useState<Result>(null)
  const [history, setHistory] = useState<string[]>([])

  const current = FLOW.find(s => s.id === currentId)

  function answer(next: string) {
    setHistory(prev => [...prev, currentId])
    if (next === 'NEED') { setResult('NEED'); return }
    if (next === 'NONEED') { setResult('NONEED'); return }
    setCurrentId(next)
  }

  function reset() {
    setCurrentId('q1')
    setResult(null)
    setHistory([])
  }

  const progress = result
    ? 100
    : Math.round((FLOW.findIndex(s => s.id === currentId) / FLOW.length) * 100)

  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">TAX FILING CHECKER</p>
            <h1 className="text-base font-bold">確定申告 要否判定</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-xl">
          {/* プログレス */}
          <div className="mb-6">
            <div className="flex justify-between text-[10px] text-tax-ink/40 font-mono mb-1">
              <span>質問に答えるだけで即判定</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-paper-dark">
              <div className="h-full bg-tax-orange transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {!result ? (
            current && (
              <div>
                <div className="border border-tax-rule bg-paper-light mb-4">
                  <div className="bg-tax-navy text-white px-4 py-2.5">
                    <p className="text-[10px] font-mono tracking-widest">質問 {history.length + 1}</p>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-sm text-tax-ink leading-relaxed whitespace-pre-wrap font-medium">{current.question}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => answer(current.yes)}
                    className="bg-tax-orange text-white py-4 text-sm font-bold tracking-wider hover:bg-tax-orange-dark transition-colors">
                    {current.yesLabel ?? 'はい'}
                  </button>
                  <button onClick={() => answer(current.no)}
                    className="bg-paper-light border border-tax-rule text-tax-ink py-4 text-sm font-medium hover:border-tax-orange transition-colors">
                    {current.noLabel ?? 'いいえ'}
                  </button>
                </div>
                {history.length > 0 && (
                  <button onClick={() => { setCurrentId(history[history.length - 1]); setHistory(h => h.slice(0, -1)) }}
                    className="mt-3 text-xs text-tax-ink/40 hover:text-tax-orange transition-colors">
                    ← 前の質問に戻る
                  </button>
                )}
              </div>
            )
          ) : (
            <div>
              {result === 'NEED' ? (
                <div className="border-2 border-tax-stamp bg-tax-stamp-light">
                  <div className="bg-tax-stamp text-white px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-bold tracking-wider">確定申告が必要です</p>
                      <p className="text-xs text-white/80 mt-0.5">申告期間：2/16〜3/15</p>
                    </div>
                  </div>
                  <div className="px-5 py-5 space-y-3">
                    <p className="text-sm text-tax-ink leading-relaxed">
                      回答内容から、あなたは<strong>確定申告の義務がある</strong>と判定されました。
                    </p>
                    <div className="border-t border-tax-rule pt-3">
                      <p className="text-xs font-bold text-tax-ink mb-2">次にやること：</p>
                      <ul className="space-y-1.5 text-xs text-tax-ink/70">
                        <li>① 源泉徴収票・各種証明書を準備する</li>
                        <li>② 国税庁の確定申告書等作成コーナーを利用する</li>
                        <li>③ e-Tax または郵送で提出する（3/15まで）</li>
                      </ul>
                    </div>
                    <Link href="/chat"
                      className="block text-center bg-tax-navy text-white py-3 text-sm font-bold tracking-wider hover:bg-tax-navy-light transition-colors mt-4">
                      AIに申告手順を相談する →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-tax-navy bg-paper-light">
                  <div className="bg-tax-navy text-white px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold tracking-wider">確定申告は不要です</p>
                      <p className="text-xs text-white/80 mt-0.5">※住民税申告が別途必要な場合あり</p>
                    </div>
                  </div>
                  <div className="px-5 py-5 space-y-3">
                    <p className="text-sm text-tax-ink leading-relaxed">
                      所得税の確定申告は不要です。ただし、<strong className="text-tax-stamp">副業収入がある場合は住民税の申告が必要</strong>な場合があります。
                    </p>
                    <div className="border border-tax-orange bg-tax-orange-light px-4 py-3">
                      <p className="text-xs font-bold text-tax-orange mb-1">⚠️ 住民税申告について</p>
                      <p className="text-xs text-tax-ink/70">
                        副業収入が1円でもある場合、所得税の申告が不要でも住民税の申告（市区町村に提出）が必要です。
                        申告しないと追徴課税のリスクがあります。
                      </p>
                    </div>
                    <Link href="/chat"
                      className="block text-center border border-tax-navy text-tax-navy py-3 text-sm font-medium hover:bg-tax-navy hover:text-white transition-colors mt-2">
                      詳しくAIに聞く →
                    </Link>
                  </div>
                </div>
              )}
              <button onClick={reset} className="mt-4 text-xs text-tax-ink/40 hover:text-tax-orange transition-colors">
                ← もう一度診断する
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
