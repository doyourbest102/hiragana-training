import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProgressBar } from '../components/ProgressBar'
import { SoundButton } from '../components/SoundButton'
import { getCharacterById } from '../data/hiragana'
import { useSpeech } from '../hooks/useSpeech'
import { useLearningStore } from '../store/LearningContext'
import { generateQuizQuestions } from '../utils/quiz'
import type { TestResult } from '../types'

const QUESTION_COUNT = 10

/** テストモード：音声を聞いて四択で答える */
export function TestPage() {
  const navigate = useNavigate()
  const { recordTestAnswer, startSession } = useLearningStore()
  const { speak, isSpeaking, error, clearError, isSupported } = useSpeech()

  const questions = useMemo(() => generateQuizQuestions(QUESTION_COUNT), [])
  const [index, setIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [needsManualPlay, setNeedsManualPlay] = useState(false)
  const sessionStarted = useRef(false)
  const autoPlayedFor = useRef<number | null>(null)
  const manualPlayRequest = useRef(0)

  const question = questions[index]
  const correctChar = getCharacterById(question.correctId)!
  const answered = selectedId !== null
  const isCorrect = selectedId === question.correctId

  useEffect(() => {
    if (!sessionStarted.current) {
      startSession()
      sessionStarted.current = true
    }
  }, [startSession])

  // 問題開始時に自動再生を試みる（失敗時は手動ボタンを目立たせる）
  useEffect(() => {
    if (autoPlayedFor.current === index) return
    autoPlayedFor.current = index
    manualPlayRequest.current += 1
    setNeedsManualPlay(false)
    let cancelled = false

    const tryAutoPlay = async () => {
      const ok = await speak({ text: correctChar.speechText, fromUserGesture: false })
      if (!cancelled && !ok) {
        setNeedsManualPlay(true)
      }
    }

    void tryAutoPlay()
    return () => {
      cancelled = true
    }
  }, [index, correctChar.speechText, speak])

  const handleSpeak = () => {
    const requestId = manualPlayRequest.current + 1
    manualPlayRequest.current = requestId
    clearError()
    setNeedsManualPlay(false)
    void speak({ text: correctChar.speechText, fromUserGesture: true }).then(
      (ok) => {
        if (manualPlayRequest.current === requestId && !ok) {
          setNeedsManualPlay(true)
        }
      },
    )
  }

  const handleSelect = (optionId: string) => {
    if (answered) return
    setSelectedId(optionId)
    const correct = optionId === question.correctId
    recordTestAnswer(question.correctId, correct)
    if (correct) {
      setCorrectCount((n) => n + 1)
    } else {
      setWrongIds((ids) =>
        ids.includes(question.correctId) ? ids : [...ids, question.correctId],
      )
    }
  }

  const handleNext = () => {
    if (index >= questions.length - 1) {
      // correctCount は回答時に更新済み
      const finalResult: TestResult = {
        total: questions.length,
        correct: correctCount,
        incorrect: questions.length - correctCount,
        wrongIds,
      }
      navigate('/test/result', { state: finalResult })
    } else {
      setSelectedId(null)
      setIndex((i) => i + 1)
    }
  }

  return (
    <Layout title="테스트 모드" showBack>
      <ProgressBar
        current={index + 1}
        total={questions.length}
        label={`문제 ${index + 1} / ${questions.length}`}
      />

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-teal-700">
          소리를 듣고 올바른 글자를 선택하세요
        </p>
      </div>

      <div className="mt-4">
        <SoundButton
          onClick={handleSpeak}
          isSpeaking={isSpeaking}
          prominent={needsManualPlay || !isSupported}
          label={needsManualPlay ? '소리 듣기(누르기)' : '다시 듣기'}
        />
      </div>

      {(error || needsManualPlay) && (
        <p className="mt-2 text-center text-sm text-amber-700" role="status">
          {error ?? '자동 재생에 실패했습니다. 위 버튼을 눌러 소리를 들어 주세요.'}
        </p>
      )}

      <div
        className="mt-6 grid grid-cols-2 gap-3"
        role="group"
        aria-label="선택지"
      >
        {question.optionIds.map((id) => {
          const char = getCharacterById(id)!
          let style =
            'bg-white text-teal-900 ring-1 ring-teal-100 hover:ring-teal-300'

          if (answered) {
            if (id === question.correctId) {
              style = 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500'
            } else if (id === selectedId) {
              style = 'bg-red-100 text-red-900 ring-2 ring-red-400'
            } else {
              style = 'bg-slate-50 text-slate-400 ring-1 ring-slate-100'
            }
          }

          return (
            <button
              key={id}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(id)}
              aria-label={`선택지 ${char.hiragana}`}
              className={`flex h-24 items-center justify-center rounded-2xl text-5xl font-extrabold transition active:scale-[0.98] ${style}`}
            >
              {char.hiragana}
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 rounded-2xl p-4 text-center ${
            isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {isCorrect ? (
            <p className="text-xl font-extrabold">정답!</p>
          ) : (
            <>
              <p className="text-xl font-extrabold">오답</p>
              <p className="mt-1 text-base">
                정답은 &quot;{correctChar.hiragana}&quot; ({correctChar.romaji})입니다
              </p>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={!answered}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 font-bold text-white disabled:bg-teal-300"
      >
        {index >= questions.length - 1 ? '결과 보기' : '다음 문제'}
      </button>
    </Layout>
  )
}
