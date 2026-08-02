import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProgressBar } from '../components/ProgressBar'
import { SoundButton } from '../components/SoundButton'
import {
  WritingCanvas,
  type WritingCanvasHandle,
} from '../components/WritingCanvas'
import { HIRAGANA_CHARACTERS, getCharacterById } from '../data/hiragana'
import { useSpeech } from '../hooks/useSpeech'
import { useLearningStore } from '../store/LearningContext'
import type { StudyOptions } from '../types'

const MIN_PRACTICE = 3

/** 勉強モード：なぞり書き練習 */
export function StudyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const options = (location.state as StudyOptions | null) ?? {}
  const { recordWriting, startSession } = useLearningStore()
  const { speak, isSpeaking, error, clearError } = useSpeech()
  const canvasRef = useRef<WritingCanvasHandle>(null)

  const characters = useMemo(() => {
    if (options.characterIds && options.characterIds.length > 0) {
      return options.characterIds
        .map((id) => getCharacterById(id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
    }
    return HIRAGANA_CHARACTERS
  }, [options.characterIds])

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
    if (!sessionStarted.current) {
      sessionStarted.current = true
      startSession()
    }
  }, [startSession])

  // 文字が変わったら練習回数をリセット
  useEffect(() => {
    setPracticeCount(0)
    setHasInk(false)
  }, [index])

  if (characters.length === 0) {
    return (
      <Layout title="勉強モード" showBack>
        <p className="text-center text-teal-800">練習する文字がありません。</p>
        <Link
          to="/"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white"
        >
          ホームに戻る
        </Link>
      </Layout>
    )
  }

  if (finished) {
    return (
      <Layout title="勉強完了" showBack>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-3xl font-extrabold text-teal-700"
            aria-hidden="true"
          >
            OK
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-teal-900">おつかれさま！</h2>
          <p className="mt-2 text-teal-800/80">
            {characters.length} 文字の練習が終わりました。
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
              もう一度練習する
            </button>
            <Link
              to="/"
              className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-teal-800 ring-1 ring-teal-100"
            >
              ホームに戻る
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
    <Layout title="勉強モード" showBack>
      <ProgressBar
        current={index + 1}
        total={characters.length}
        label="進行状況"
      />

      <div className="mt-4 text-center">
        <p
          className="text-7xl font-extrabold leading-none text-teal-900"
          aria-label={`ひらがな ${current.hiragana}`}
        >
          {current.hiragana}
        </p>
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
        練習回数: <strong>{effectivePractice}</strong> / {MIN_PRACTICE}回以上
        {!canGoNext && (
          <span className="mt-1 block text-amber-700">
            あと {MIN_PRACTICE - effectivePractice} 回書いてから次へ進めます
            （書いたら「書き直す」でくり返し練習）
          </span>
        )}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-teal-800 ring-1 ring-teal-200"
        >
          書き直す
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white disabled:bg-teal-300"
        >
          {index >= characters.length - 1 ? '完了する' : '次の文字'}
        </button>
      </div>

      {/* 単一文字練習からの戻る用（stateで渡された場合） */}
      {options.source === 'single' && (
        <button
          type="button"
          onClick={() => navigate('/progress')}
          className="mt-3 text-center text-sm text-teal-700 underline"
        >
          学習記録に戻る
        </button>
      )}
    </Layout>
  )
}
