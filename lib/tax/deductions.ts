/** 2025年度 各種控除計算 */

// 配偶者控除（配偶者収入 ≤ 103万: 最大38万）
export function calcSpouseDeduction(
  ownIncome: number,
  spouseIncome: number
): number {
  if (spouseIncome > 2_010_000) return 0 // 配偶者特別控除も終了
  if (spouseIncome <= 1_030_000) {
    // 配偶者控除
    if (ownIncome <= 9_000_000) return 380_000
    if (ownIncome <= 9_500_000) return 260_000
    if (ownIncome <= 10_000_000) return 130_000
    return 0
  }
  // 配偶者特別控除（収入123万まで）
  if (spouseIncome > 2_010_000) return 0
  const table = [
    { limit: 1_050_000, deduction: 380_000 },
    { limit: 1_100_000, deduction: 360_000 },
    { limit: 1_150_000, deduction: 310_000 },
    { limit: 1_200_000, deduction: 260_000 },
    { limit: 1_250_000, deduction: 210_000 },
    { limit: 1_300_000, deduction: 160_000 },
    { limit: 1_350_000, deduction: 110_000 },
    { limit: 1_400_000, deduction: 60_000 },
    { limit: 1_550_000, deduction: 30_000 },
    { limit: 2_010_000, deduction: 30_000 },
  ]
  const row = table.find((r) => spouseIncome <= r.limit)
  if (!row) return 0
  if (ownIncome <= 9_000_000) return row.deduction
  if (ownIncome <= 9_500_000) return Math.floor(row.deduction * 2 / 3)
  if (ownIncome <= 10_000_000) return Math.floor(row.deduction / 3)
  return 0
}

// 扶養控除
export function calcDependentDeduction(
  children: { age: number }[],
  otherDependents: number = 0
): number {
  let total = 0
  for (const child of children) {
    if (child.age >= 16 && child.age <= 18) total += 380_000 // 一般扶養
    else if (child.age >= 19 && child.age <= 22) total += 630_000 // 特定扶養
    else if (child.age >= 23 && child.age < 70) total += 380_000 // 一般扶養
    else if (child.age >= 70) total += 480_000 // 老人扶養（同居外）
  }
  total += otherDependents * 380_000
  return total
}

// 医療費控除（超過額）
export function calcMedicalDeduction(
  totalMedical: number,
  totalIncome: number
): number {
  const threshold = Math.min(totalIncome * 0.05, 100_000)
  return Math.max(0, Math.min(totalMedical - threshold, 2_000_000))
}

// ふるさと納税控除上限（概算）
export function calcFurusatoLimit(taxableIncome: number, hasSpouse: boolean): number {
  // 簡易計算（実際は所得・家族構成によって変動）
  const base = taxableIncome * 0.3 * 0.2 + 2_000
  return Math.floor(Math.min(base, 2_000_000))
}

// iDeCo節税効果
export function calcIDecoTaxSaving(
  monthlyContrib: number,
  incomeTaxRate: number
): { annual: number; taxSaving: number } {
  const annual = monthlyContrib * 12
  // 所得控除なので（所得税率 + 住民税率10%）分節税
  const taxSaving = Math.floor(annual * (incomeTaxRate + 0.1))
  return { annual, taxSaving }
}
