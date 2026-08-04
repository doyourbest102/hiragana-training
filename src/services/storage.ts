import type { CharacterProgress, LearningStatus, LearningStoreData } from '../types'
import { ALL_CHARACTERS } from '../data/characters'
import { daysBetween, getTodayString } from '../utils/date'

/** LocalStorageのキー */
const STORAGE_KEY = 'hiragana-training-data'

/** 現在のデータ構造バージョン */
export const DATA_VERSION = 3

/** v1を含む保存済み進捗の移行入力 */
interface StoredCharacterProgress {
  studyCount?: number
  writeCount?: number
  testCount?: number
  correctCount?: number
  incorrectCount?: number
  isWeak?: boolean
  isMastered?: boolean
}

interface StoredLearningData {
  version?: number
  characters?: Record<string, StoredCharacterProgress>
  lastStudyDate?: string | null
  streakDays?: number
  totalStudySessions?: number
  todayStudyCount?: number
  todayDate?: string | null
}

/** 空の1文字分進捗 */
export function createEmptyProgress(): CharacterProgress {
  return {
    studyCount: 0,
    writeCount: 0,
    isMastered: false,
  }
}

/** 初期ストアデータ */
export function createInitialStore(): LearningStoreData {
  const characters: Record<string, CharacterProgress> = {}
  for (const c of ALL_CHARACTERS) {
    characters[c.id] = createEmptyProgress()
  }
  return {
    version: DATA_VERSION,
    characters,
    lastStudyDate: null,
    streakDays: 0,
    totalStudySessions: 0,
    todayStudyCount: 0,
    todayDate: getTodayString(),
  }
}

function safeCount(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : 0
}

/** v1で習得済みだった文字を手動習得状態として引き継ぐ */
function wasLegacyMastered(progress: StoredCharacterProgress): boolean {
  if (progress.isWeak) return false
  const writeCount = safeCount(progress.writeCount)
  const testCount = safeCount(progress.testCount)
  const correctCount = safeCount(progress.correctCount)
  const goodAccuracy =
    testCount === 0 || correctCount / testCount >= 0.7
  return writeCount >= 3 && goodAccuracy
}

function normalizeProgress(
  progress: StoredCharacterProgress | undefined,
): CharacterProgress {
  if (!progress) return createEmptyProgress()
  return {
    studyCount: safeCount(progress.studyCount),
    writeCount: safeCount(progress.writeCount),
    isMastered:
      typeof progress.isMastered === 'boolean'
        ? progress.isMastered
        : wasLegacyMastered(progress),
  }
}

/** 既存記録を保持し、不足している文字を空の記録で追加する */
function migrate(data: StoredLearningData): LearningStoreData {
  const initial = createInitialStore()
  const characters: Record<string, CharacterProgress> = {}
  for (const c of ALL_CHARACTERS) {
    characters[c.id] = normalizeProgress(data.characters?.[c.id])
  }

  return {
    version: DATA_VERSION,
    characters,
    lastStudyDate:
      typeof data.lastStudyDate === 'string' || data.lastStudyDate === null
        ? data.lastStudyDate
        : initial.lastStudyDate,
    streakDays: safeCount(data.streakDays),
    totalStudySessions: safeCount(data.totalStudySessions),
    todayStudyCount: safeCount(data.todayStudyCount),
    todayDate:
      typeof data.todayDate === 'string' || data.todayDate === null
        ? data.todayDate
        : initial.todayDate,
  }
}

/** LocalStorageから読み込み */
export function loadStore(): LearningStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialStore()
    }
    const parsed = JSON.parse(raw) as StoredLearningData
    const migrated = migrate(parsed)
    return refreshTodayCounters(migrated)
  } catch {
    return createInitialStore()
  }
}

/** LocalStorageへ保存 */
export function saveStore(data: LearningStoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** 学習記録を完全リセット */
export function resetStore(): LearningStoreData {
  const fresh = createInitialStore()
  saveStore(fresh)
  return fresh
}

/** 日付が変わっていたら本日カウントをリセット */
function refreshTodayCounters(data: LearningStoreData): LearningStoreData {
  const today = getTodayString()
  if (data.todayDate !== today) {
    data.todayStudyCount = 0
    data.todayDate = today
  }
  return data
}

/**
 * 学習日を記録し、連続学習日数を更新する。
 * 同日の複数回学習では連続日数は増やさない。
 */
export function recordStudyDay(data: LearningStoreData): LearningStoreData {
  const today = getTodayString()
  const next = refreshTodayCounters({ ...data, characters: { ...data.characters } })

  if (next.lastStudyDate === today) {
    next.todayStudyCount += 1
    next.totalStudySessions += 1
    return next
  }

  if (next.lastStudyDate && daysBetween(next.lastStudyDate, today) === 1) {
    next.streakDays += 1
  } else {
    next.streakDays = 1
  }

  next.lastStudyDate = today
  next.todayStudyCount += 1
  next.totalStudySessions += 1
  return next
}

/** 学習ステータスを算出 */
export function getLearningStatus(progress: CharacterProgress): LearningStatus {
  if (progress.isMastered) return '習得済み'
  if (progress.writeCount >= 1) return '学習中'
  return '未学習'
}

/** 学習済み文字数（書いた、または手動で習得済みにした文字） */
export function getLearnedCount(data: LearningStoreData): number {
  return Object.values(data.characters).filter(
    (progress) => progress.writeCount > 0 || progress.isMastered,
  ).length
}

/** 手動で習得済みにした文字数 */
export function getMasteredCount(data: LearningStoreData): number {
  return Object.values(data.characters).filter(
    (progress) => progress.isMastered,
  ).length
}
