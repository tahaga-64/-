type Plan = 'free' | 'standard' | 'season_pass' | null

type Props = {
  plan: Plan
  remaining?: number
}

const PLAN_CONFIG: Record<NonNullable<Plan>, { label: string; className: string }> = {
  free: {
    label: '無料',
    className: 'bg-paper-dark text-tax-ink border border-tax-rule',
  },
  standard: {
    label: 'スタンダード',
    className: 'bg-tax-orange text-white border border-tax-orange-dark',
  },
  season_pass: {
    label: 'シーズン',
    className: 'bg-tax-navy text-white border border-tax-navy',
  },
}

export default function PlanBadge({ plan, remaining }: Props) {
  const config = PLAN_CONFIG[plan ?? 'free']
  return (
    <span className={`text-xs rounded px-2 py-0.5 font-medium ${config.className}`}>
      {config.label}
      {remaining !== undefined && ` (残${remaining}回)`}
    </span>
  )
}
