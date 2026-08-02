interface CharacterImageProps {
  hiragana: string
}

/** 히라가나 글자 모양을 이미지로 표시한다. */
export function CharacterImage({ hiragana }: CharacterImageProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      role="img"
      aria-label={`히라가나 ${hiragana} 이미지`}
      className="h-28 w-28"
    >
      <title>{`히라가나 ${hiragana}`}</title>
      <rect width="160" height="160" rx="28" fill="#f0fdfa" />
      <text
        x="80"
        y="84"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#134e4a"
        fontFamily='"M PLUS Rounded 1c", "Noto Sans JP", sans-serif'
        fontSize="104"
        fontWeight="800"
      >
        {hiragana}
      </text>
    </svg>
  )
}
