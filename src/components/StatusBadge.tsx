import type { LearningStatus } from '../types'

const STATUS_STYLES: Record<
  LearningStatus,
  { bg: string; label: string; icon: string }
> = {
  未学習: { bg: 'bg-slate-100 text-slate-600', label: '未学習', icon: '・' },
  学習中: { bg: 'bg-amber-100 text-amber-800', label: '学習中', icon: '△' },
  習得済み: { bg: 'bg-sky-100 text-sky-800', label: '習得済み', icon: '◎' },
  苦手: { bg: 'bg-orange-100 text-orange-800', label: '苦手', icon: '！' },
}

interface StatusBadgeProps {
  status: LearningStatus
  compact?: boolean
}

/** 学習ステータス表示（色＋文字＋記号で識別） */
export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg font-medium ${style.bg} ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
    >
      <span aria-hidden="true">{style.icon}</span>
      {!compact && <span>{style.label}</span>}
      {compact && <span className="sr-only">{style.label}</span>}
    </span>
  )
}

export { STATUS_STYLES }
