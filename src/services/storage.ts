import type { CharacterProgress, LearningStatus, LearningStoreData } from '../types'
import { HIRAGANA_CHARACTERS } from '../data/hiragana'
import { daysBetween, getTodayString } from '../utils/date'

/** LocalStorageのキー */
const STORAGE_KEY = 'hiragana-training-data'

/** 現在のデータ構造バージョン */
export const DATA_VERSION = 1

/** 空の1文字分進捗 */
export function createEmptyProgress(): CharacterProgress {
  return {
    studyCount: 0,
    writeCount: 0,
    testCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    isWeak: false,
  }
}

/** 初期ストアデータ */
export function createInitialStore(): LearningStoreData {
  const characters: Record<string, CharacterProgress> = {}
  for (const c of HIRAGANA_CHARACTERS) {
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

/**
 * 古いデータがあれば将来ここで移行処理を行う。
 * 現状はバージョン不一致時に不足キーを補完する。
 */
function migrate(data: LearningStoreData): LearningStoreData {
  // 不足している文字の進捗を追加（文字データが増えた場合）
  for (const c of HIRAGANA_CHARACTERS) {
    if (!data.characters[c.id]) {
      data.characters[c.id] = createEmptyProgress()
    }
  }
  data.version = DATA_VERSION
  return data
}

/** LocalStorageから読み込み */
export function loadStore(): LearningStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialStore()
    }
    const parsed = JSON.parse(raw) as LearningStoreData
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

/**
 * 苦手判定を更新する。
 * 出題2回以上かつ正答率50%未満なら苦手とする。
 */
export function updateWeakFlag(progress: CharacterProgress): CharacterProgress {
  const isWeak =
    progress.testCount >= 2 &&
    progress.correctCount / progress.testCount < 0.5
  return { ...progress, isWeak }
}

/** 学習ステータスを算出 */
export function getLearningStatus(progress: CharacterProgress): LearningStatus {
  if (progress.isWeak) {
    return '苦手'
  }
  if (progress.writeCount === 0 && progress.testCount === 0) {
    return '未学習'
  }
  // 書き練習3回以上、かつテストがあれば正答率70%以上で習得済み
  const hasEnoughWriting = progress.writeCount >= 3
  const goodAccuracy =
    progress.testCount === 0 ||
    progress.correctCount / progress.testCount >= 0.7
  if (hasEnoughWriting && goodAccuracy) {
    return '習得済み'
  }
  return '学習中'
}

/** 正答率（0〜100）。出題なしは null */
export function getAccuracy(progress: CharacterProgress): number | null {
  if (progress.testCount === 0) return null
  return Math.round((progress.correctCount / progress.testCount) * 100)
}

/** 全体の正答率 */
export function getOverallAccuracy(data: LearningStoreData): number | null {
  let correct = 0
  let total = 0
  for (const p of Object.values(data.characters)) {
    correct += p.correctCount
    total += p.testCount
  }
  if (total === 0) return null
  return Math.round((correct / total) * 100)
}

/** 学習済み文字数（書いた or テストした） */
export function getLearnedCount(data: LearningStoreData): number {
  return Object.values(data.characters).filter(
    (p) => p.writeCount > 0 || p.testCount > 0,
  ).length
}
