/**
 * 国民健康保険料の概算（全国平均値）
 * 市区町村によって大きく異なるため、あくまで目安として使用
 */

// 全国平均の料率（2024年度実績ベース）
const INCOME_RATE = 0.0967  // 所得割（医療分）
const UNIFORM_AMOUNT = 54_000 // 均等割（医療分）
const REDUCTION_THRESHOLD_33 = 430_000 + 330_000  // 軽減判定

export type HealthInsuranceResult = {
  annual: number
  monthly: number
  note: string
}

export function calcHealthInsurance(prevYearIncome: number): HealthInsuranceResult {
  // 前年所得 = 収入 - 給与所得控除（概算）
  const base = Math.max(0, prevYearIncome - 330_000)
  const incomePortion = Math.floor(base * INCOME_RATE)
  const annual = Math.min(incomePortion + UNIFORM_AMOUNT, 920_000) // 上限92万
  const monthly = Math.floor(annual / 12)
  return {
    annual,
    monthly,
    note: '全国平均の目安額です。実際の金額はお住まいの市区町村にご確認ください。',
  }
}
