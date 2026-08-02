/** 今日の日付を YYYY-MM-DD で返す */
export function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 2つの日付文字列の差（日数）を返す */
export function daysBetween(from: string, to: string): number {
  const a = new Date(from + 'T00:00:00')
  const b = new Date(to + 'T00:00:00')
  const diff = b.getTime() - a.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}
