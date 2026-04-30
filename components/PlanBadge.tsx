type Plan = 'free' | 'standard' | 'season_pass' | null

type Props = {
  plan: Plan
  remaining?: number
}

const PLAN_CONFIG: Record<NonNullable<Plan>, { label: string; className: string }> = {
  free: { label: '無料プラン', className: 'bg-gray-100 text-gray-600' },
  standard: { label: 'スタンダード', className: 'bg-blue-50 text-blue-700' },
  season_pass: { label: 'シーズンパス', className: 'bg-yellow-50 text-yellow-700' },
}

export default function PlanBadge({ plan, remaining }: Props) {
  const config = PLAN_CONFIG[plan ?? 'free']
  return (
    <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${config.className}`}>
      {config.label}
      {remaining !== undefined && ` (残${remaining}回)`}
    </span>
  )
}
