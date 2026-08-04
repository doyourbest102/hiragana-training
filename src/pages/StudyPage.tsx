import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProgressBar } from '../components/ProgressBar'
import { StrokeOrderGuide } from '../components/StrokeOrderGuide'
import {
  WritingCanvas,
  type WritingCanvasHandle,
} from '../components/WritingCanvas'
import {
  getCharacterById,
  getCharactersByScript,
  isCharacterScript,
} from '../data/characters'
import { useLearningStore } from '../store/LearningContext'

const MIN_PRACTICE = 5

/** 勉強モード：なぞり書き練習 */
export function StudyPage() {
  const navigate = useNavigate()
  const { script: scriptParam, characterId } = useParams()
  const { recordWriting, startSession } = useLearningStore()
  const canvasRef = useRef<WritingCanvasHandle>(null)

  const script = isCharacterScript(scriptParam) ? scriptParam : null
  const requestedCharacter = characterId
    ? getCharacterById(characterId)
    : undefined
  const isSinglePractice = Boolean(characterId)
  const characters = !script
    ? []
    : isSinglePractice
      ? requestedCharacter?.script === script
        ? [requestedCharacter]
        : []
      : getCharactersByScript(script)
  const selectionKey = `${scriptParam ?? ''}:${characterId ?? ''}`

  const [index, setIndex] = useState(0)
  const [practiceCount, setPracticeCount] = useState(0)
  const [hasInk, setHasInk] = useState(false)
  const [finished, setFinished] = useState(false)
  const sessionStarted = useRef(false)
  const isAdvancingRef = useRef(false)

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
    isAdvancingRef.current = false
  }, [selectionKey])

  // 文字が変わったら練習回数をリセット
  useEffect(() => {
    setPracticeCount(0)
    setHasInk(false)
    isAdvancingRef.current = false
  }, [index])

  if (!script) return <Navigate to="/study" replace />
  if (characters.length === 0) {
    return <Navigate to={`/study/${script}`} replace />
  }

  if (finished) {
    const returnPath = '/study'
    const returnLabel = '다른 문자 선택하기'

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
                isAdvancingRef.current = false
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
    if (isAdvancingRef.current || !canGoNext || !current) return
    isAdvancingRef.current = true

    recordWriting(current.id, Math.max(effectivePractice, MIN_PRACTICE))

    if (isSinglePractice) {
      navigate(`/progress?script=${script}`, { replace: true })
    } else if (index >= characters.length - 1) {
      setFinished(true)
    } else {
      canvasRef.current?.clear()
      setPracticeCount(0)
      setHasInk(false)
      setIndex((i) => i + 1)
    }
  }

  const isLastCharacter = index >= characters.length - 1
  const actionLabel = isSinglePractice
    ? '연습 완료하기'
    : isLastCharacter
      ? '학습 완료하기'
      : '다음'

  return (
    <Layout
      title={`${script === 'hiragana' ? '히라가나' : '가타카나'} 학습`}
      showBack
      compact
      backTo={isSinglePractice ? `/progress?script=${script}` : '/study'}
    >
      <div className="study-practice flex min-h-0 flex-1 flex-col">
        <ProgressBar
          current={index + 1}
          total={characters.length}
          label="진행 상황"
          compact
        />

        <div className="mt-1.5 flex items-center justify-center gap-4">
          <StrokeOrderGuide character={current.character} compact />
          <div className="min-w-16 text-center">
            <p className="text-4xl font-extrabold leading-none text-teal-900">
              {current.character}
            </p>
            <p className="mt-1 text-lg font-medium leading-none tracking-wide text-teal-700">
              {current.koreanReading}
            </p>
          </div>
        </div>

        <div className="mt-1.5">
          <WritingCanvas
            ref={canvasRef}
            guideChar={current.character}
            onStrokeEnd={() => setHasInk(true)}
          />
        </div>

        <p className="mt-1 text-center text-xs leading-tight text-teal-800/80">
          연습 횟수: <strong>{effectivePractice}</strong> / {MIN_PRACTICE}회 이상
          {!canGoNext && (
            <span className="mt-0.5 block text-amber-700">
              다음으로 가려면 {MIN_PRACTICE - effectivePractice}번 더 써 주세요.
            </span>
          )}
        </p>

        <div className="mt-1.5 grid grid-cols-2 gap-2">
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
            {actionLabel}
          </button>
        </div>

        {/* 低い画面ではヘッダーの戻る導線を使い、操作領域を優先する */}
        <button
          type="button"
          onClick={() =>
            navigate(
              isSinglePractice ? `/progress?script=${script}` : '/study',
            )
          }
          className="study-return-link mt-1 min-h-11 text-center text-sm text-teal-700 underline"
        >
          {isSinglePractice ? '학습 기록으로 돌아가기' : '문자 선택으로 돌아가기'}
        </button>
      </div>
    </Layout>
  )
}
