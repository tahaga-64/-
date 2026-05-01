'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import { calcFullTax, type TaxSimInput, type TaxSimResult } from '@/lib/tax'

const DEFAULT_INPUT: TaxSimInput = {
  salary: 5_000_000,
  sideIncome: 0,
  hasSpouse: false,
  spouseIncome: 0,
  dependentChildren: 0,
  iDecoMonthly: 0,
  furusato: 0,
  medicalExpense: 0,
  otherDeductions: 0,
}

function fmt(n: number) {
  return n.toLocaleString('ja-JP')
}

function NumberInput({
  label, value, onChange, min = 0, max = 100_000_000, step = 10_000, unit = '円', note,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; unit?: string; note?: string
}) {
  return (
    <div className="border-b border-tax-rule pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
      <label className="text-[10px] text-tax-ink/40 font-mono tracking-widest block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Math.max(min, Math.min(max, +e.target.value)))}
          className="flex-1 bg-white border border-tax-rule px-3 py-2 text-sm text-right text-tax-ink focus:outline-none focus:border-tax-orange font-mono"
        />
        <span className="text-xs text-tax-ink/50 w-4">{unit}</span>
      </div>
      {note && <p className="text-[10px] text-tax-ink/30 mt-1">{note}</p>}
    </div>
  )
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-tax-rule last:border-b-0 ${highlight ? 'bg-tax-orange-light' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-bold text-tax-orange' : 'text-tax-ink/70'}`}>{label}</span>
      <span className={`text-sm font-mono ${highlight ? 'font-bold text-tax-orange text-base' : 'text-tax-ink'}`}>{value}</span>
    </div>
  )
}

export default function TaxSimulatorPage() {
  const [input, setInput] = useState<TaxSimInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<TaxSimResult>(() => calcFullTax(DEFAULT_INPUT))

  // debounce付きリアルタイム計算
  useEffect(() => {
    const timer = setTimeout(() => setResult(calcFullTax(input)), 300)
    return () => clearTimeout(timer)
  }, [input])

  const set = useCallback(<K extends keyof TaxSimInput>(k: K) => (v: TaxSimInput[K]) => {
    setInput(prev => ({ ...prev, [k]: v }))
  }, [])

  const taxRate = result.taxableIncome > 0
    ? (result.incomeTax / result.taxableIncome * 100).toFixed(1)
    : '0.0'

  return (
    <div className="flex min-h-screen bg-paper">
      <Navigation />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="bg-tax-navy text-white">
          <div className="h-1 bg-tax-orange" />
          <div className="px-4 py-4">
            <p className="text-[9px] text-white/40 font-mono tracking-widest">SIMULATOR</p>
            <h1 className="text-base font-bold">損得シミュレーター</h1>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 px-4 py-6 max-w-4xl">
          {/* 左：入力パネル */}
          <div className="md:w-72 flex-shrink-0 space-y-4">
            <div className="border border-tax-rule bg-paper-light">
              <div className="bg-tax-navy text-white px-4 py-2.5">
                <p className="text-xs font-bold tracking-wider">【収入】</p>
              </div>
              <div className="p-4">
                <NumberInput label="給与収入（年収）" value={input.salary} onChange={set('salary')} step={100_000} />
                <NumberInput label="副業・その他収入" value={input.sideIncome} onChange={set('sideIncome')} step={10_000} note="フリーランス・投資・不動産等" />
              </div>
            </div>

            <div className="border border-tax-rule bg-paper-light">
              <div className="bg-tax-navy text-white px-4 py-2.5">
                <p className="text-xs font-bold tracking-wider">【家族・控除】</p>
              </div>
              <div className="p-4">
                <div className="border-b border-tax-rule pb-3 mb-3">
                  <label className="text-[10px] text-tax-ink/40 font-mono tracking-widest block mb-2">配偶者</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={input.hasSpouse} onChange={e => set('hasSpouse')(e.target.checked)} className="accent-tax-orange w-4 h-4" />
                    <span className="text-sm text-tax-ink">配偶者あり</span>
                  </label>
                  {input.hasSpouse && (
                    <input type="number" placeholder="配偶者の年収" min={0} value={input.spouseIncome}
                      onChange={e => set('spouseIncome')(+e.target.value)}
                      className="mt-2 w-full bg-white border border-tax-rule px-3 py-1.5 text-sm text-right font-mono focus:outline-none focus:border-tax-orange"
                    />
                  )}
                </div>
                <NumberInput label="扶養親族数（16歳以上）" value={input.dependentChildren} onChange={set('dependentChildren')} step={1} unit="人" min={0} max={10} />
                <NumberInput label="iDeCo 月額掛金" value={input.iDecoMonthly} onChange={set('iDecoMonthly')} step={1_000} note="会社員：最大23,000円/月" />
                <NumberInput label="ふるさと納税（寄附合計）" value={input.furusato} onChange={set('furusato')} step={5_000} />
                <NumberInput label="医療費（年間）" value={input.medicalExpense} onChange={set('medicalExpense')} step={10_000} note="10万円または所得の5%超から控除" />
              </div>
            </div>
          </div>

          {/* 右：結果パネル */}
          <div className="flex-1 space-y-4">
            {/* メイン結果 */}
            <div className="border-2 border-tax-orange bg-paper-light">
              <div className="bg-tax-orange text-white px-4 py-2.5">
                <p className="text-xs font-bold tracking-wider">【計算結果】2025年度</p>
              </div>
              <div className="px-4 py-1">
                <ResultRow label="給与収入（総額）" value={`¥${fmt(result.grossIncome)}`} />
                <ResultRow label="　給与所得控除" value={`−¥${fmt(result.employmentDeduction)}`} />
                <ResultRow label="各種控除合計" value={`−¥${fmt(result.totalDeductions)}`} />
                <ResultRow label="課税所得" value={`¥${fmt(result.taxableIncome)}`} />
              </div>
              <div className="border-t-2 border-tax-orange px-4 py-1">
                <ResultRow label="所得税（復興税含む）" value={`¥${fmt(result.incomeTax)}`} />
                <ResultRow label="住民税（概算）" value={`¥${fmt(result.residentTax)}`} />
                <ResultRow label="税負担合計" value={`¥${fmt(result.totalTax)}`} />
                <ResultRow label="🏠 手取り（概算）" value={`¥${fmt(result.takeHome)}`} highlight />
                <ResultRow label="実効税率" value={`${(result.effectiveRate * 100).toFixed(1)}%`} />
              </div>
            </div>

            {/* 追加情報 */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* 翌年国保 */}
              <div className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-3 py-2">
                  <p className="text-[11px] font-bold tracking-wider">翌年の国民健康保険料（目安）</p>
                </div>
                <div className="px-3 py-3">
                  <p className="text-2xl font-bold font-mono text-tax-ink">
                    ¥{fmt(result.nextHealthInsurance.monthly)}<span className="text-sm font-normal text-tax-ink/50">/月</span>
                  </p>
                  <p className="text-xs text-tax-ink/40 mt-1">年額：¥{fmt(result.nextHealthInsurance.annual)}</p>
                  <p className="text-[10px] text-tax-ink/30 mt-2 leading-relaxed">{result.nextHealthInsurance.note}</p>
                </div>
              </div>

              {/* 節税ヒント */}
              <div className="border border-tax-rule bg-paper-light">
                <div className="bg-tax-navy text-white px-3 py-2">
                  <p className="text-[11px] font-bold tracking-wider">節税ヒント</p>
                </div>
                <div className="px-3 py-3 space-y-2">
                  {result.marginToNextBracket !== null && (
                    <div className="text-xs text-tax-ink/70 border-b border-tax-rule pb-2">
                      <span className="text-tax-stamp font-bold">あと¥{fmt(result.marginToNextBracket)}</span>で次の税率ブラケット
                    </div>
                  )}
                  <div className="text-xs text-tax-ink/70 border-b border-tax-rule pb-2">
                    ふるさと納税の上限目安：<span className="text-tax-orange font-bold">¥{fmt(result.furusatoLimit)}</span>
                  </div>
                  {input.iDecoMonthly === 0 && (
                    <div className="text-xs text-tax-ink/70">
                      iDeCo（月1万円）で節税額：<span className="text-tax-orange font-bold">
                        ¥{fmt(Math.floor(120_000 * (result.effectiveRate + 0.1)))}
                      </span>/年
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 免責 */}
            <div className="border border-tax-rule bg-paper-light px-4 py-3">
              <p className="text-[10px] text-tax-ink/30 leading-relaxed font-mono">
                【計算の前提】給与収入に対して給与所得控除を適用。住民税は10%均等割方式で概算。
                国民健康保険料は全国平均値による試算。実際の金額は市区町村・個別事情により異なります。
                正確な申告は税理士または国税庁のサイトでご確認ください。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
