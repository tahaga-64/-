/** 2025年度 所得税計算 */

// 給与所得控除（2025年度）
export function calcEmploymentDeduction(income: number): number {
  if (income <= 1_800_000) return Math.max(650_000, income * 0.4 - 100_000)
  if (income <= 3_600_000) return income * 0.3 + 80_000
  if (income <= 6_600_000) return income * 0.2 + 440_000
  if (income <= 8_500_000) return income * 0.1 + 1_100_000
  return 1_950_000
}

// 基礎控除（2025年度：48万→58万に改正）
export function calcBasicDeduction(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 580_000
  if (totalIncome <= 24_500_000) return 480_000
  if (totalIncome <= 25_000_000) return 160_000
  return 0
}

// 所得税の税率テーブル（2025年度）
const TAX_BRACKETS = [
  { limit: 1_950_000, rate: 0.05, deduction: 0 },
  { limit: 3_300_000, rate: 0.1, deduction: 97_500 },
  { limit: 6_950_000, rate: 0.2, deduction: 427_500 },
  { limit: 9_000_000, rate: 0.23, deduction: 636_000 },
  { limit: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { limit: 40_000_000, rate: 0.4, deduction: 2_796_000 },
  { limit: Infinity, rate: 0.45, deduction: 4_796_000 },
]

// 所得税額（復興特別所得税 2.1% 含む）
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  const bracket = TAX_BRACKETS.find((b) => taxableIncome <= b.limit)!
  const base = Math.floor(taxableIncome * bracket.rate) - bracket.deduction
  return Math.floor(Math.max(0, base) * 1.021)
}

// 次の税率ブラケットまでの余裕金額
export function calcMarginToNextBracket(taxableIncome: number): number | null {
  const idx = TAX_BRACKETS.findIndex((b) => taxableIncome <= b.limit)
  if (idx < 0 || idx >= TAX_BRACKETS.length - 1) return null
  return TAX_BRACKETS[idx].limit - taxableIncome
}
