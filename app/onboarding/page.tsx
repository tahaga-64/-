'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase'

const STEPS = [
  { id: 'age', title: '年齢層', subtitle: 'あなたの年齢層を教えてください' },
  { id: 'job', title: '職業', subtitle: '現在のお仕事を選んでください' },
  { id: 'family', title: '家族構成', subtitle: 'ご家族について教えてください' },
  { id: 'income', title: '収入', subtitle: '年収の目安を教えてください' },
]

const AGE_OPTIONS = [
  { value: '20s', label: '20代', desc: '副業・開業・年金の基礎' },
  { value: '30s', label: '30代', desc: '複数収入・ふるさと納税' },
  { value: '40s', label: '40代', desc: '住宅ローン・iDeCo・法人化' },
  { value: '50s', label: '50代', desc: '退職金・相続・出口戦略' },
  { value: '60s_plus', label: '60代以上', desc: '年金・申告要否・e-Tax' },
]

const JOB_OPTIONS = [
  { value: 'employee', label: '会社員', emoji: '👔' },
  { value: 'freelance', label: 'フリーランス', emoji: '💻' },
  { value: 'side_job', label: '副業あり', emoji: '📊' },
  { value: 'pensioner', label: '年金受給者', emoji: '🏡' },
  { value: 'other', label: 'その他', emoji: '✨' },
]

const INCOME_OPTIONS = [
  { value: 2_000_000, label: '200万円未満' },
  { value: 4_000_000, label: '200〜400万円' },
  { value: 6_000_000, label: '400〜600万円' },
  { value: 8_000_000, label: '600〜800万円' },
  { value: 10_000_000, label: '800〜1,000万円' },
  { value: 15_000_000, label: '1,000万円以上' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    ageGroup: '',
    employmentType: '',
    hasSpouse: false,
    childrenCount: 0,
    annualIncome: 4_000_000,
    hasMortgage: false,
    hasIdeco: false,
    prefecture: '東京都',
  })

  const progress = ((step + 1) / STEPS.length) * 100

  async function handleFinish() {
    setSaving(true)
    try {
    const supabase = createSupabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').upsert({
        id: user.id,
        age_group: form.ageGroup,
        employment_type: form.employmentType,
        family_status: { spouse: form.hasSpouse, children: form.childrenCount },
        annual_income: form.annualIncome,
        has_mortgage: form.hasMortgage,
        has_ideco: form.hasIdeco,
        prefecture: form.prefecture,
        onboarding_completed: true,
      })
    }
    } catch { /* Supabase未設定の場合はスキップ */ }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* ヘッダー */}
      <header className="bg-tax-navy text-white">
        <div className="h-1 bg-tax-orange" />
        <div className="px-4 py-4 text-center">
          <p className="text-[9px] text-white/40 font-mono tracking-widest">MONEYWISE JP</p>
          <h1 className="text-base font-bold">プロフィール設定</h1>
        </div>
      </header>

      {/* プログレスバー */}
      <div className="bg-paper-dark border-b border-tax-rule">
        <div className="h-1.5 bg-tax-orange transition-all duration-500" style={{ width: `${progress}%` }} />
        <div className="flex justify-between px-4 py-2 text-[10px] text-tax-ink/40 font-mono">
          {STEPS.map((s, i) => (
            <span key={s.id} className={i <= step ? 'text-tax-orange font-bold' : ''}>{s.title}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pb-24 md:pb-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">STEP {step + 1} / {STEPS.length}</p>
            <h2 className="text-xl font-bold text-tax-ink">{STEPS[step].subtitle}</h2>
          </div>

          {step === 0 && (
            <div className="space-y-2">
              {AGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setForm(f => ({ ...f, ageGroup: opt.value })); setStep(1) }}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 border text-left transition-colors rounded-sm ${
                    form.ageGroup === opt.value
                      ? 'border-tax-orange bg-tax-orange-light'
                      : 'border-tax-rule bg-paper-light hover:border-tax-orange/50'
                  }`}
                >
                  <span className="font-bold text-tax-orange w-10">{opt.label}</span>
                  <span className="text-sm text-tax-ink/60">{opt.desc}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {JOB_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setForm(f => ({ ...f, employmentType: opt.value })); setStep(2) }}
                  className={`flex flex-col items-center gap-2 px-4 py-5 border transition-colors rounded-sm ${
                    form.employmentType === opt.value
                      ? 'border-tax-orange bg-tax-orange-light'
                      : 'border-tax-rule bg-paper-light hover:border-tax-orange/50'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-sm font-medium text-tax-ink">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 bg-paper-light border border-tax-rule p-5 rounded-sm">
              <label className="flex items-center justify-between">
                <span className="text-sm text-tax-ink">配偶者あり</span>
                <input type="checkbox" checked={form.hasSpouse}
                  onChange={e => setForm(f => ({ ...f, hasSpouse: e.target.checked }))}
                  className="w-5 h-5 accent-tax-orange"
                />
              </label>
              <div>
                <label className="text-sm text-tax-ink block mb-1">扶養親族の数（16歳以上）</label>
                <input type="number" min={0} max={10} value={form.childrenCount}
                  onChange={e => setForm(f => ({ ...f, childrenCount: +e.target.value }))}
                  className="w-full border border-tax-rule bg-white px-3 py-2 text-sm focus:outline-none focus:border-tax-orange"
                />
              </div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-tax-ink">住宅ローンあり</span>
                <input type="checkbox" checked={form.hasMortgage}
                  onChange={e => setForm(f => ({ ...f, hasMortgage: e.target.checked }))}
                  className="w-5 h-5 accent-tax-orange"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-tax-ink">iDeCo加入中</span>
                <input type="checkbox" checked={form.hasIdeco}
                  onChange={e => setForm(f => ({ ...f, hasIdeco: e.target.checked }))}
                  className="w-5 h-5 accent-tax-orange"
                />
              </label>
              <button onClick={() => setStep(3)}
                className="w-full bg-tax-orange text-white py-3 text-sm font-bold tracking-wider hover:bg-tax-orange-dark transition-colors">
                次へ →
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              {INCOME_OPTIONS.map((opt) => (
                <button key={opt.value}
                  onClick={() => setForm(f => ({ ...f, annualIncome: opt.value }))}
                  className={`w-full flex items-center justify-between px-5 py-3.5 border transition-colors rounded-sm ${
                    form.annualIncome === opt.value
                      ? 'border-tax-orange bg-tax-orange-light font-bold'
                      : 'border-tax-rule bg-paper-light hover:border-tax-orange/50'
                  }`}
                >
                  <span className="text-sm text-tax-ink">{opt.label}</span>
                  {form.annualIncome === opt.value && <span className="text-tax-orange text-sm">✓</span>}
                </button>
              ))}
              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full bg-tax-navy text-white py-4 text-sm font-bold tracking-wider hover:bg-tax-navy-light transition-colors mt-4 disabled:opacity-50"
              >
                {saving ? '保存中...' : '設定完了・ダッシュボードへ →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
