interface ProgressBarProps {
  current: number
  total: number
  label?: string
  compact?: boolean
}

/** 進行状況バー */
export function ProgressBar({
  current,
  total,
  label,
  compact = false,
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full" role="status" aria-label={label ?? `진행 상황 ${current}/${total}`}>
      {label && (
        <div
          className={`mb-1 flex justify-between text-teal-800/80 ${
            compact ? 'text-xs leading-none' : 'text-sm'
          }`}
        >
          <span>{label}</span>
          <span>
            {current} / {total}
          </span>
        </div>
      )}
      <div
        className={`${compact ? 'h-2' : 'h-3'} overflow-hidden rounded-full bg-teal-100`}
      >
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
