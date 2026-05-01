/** 住民税計算（2025年度） */

// 住民税の基礎控除（43万円）
const RESIDENT_BASIC_DEDUCTION = 430_000

// 均等割（標準：5,000円/年）
const RESIDENT_FLAT = 5_000

export function calcResidentTax(
  totalIncome: number,
  otherDeductions: number = 0
): number {
  const taxableBase = Math.max(0, totalIncome - RESIDENT_BASIC_DEDUCTION - otherDeductions)
  // 所得割10%
  const incomePortion = Math.floor(taxableBase * 0.1)
  return Math.max(0, incomePortion + RESIDENT_FLAT)
}
