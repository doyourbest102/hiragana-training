interface SoundButtonProps {
  onClick: () => void
  isSpeaking?: boolean
  label?: string
  prominent?: boolean
  disabled?: boolean
}

/** 音声再生ボタン */
export function SoundButton({
  onClick,
  isSpeaking = false,
  label = '音声を聞く',
  prominent = false,
  disabled = false,
}: SoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={
        prominent
          ? 'flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-lg font-bold text-amber-950 shadow-md transition active:scale-[0.98]'
          : 'inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 font-bold text-white shadow-sm transition active:scale-[0.98]'
      }
    >
      <span aria-hidden="true" className="text-xl">
        ♪
      </span>
      <span>{isSpeaking ? '再生中…' : label}</span>
    </button>
  )
}
