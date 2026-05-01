export * from './income-tax'
export * from './resident-tax'
export * from './health-insurance'
export * from './deductions'

import {
  calcEmploymentDeduction,
  calcBasicDeduction,
  calcIncomeTax,
  calcMarginToNextBracket,
} from './income-tax'
import { calcResidentTax } from './resident-tax'
import { calcHealthInsurance } from './health-insurance'

export type TaxSimInput = {
  salary: number          // 給与収入
  sideIncome: number      // 副業収入
  hasSpouse: boolean
  spouseIncome: number    // 配偶者収入
  dependentChildren: number // 16歳以上の扶養親族数
  iDecoMonthly: number    // iDeCo月額
  furusato: number        // ふるさと納税額
  medicalExpense: number  // 医療費（年間）
  otherDeductions: number // その他控除合計
}

export type TaxSimResult = {
  grossIncome: number
  employmentDeduction: number
  totalIncome: number          // 所得金額（控除前）
  totalDeductions: number
  taxableIncome: number
  incomeTax: number
  residentTax: number
  totalTax: number
  takeHome: number
  effectiveRate: number        // 実効税率
  nextHealthInsurance: TaxResult_Health
  marginToNextBracket: number | null
  furusatoLimit: number
}

type TaxResult_Health = {
  annual: number
  monthly: number
  note: string
}

export function calcFullTax(input: TaxSimInput): TaxSimResult {
  const grossIncome = input.salary + input.sideIncome

  // 給与所得控除
  const employmentDeduction = calcEmploymentDeduction(input.salary)

  // 各種所得合計
  const totalIncome = grossIncome - employmentDeduction

  // 基礎控除
  const basicDeduction = calcBasicDeduction(totalIncome)

  // 配偶者控除（簡易）
  const spouseDeduction = input.hasSpouse && input.spouseIncome <= 2_010_000 ? 380_000 : 0

  // 扶養控除（一般扶養として38万×人数）
  const dependentDeduction = input.dependentChildren * 380_000

  // iDeCo控除（掛金全額控除）
  const idecoDeduction = input.iDecoMonthly * 12

  // ふるさと納税控除（寄附額 - 2,000円）
  const furusatoDeduction = Math.max(0, input.furusato - 2_000)

  // 医療費控除
  const medicalDeduction =
    input.medicalExpense > Math.min(totalIncome * 0.05, 100_000)
      ? Math.min(input.medicalExpense - Math.min(totalIncome * 0.05, 100_000), 2_000_000)
      : 0

  const totalDeductions =
    basicDeduction +
    spouseDeduction +
    dependentDeduction +
    idecoDeduction +
    furusatoDeduction +
    medicalDeduction +
    input.otherDeductions

  const taxableIncome = Math.max(0, totalIncome - totalDeductions)

  const incomeTax = calcIncomeTax(taxableIncome)
  const residentTax = calcResidentTax(totalIncome, totalDeductions - basicDeduction)
  const totalTax = incomeTax + residentTax
  const takeHome = grossIncome - totalTax
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0

  const nextHealthInsurance = calcHealthInsurance(totalIncome)
  const marginToNextBracket = calcMarginToNextBracket(taxableIncome)

  const furusatoLimit = Math.floor(taxableIncome * 0.3 * 0.2 + 2_000)

  return {
    grossIncome,
    employmentDeduction,
    totalIncome,
    totalDeductions,
    taxableIncome,
    incomeTax,
    residentTax,
    totalTax,
    takeHome,
    effectiveRate,
    nextHealthInsurance,
    marginToNextBracket,
    furusatoLimit,
  }
}
