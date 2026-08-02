import { HIRAGANA_CHARACTERS } from '../data/hiragana'
import type { QuizQuestion } from '../types'

/** 配列をシャッフル（Fisher–Yates） */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 四択クイズを生成する。
 * - 同じ正解が連続しにくいよう、直近の正解を避ける
 * - 選択肢に同じ文字が重複しない
 * - 選択肢の並びもランダム
 */
export function generateQuizQuestions(count: number): QuizQuestion[] {
  const allIds = HIRAGANA_CHARACTERS.map((c) => c.id)
  const questions: QuizQuestion[] = []
  const recentCorrect: string[] = []

  for (let i = 0; i < count; i++) {
    // 直近2問の正解を避けて出題候補を絞る
    let candidates = allIds.filter((id) => !recentCorrect.includes(id))
    if (candidates.length === 0) {
      candidates = [...allIds]
    }

    const correctId = candidates[Math.floor(Math.random() * candidates.length)]

    // 不正解候補から3つ選ぶ（正解以外）
    const wrongPool = shuffle(allIds.filter((id) => id !== correctId))
    const wrongIds = wrongPool.slice(0, 3)

    // 選択肢をシャッフル（正解位置が偏らないように）
    const optionIds = shuffle([correctId, ...wrongIds])

    questions.push({ correctId, optionIds })

    recentCorrect.push(correctId)
    if (recentCorrect.length > 2) {
      recentCorrect.shift()
    }
  }

  return questions
}
