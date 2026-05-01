'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

type DeductionItem = {
  id: string
  name: string
  condition: string
  potentialSaving: string
  applicable: boolean
  link?: string
}

const DEDUCTION_QUESTIONS = [
  { id: 'hasSpouse', label: '配偶者がいる（年収201万円以下）', key: 'hasSpouse' },
  { id: 'hasChildren16', label: '16歳以上の扶養家族がいる（子・親族）', key: 'hasChildren16' },
  { id: 'hasChildren19', label: '19〜22歳の扶養家族がいる（特定扶養）', key: 'hasChildren19' },
  { id: 'medicalOver10', label: '医療費（自費）が年間10万円を超えた', key: 'medicalOver10' },
  { id: 'hasIdeco', label: 'iDeCoに加入している', key: 'hasIdeco' },
  { id: 'hasFurusato', label: 'ふるさと納税をした', key: 'hasFurusato' },
  { id: 'hasMortgage', label: '住宅ローンがある（控除初年度は確定申告必須）', key: 'hasMortgage' },
  { id: 'hasInsurance', label: '生命保険・地震保険・個人年金に加入している', key: 'hasInsurance' },
  { id: 'hasDisability', label: '自分・家族に障害者手帳がある', key: 'hasDisability' },
  { id: 'hasDonation', label: '認定NPO等への寄附をした', key: 'hasDonation' },
  { id: 'isStudent', label: '勤労学生（アルバイト等）', key: 'isStudent' },
  { id: 'hasParents', label: '70歳以上の親を扶養している', key: 'hasParents' },
]

type Answers = Record<string, boolean>

function buildDeductions(answers: Answers, income: number): DeductionItem[] {
  const taxRate = income >= 6_950_000 ? 0.23 : income >= 3_300_000 ? 0.2 : income >= 1_950_000 ? 0.1 : 0.05
  const saving = (deduction: number) => `約${Math.floor(deduction * (taxRate + 0.1) / 1000).toLocaleString()}千円`

  return [
    {
      id: 'spouse',
      name: '配偶者控除・配偶者特別控除',
      condition: '配偶者の年収が123万円以下',
      potentialSaving: saving(380_000),
      applicable: !!answers.hasSpouse,
    },
    {
      id: 'dependent',
      name: '扶養控除（一般）',
      condition: '16歳以上の扶養家族1人につき38万円',
      potentialSaving: saving(380_000),
      applicable: !!answers.hasChildren16,
    },
    {
      id: 'special_dependent',
      name: '特定扶養控除',
      condition: '19〜22歳の扶養家族1人につき63万円（一般より25万円有利）',
      potentialSaving: saving(630_000),
      applicable: !!answers.hasChildren19,
    },
    {
      id: 'medical',
      name: '医療費控除',
      condition: '年間医療費が10万円（所得の5%）を超えた額',
      potentialSaving: '超過額によって変動',
      applicable: !!answers.medicalOver10,
    },
    {
      id: 'ideco',
      name: 'iDeCo（個人型確定拠出年金）',
      condition: '掛金全額が所得控除（会社員：最大年27.6万円）',
      potentialSaving: saving(276_000),
      applicable: !!answers.hasIdeco,
    },
    {
      id: 'furusato',
      name: 'ふるさと納税控除',
      condition: '寄附額 − 2,000円が控除（確定申告またはワンストップ）',
      potentialSaving: '寄附額に応じて変動',
      applicable: !!answers.hasFurusato,
    },
    {
      id: 'mortgage',
      name: '住宅ローン控除',
      condition: '年末ローン残高の0.7%が税額控除（最大13年間）',
      potentialSaving: '残高×0.7%（直接税額が減額）',
      applicable: !!answers.hasMortgage,
    },
    {
      id: 'insurance',
      name: '生命保険料控除',
      condition: '生命・介護・個人年金保険料（各最大4万円）',
      potentialSaving: saving(120_000),
      applicable: !!answers.hasInsurance,
    },
    {
      id: 'disability',
      name: '障害者控除',
      condition: '本人または扶養親族に障害がある場合27〜75万円',
      potentialSaving: saving(270_000),
      applicable: !!answers.hasDisability,
    },
    {
      id: 'donation',
      name: '寄附金控除',
      condition: '認定NPOや特定公益増進法人への寄附',
      potentialSaving: '寄附額×（所得税率＋住民税率）',
      applicable: !!answers.hasDonation,
    },
    {
      id: 'student',
      name: '勤労学生控除',
      condition: '学生で合計所得が75万円以下の場合27万円',
      potentialSaving: saving(270_000),
      applicable: !!answers.isStudent,
    },
    {
      id: 'parent',
      name: '老人扶養控除',
      condition: '70歳以上の親を扶養（同居外48万円、同居58万円）',
      potentialSaving: saving(480_000),
      applicable: !!answers.hasParents,
    },
  ]
}

export default function DeductionsCheckerPage() {
  const [phase, setPhase] = useState<'input' | 'result'>('input')
  const [answers, setAnswers] = useState<Answers>({})
  const [income, setIncome] = useState(5_000_000)

  const toggle = (key: string) => setAnswers(a => ({ ...a, [key]: !a[key] }))

  const deductions = buildDeductions(answers, income)
  const applicable = deductions.filter(d => d.applicable)
  const missed = deductions.filter(d => !d.applicable)

  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">DEDUCTION CHECKER</p>
            <h1 className="text-base font-bold">見落とし控除チェッカー</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-xl">
          {phase === 'input' ? (
            <div className="space-y-4">
              <div className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-4 py-2.5">
                  <p className="text-xs font-bold tracking-wider">年収（目安）</p>
                </div>
                <div className="p-4">
                  <input type="number" value={income} step={100_000}
                    onChange={e => setIncome(+e.target.value)}
                    className="w-full bg-white border border-tax-rule px-3 py-2 text-sm text-right font-mono focus:outline-none focus:border-tax-orange"
                  />
                  <p className="text-[10px] text-tax-ink/40 mt-1">節税効果の計算に使用します</p>
                </div>
              </div>

              <div className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-4 py-2.5">
                  <p className="text-xs font-bold tracking-wider">当てはまるものを全てチェック</p>
                </div>
                <div className="divide-y divide-tax-rule">
                  {DEDUCTION_QUESTIONS.map(q => (
                    <label key={q.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-paper">
                      <input type="checkbox" checked={!!answers[q.key]} onChange={() => toggle(q.key)}
                        className="w-4 h-4 accent-tax-orange flex-shrink-0"
                      />
                      <span className="text-sm text-tax-ink">{q.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setPhase('result')}
                className="w-full bg-tax-orange text-white py-4 text-sm font-bold tracking-wider hover:bg-tax-orange-dark transition-colors">
                使える控除をチェックする →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applicable.length > 0 && (
                <div className="border border-tax-rule bg-paper-light">
                  <div className="bg-tax-orange text-white px-4 py-2.5">
                    <p className="text-xs font-bold">✅ 使える控除（{applicable.length}件）</p>
                  </div>
                  <div className="divide-y divide-tax-rule">
                    {applicable.map(d => (
                      <div key={d.id} className="px-4 py-3">
                        <p className="text-sm font-bold text-tax-ink">{d.name}</p>
                        <p className="text-xs text-tax-ink/50 mt-0.5">{d.condition}</p>
                        <p className="text-xs text-tax-orange font-bold mt-1">節税効果：{d.potentialSaving}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {missed.length > 0 && (
                <div className="border border-tax-rule bg-paper-light">
                  <div className="bg-tax-navy text-white px-4 py-2.5">
                    <p className="text-xs font-bold">💡 チェックしていない控除（条件次第で使える可能性）</p>
                  </div>
                  <div className="divide-y divide-tax-rule">
                    {missed.slice(0, 5).map(d => (
                      <div key={d.id} className="px-4 py-3 opacity-60">
                        <p className="text-sm text-tax-ink">{d.name}</p>
                        <p className="text-xs text-tax-ink/50 mt-0.5">{d.condition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/chat"
                className="block text-center bg-tax-navy text-white py-3 text-sm font-bold tracking-wider hover:bg-tax-navy-light transition-colors">
                AIに詳しく相談する →
              </Link>
              <button onClick={() => setPhase('input')}
                className="text-xs text-tax-ink/40 hover:text-tax-orange transition-colors">
                ← もう一度チェックする
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
