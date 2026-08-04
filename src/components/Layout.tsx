import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  backTo?: string
  compact?: boolean
}

/** 各画面共通のヘッダー付きレイアウト */
export function Layout({
  children,
  title,
  showBack = false,
  backTo = '/',
  compact = false,
}: LayoutProps) {
  return (
    <div
      className={`mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 ${
        compact
          ? 'study-layout pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]'
          : 'pb-8 pt-[max(1rem,env(safe-area-inset-top))]'
      }`}
    >
      <header
        className={`flex items-center gap-3 ${compact ? 'mb-1.5' : 'mb-4'}`}
      >
        {showBack && (
          <Link
            to={backTo}
            className={`inline-flex items-center justify-center rounded-xl bg-white/80 text-teal-800 shadow-sm ring-1 ring-teal-100 ${
              compact ? 'h-11 min-w-11' : 'h-12 min-w-12'
            }`}
            aria-label="뒤로"
          >
            ←
          </Link>
        )}
        {title && (
          <h1 className="text-lg font-bold text-teal-900">{title}</h1>
        )}
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
