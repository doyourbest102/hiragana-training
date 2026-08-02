import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CharacterProgress, LearningStoreData } from '../types'
import {
  createEmptyProgress,
  getAccuracy,
  getLearnedCount,
  getLearningStatus,
  getOverallAccuracy,
  loadStore,
  recordStudyDay,
  resetStore,
  saveStore,
  updateWeakFlag,
} from '../services/storage'

interface LearningContextValue {
  data: LearningStoreData
  /** 勉強モードで1文字練習したとき */
  recordWriting: (characterId: string, writeTimes: number) => void
  /** テストで1問回答したとき */
  recordTestAnswer: (characterId: string, isCorrect: boolean) => void
  /** 学習セッション開始（連続日数など更新） */
  startSession: () => void
  /** 学習記録をリセット */
  resetAll: () => void
  /** ホーム用サマリー */
  summary: {
    todayStudyCount: number
    learnedCount: number
    overallAccuracy: number | null
    streakDays: number
    totalCharacters: number
  }
  getProgress: (id: string) => CharacterProgress
  getStatus: (id: string) => ReturnType<typeof getLearningStatus>
  getCharAccuracy: (id: string) => number | null
}

const LearningContext = createContext<LearningContextValue | null>(null)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LearningStoreData>(() => loadStore())

  // 変更のたびに LocalStorage へ保存
  useEffect(() => {
    saveStore(data)
  }, [data])

  const startSession = useCallback(() => {
    setData((prev) => recordStudyDay(prev))
  }, [])

  const recordWriting = useCallback((characterId: string, writeTimes: number) => {
    setData((prev) => {
      const current = prev.characters[characterId] ?? createEmptyProgress()
      const updated: CharacterProgress = {
        ...current,
        writeCount: current.writeCount + writeTimes,
        studyCount: current.studyCount + 1,
      }
      return {
        ...prev,
        characters: {
          ...prev.characters,
          [characterId]: updated,
        },
      }
    })
  }, [])

  const recordTestAnswer = useCallback((characterId: string, isCorrect: boolean) => {
    setData((prev) => {
      const current = prev.characters[characterId] ?? createEmptyProgress()
      let updated: CharacterProgress = {
        ...current,
        testCount: current.testCount + 1,
        correctCount: current.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: current.incorrectCount + (isCorrect ? 0 : 1),
      }
      updated = updateWeakFlag(updated)
      return {
        ...prev,
        characters: {
          ...prev.characters,
          [characterId]: updated,
        },
      }
    })
  }, [])

  const resetAll = useCallback(() => {
    setData(resetStore())
  }, [])

  const getProgress = useCallback(
    (id: string) => data.characters[id] ?? createEmptyProgress(),
    [data],
  )

  const getStatus = useCallback(
    (id: string) => getLearningStatus(getProgress(id)),
    [getProgress],
  )

  const getCharAccuracy = useCallback(
    (id: string) => getAccuracy(getProgress(id)),
    [getProgress],
  )

  const summary = useMemo(
    () => ({
      todayStudyCount: data.todayStudyCount,
      learnedCount: getLearnedCount(data),
      overallAccuracy: getOverallAccuracy(data),
      streakDays: data.streakDays,
      totalCharacters: Object.keys(data.characters).length,
    }),
    [data],
  )

  const value: LearningContextValue = {
    data,
    recordWriting,
    recordTestAnswer,
    startSession,
    resetAll,
    summary,
    getProgress,
    getStatus,
    getCharAccuracy,
  }

  return (
    <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
  )
}

export function useLearningStore(): LearningContextValue {
  const ctx = useContext(LearningContext)
  if (!ctx) {
    throw new Error('useLearningStore は LearningProvider 内で使ってください')
  }
  return ctx
}
