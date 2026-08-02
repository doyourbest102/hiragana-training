interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** 確認ダイアログ（リセット誤操作防止用） */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '실행',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-bold text-teal-900">
          {title}
        </h2>
        <p id="confirm-message" className="mt-2 text-sm leading-relaxed text-teal-800/80">
          {message}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-12 items-center justify-center rounded-xl bg-red-600 font-bold text-white"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 items-center justify-center rounded-xl bg-teal-50 font-bold text-teal-800"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
