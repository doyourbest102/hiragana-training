interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

/** 進行状況バー */
export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full" role="status" aria-label={label ?? `進行状況 ${current}/${total}`}>
      {label && (
        <div className="mb-1 flex justify-between text-sm text-teal-800/80">
          <span>{label}</span>
          <span>
            {current} / {total}
          </span>
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-teal-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
