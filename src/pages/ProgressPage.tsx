import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Layout } from '../components/Layout'
import { StatusBadge, STATUS_STYLES } from '../components/StatusBadge'
import {
  getCharactersByScript,
  groupByRow,
  isCharacterScript,
} from '../data/characters'
import { getNextLearningStatus } from '../services/storage'
import { useLearningStore } from '../store/LearningContext'
import type { CharacterScript, LearningStatus } from '../types'

/** 学習記録画面 */
export function ProgressPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { summary, getProgress, getStatus, cycleStatus, resetAll } =
    useLearningStore()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const scriptParam = searchParams.get('script') ?? undefined
  const activeScript: CharacterScript = isCharacterScript(scriptParam)
    ? scriptParam
    : 'hiragana'
  const characters = getCharactersByScript(activeScript)
  const rows = groupByRow(activeScript)

  const statusCounts = characters.reduce(
    (acc, c) => {
      const s = getStatus(c.id)
      acc[s] += 1
      return acc
    },
    { 未習得: 0, 学習中: 0, 習得済み: 0 } as Record<LearningStatus, number>,
  )
  const learnedCount = characters.filter(
    (character) => getStatus(character.id) !== '未習得',
  ).length
  const masteredCount = characters.filter(
    (character) => getStatus(character.id) === '習得済み',
  ).length
  const scriptLabel = activeScript === 'hiragana' ? '히라가나' : '가타카나'

  return (
    <Layout title="학습 기록" showBack>
      <div
        className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-teal-100"
        aria-label="문자 종류"
      >
        {(['hiragana', 'katakana'] as const).map((script) => {
          const selected = script === activeScript
          return (
            <button
              key={script}
              type="button"
              aria-pressed={selected}
              onClick={() => setSearchParams({ script })}
              className={`min-h-12 rounded-xl px-2 font-bold transition ${
                selected
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-teal-800'
              }`}
            >
              {script === 'hiragana' ? '히라가나' : '가타카나'}
            </button>
          )
        })}
      </div>

      <section className="mb-4 rounded-2xl bg-white p-3 text-sm text-teal-900 ring-1 ring-teal-100">
        <p className="font-bold">文字をタップすると、学習状態を変更できます。</p>
        <ul className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
          <li>・ 未習得</li>
          <li>△ 学習中</li>
          <li>◎ 習得済み</li>
        </ul>
      </section>

      {/* 全体進捗 */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
        <h2 className="text-sm font-bold text-teal-900">
          {scriptLabel} 학습 진행률
        </h2>
        <p className="mt-1 text-2xl font-extrabold text-teal-900">
          {learnedCount} / {characters.length}글자
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {(Object.keys(STATUS_STYLES) as LearningStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <StatusBadge status={s} />
              <span className="font-bold text-teal-900">{statusCounts[s]}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-teal-800/80">
          학습 완료: <strong>{masteredCount}글자</strong> / 연속 학습:{' '}
          <strong>{summary.streakDays}일</strong>
        </p>
      </section>

      {/* 五十音表 */}
      <section className="mt-6" aria-label={`${scriptLabel} 표`}>
        <h2 className="mb-2 text-sm font-bold text-teal-900">{scriptLabel} 표</h2>
        <p className="mb-3 text-xs text-teal-700/70">
          文字をタップすると状態が変わります
        </p>

        <div className="space-y-3">
          {Object.entries(rows).map(([row, chars]) => (
            <div key={row}>
              <p className="mb-1 text-xs font-medium text-teal-600">{row}행</p>
              <div className="grid grid-cols-5 gap-1.5">
                {chars.map((c) => {
                  const progress = getProgress(c.id)
                  const status = getStatus(c.id)
                  const style = STATUS_STYLES[status]
                  const nextStatus = getNextLearningStatus(status)

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => cycleStatus(c.id)}
                      className={`flex min-h-16 flex-col items-center justify-center rounded-xl p-1.5 ${style.bg} transition active:scale-95`}
                      aria-label={`${c.character}、現在は${style.label}、タップすると${nextStatus}`}
                    >
                      <span className="text-2xl font-extrabold leading-none">
                        {c.character}
                      </span>
                      <span className="mt-1 text-[9px] font-medium opacity-80">
                        {style.icon} {style.shortLabel}
                      </span>
                      <span className="sr-only">
                        학습 {progress.studyCount}회, 쓰기 {progress.writeCount}회
                      </span>
                    </button>
                  )
                })}
                {/* や行・わ行など5未満の行の空きを埋める */}
                {Array.from({ length: 5 - chars.length }).map((_, i) => (
                  <div key={`empty-${row}-${i}`} className="opacity-0" aria-hidden="true" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-red-50 font-bold text-red-700 ring-1 ring-red-200"
      >
        학습 기록 초기화
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="학습 기록 초기화"
        message="모든 학습 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
        confirmLabel="초기화"
        cancelLabel="취소"
        onConfirm={() => {
          resetAll()
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Layout>
  )
}
