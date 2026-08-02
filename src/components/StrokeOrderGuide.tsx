import { useState } from 'react'

interface StrokeOrderGuideProps {
  hiragana: string
}

/** 로컬 AnimCJK SVG로 히라가나 쓰기 순서를 보여 준다. */
export function StrokeOrderGuide({ hiragana }: StrokeOrderGuideProps) {
  const [replayKey, setReplayKey] = useState(0)
  const codePoint = hiragana.codePointAt(0)

  if (codePoint === undefined) return null

  return (
    <section className="flex flex-col items-center" aria-label="쓰기 순서">
      <p className="mb-1 text-sm font-bold text-teal-800">쓰기 순서</p>
      <img
        key={`${hiragana}-${replayKey}`}
        src={`/strokes/${codePoint}.svg?replay=${replayKey}`}
        alt={`${hiragana} 쓰기 순서 애니메이션`}
        className="h-40 w-40 rounded-2xl bg-white"
      />
      <button
        type="button"
        onClick={() => setReplayKey((key) => key + 1)}
        className="mt-1 min-h-11 px-3 text-sm font-bold text-teal-700 underline"
      >
        다시 보기
      </button>
    </section>
  )
}
