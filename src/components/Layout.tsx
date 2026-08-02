import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  backTo?: string
}

/** 各画面共通のヘッダー付きレイアウト */
export function Layout({
  children,
  title,
  showBack = false,
  backTo = '/',
}: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-3">
        {showBack && (
          <Link
            to={backTo}
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-xl bg-white/80 text-teal-800 shadow-sm ring-1 ring-teal-100"
            aria-label="戻る"
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
