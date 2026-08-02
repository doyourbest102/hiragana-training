import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProgressBar } from '../components/ProgressBar'
import { SoundButton } from '../components/SoundButton'
import { StrokeOrderGuide } from '../components/StrokeOrderGuide'
import {
  WritingCanvas,
  type WritingCanvasHandle,
} from '../components/WritingCanvas'
import { getCharacterById, groupByRow } from '../data/hiragana'
import { useSpeech } from '../hooks/useSpeech'
import { useLearningStore } from '../store/LearningContext'
import type { StudyOptions } from '../types'

const MIN_PRACTICE = 5

/** 勉強モード：なぞり書き練習 */
export function StudyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const options = (location.state as StudyOptions | null) ?? {}
  const { recordWriting, startSession } = useLearningStore()
  const { speak, isSpeaking, error, clearError } = useSpeech()
  const canvasRef = useRef<WritingCanvasHandle>(null)

  const characters = useMemo(() => {
    if (!options.characterIds) return []
    return options.characterIds
      .map((id) => getCharacterById(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
  }, [options.characterIds])
  const rows = useMemo(() => groupByRow(), [])
  const selectionKey = options.characterIds?.join('|') ?? ''

  const [index, setIndex] = useState(0)
  const [practiceCount, setPracticeCount] = useState(0)
  const [hasInk, setHasInk] = useState(false)
  const [finished, setFinished] = useState(false)
  const sessionStarted = useRef(false)

  const current = characters[index]
  // 今キャンバスに書いている分も練習回数に含める
  const effectivePractice = practiceCount + (hasInk ? 1 : 0)
  const canGoNext = effectivePractice >= MIN_PRACTICE

  useEffect(() => {
    if (characters.length === 0) {
      sessionStarted.current = false
      return
    }
    if (!sessionStarted.current) {
      sessionStarted.current = true
      startSession()
    }
  }, [characters.length, startSession])

  // 練習対象が変わったら最初から開始
  useEffect(() => {
    setIndex(0)
    setPracticeCount(0)
    setHasInk(false)
    setFinished(false)
  }, [selectionKey])

  // 文字が変わったら練習回数をリセット
  useEffect(() => {
    setPracticeCount(0)
    setHasInk(false)
  }, [index])

  if (!options.characterIds) {
    return (
      <Layout title="연습할 글자 선택" showBack>
        <p className="mb-4 text-sm text-teal-800/80">
          히라가나를 누르면 해당 글자를 연습할 수 있습니다.
        </p>
        <div className="space-y-3" aria-label="히라가나 표">
          {Object.entries(rows).map(([row, chars]) => (
            <section key={row} aria-labelledby={`study-row-${row}`}>
              <h2
                id={`study-row-${row}`}
                className="mb-1 text-xs font-bold text-teal-700"
              >
                {row}행
              </h2>
              <div className="grid grid-cols-5 gap-1.5">
                {chars.map((character) => (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() =>
                      navigate('/study', {
                        state: {
                          characterIds: [character.id],
                          source: 'picker',
                        } satisfies StudyOptions,
                      })
                    }
                    className="flex h-14 items-center justify-center rounded-xl bg-white text-2xl font-extrabold text-teal-900 shadow-sm ring-1 ring-teal-100 transition active:scale-95"
                    aria-label={`${character.hiragana} 연습하기`}
                  >
                    {character.hiragana}
                  </button>
                ))}
                {Array.from({ length: 5 - chars.length }).map((_, i) => (
                  <div
                    key={`empty-${row}-${i}`}
                    className="opacity-0"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Layout>
    )
  }

  if (characters.length === 0) {
    return (
      <Layout title="학습 모드" showBack>
        <p className="text-center text-teal-800">연습할 글자가 없습니다.</p>
        <Link
          to="/"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white"
        >
          홈으로
        </Link>
      </Layout>
    )
  }

  if (finished) {
    const returnPath =
      options.source === 'weak'
        ? '/weak'
        : options.source === 'single'
          ? '/progress'
          : options.source === 'picker'
            ? '/study'
            : '/'
    const returnLabel =
      options.source === 'weak'
        ? '취약 글자로 돌아가기'
        : options.source === 'single'
          ? '학습 기록으로 돌아가기'
          : options.source === 'picker'
            ? '다른 글자 선택하기'
            : '홈으로'

    return (
      <Layout title="학습 완료" showBack backTo={returnPath}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-3xl font-extrabold text-teal-700"
            aria-hidden="true"
          >
            OK
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-teal-900">수고했어요!</h2>
          <p className="mt-2 text-teal-800/80">
            {characters.length}글자 연습을 마쳤습니다.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setIndex(0)
                setPracticeCount(0)
                setFinished(false)
              }}
              className="flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white"
            >
              다시 연습하기
            </button>
            <Link
              to={returnPath}
              className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-teal-800 ring-1 ring-teal-100"
            >
              {returnLabel}
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const handleClear = () => {
    const hadStrokes = canvasRef.current?.hasStrokes() ?? false
    canvasRef.current?.clear()
    setHasInk(false)
    // 何か書いてから書き直したら1回練習したとみなす
    if (hadStrokes) {
      setPracticeCount((n) => n + 1)
    }
  }

  const handleNext = () => {
    if (!canGoNext || !current) return

    recordWriting(current.id, Math.max(effectivePractice, MIN_PRACTICE))

    if (index >= characters.length - 1) {
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleSpeak = () => {
    if (!current) return
    clearError()
    void speak({ text: current.speechText, fromUserGesture: true })
  }

  return (
    <Layout
      title="학습 모드"
      showBack
      backTo={
        options.source === 'weak'
          ? '/weak'
          : options.source === 'single'
            ? '/progress'
            : options.source === 'picker'
              ? '/study'
              : '/'
      }
    >
      <ProgressBar
        current={index + 1}
        total={characters.length}
        label="진행 상황"
      />

      <div className="mt-4 flex flex-col items-center text-center">
        <StrokeOrderGuide hiragana={current.hiragana} />
        <p className="mt-2 text-xl font-medium tracking-wide text-teal-700">
          {current.romaji}
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <SoundButton onClick={handleSpeak} isSpeaking={isSpeaking} />
      </div>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4">
        <WritingCanvas
          ref={canvasRef}
          guideChar={current.hiragana}
          onStrokeEnd={() => setHasInk(true)}
        />
      </div>

      <p className="mt-3 text-center text-sm text-teal-800/80">
        연습 횟수: <strong>{effectivePractice}</strong> / {MIN_PRACTICE}회 이상
        {!canGoNext && (
          <span className="mt-1 block text-amber-700">
            {MIN_PRACTICE - effectivePractice}번 더 쓴 후 다음으로 갈 수 있습니다
            (쓴 다음 &quot;다시 쓰기&quot;를 눌러 반복 연습)
          </span>
        )}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-teal-800 ring-1 ring-teal-200"
        >
          다시 쓰기
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white disabled:bg-teal-300"
        >
          {index >= characters.length - 1 ? '완료하기' : '다음 글자'}
        </button>
      </div>

      {/* 一覧からの単一文字練習で使う戻る導線 */}
      {(options.source === 'single' ||
        options.source === 'picker' ||
        options.source === 'weak') && (
        <button
          type="button"
          onClick={() =>
            navigate(
              options.source === 'weak'
                ? '/weak'
                : options.source === 'single'
                  ? '/progress'
                  : '/study',
            )
          }
          className="mt-3 text-center text-sm text-teal-700 underline"
        >
          {options.source === 'weak'
            ? '취약 글자로 돌아가기'
            : options.source === 'single'
              ? '학습 기록으로 돌아가기'
              : '글자 선택으로 돌아가기'}
        </button>
      )}
    </Layout>
  )
}
