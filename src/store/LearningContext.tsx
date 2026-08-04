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
  getLearnedCount,
  getLearningStatus,
  getMasteredCount,
  loadStore,
  recordStudyDay,
  resetStore,
  saveStore,
} from '../services/storage'

interface LearningContextValue {
  data: LearningStoreData
  /** 勉強モードで1文字練習したとき */
  recordWriting: (characterId: string, writeTimes: number) => void
  /** 文字の習得済み状態を手動で変更 */
  setMastered: (characterId: string, isMastered: boolean) => void
  /** 学習セッション開始（連続日数など更新） */
  startSession: () => void
  /** 学習記録をリセット */
  resetAll: () => void
  /** ホーム用サマリー */
  summary: {
    todayStudyCount: number
    learnedCount: number
    masteredCount: number
    streakDays: number
    totalCharacters: number
  }
  getProgress: (id: string) => CharacterProgress
  getStatus: (id: string) => ReturnType<typeof getLearningStatus>
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

  const setMastered = useCallback((characterId: string, isMastered: boolean) => {
    setData((prev) => {
      const current = prev.characters[characterId] ?? createEmptyProgress()
      const updated: CharacterProgress = {
        ...current,
        isMastered,
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

  const summary = useMemo(
    () => ({
      todayStudyCount: data.todayStudyCount,
      learnedCount: getLearnedCount(data),
      masteredCount: getMasteredCount(data),
      streakDays: data.streakDays,
      totalCharacters: Object.keys(data.characters).length,
    }),
    [data],
  )

  const value: LearningContextValue = {
    data,
    recordWriting,
    setMastered,
    startSession,
    resetAll,
    summary,
    getProgress,
    getStatus,
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
