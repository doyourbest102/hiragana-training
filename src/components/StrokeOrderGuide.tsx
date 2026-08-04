import { useState } from 'react'

interface StrokeOrderGuideProps {
  character: string
  compact?: boolean
}

/** 로컬 AnimCJK SVG로 히라가나 쓰기 순서를 보여 준다. */
export function StrokeOrderGuide({
  character,
  compact = false,
}: StrokeOrderGuideProps) {
  const [replayKey, setReplayKey] = useState(0)
  const codePoint = character.codePointAt(0)

  if (codePoint === undefined) return null

  return (
    <section
      className={`flex items-center ${
        compact ? 'gap-1.5' : 'flex-col'
      }`}
      aria-label="쓰기 순서"
    >
      <div className="flex flex-col items-center">
        <p
          className={`mb-1 font-bold text-teal-800 ${
            compact ? 'text-xs leading-none' : 'text-sm'
          }`}
        >
          쓰기 순서
        </p>
        <img
          key={`${character}-${replayKey}`}
          src={`/strokes/${codePoint}.svg?replay=${replayKey}`}
          alt={`${character} 쓰기 순서 애니메이션`}
          className={`bg-white ${
            compact
              ? 'h-16 w-16 rounded-xl'
              : 'h-40 w-40 rounded-2xl'
          }`}
        />
      </div>
      <button
        type="button"
        onClick={() => setReplayKey((key) => key + 1)}
        className={`min-h-11 font-bold text-teal-700 underline ${
          compact ? 'px-1.5 text-xs' : 'mt-1 px-3 text-sm'
        }`}
      >
        다시 보기
      </button>
    </section>
  )
}
