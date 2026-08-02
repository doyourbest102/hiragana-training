import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Layout } from '../components/Layout'
import { StatusBadge, STATUS_STYLES } from '../components/StatusBadge'
import { groupByRow, HIRAGANA_CHARACTERS } from '../data/hiragana'
import { useLearningStore } from '../store/LearningContext'
import type { LearningStatus } from '../types'

/** 学習記録画面 */
export function ProgressPage() {
  const navigate = useNavigate()
  const { summary, getProgress, getStatus, getCharAccuracy, resetAll } =
    useLearningStore()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const rows = groupByRow()

  const statusCounts = HIRAGANA_CHARACTERS.reduce(
    (acc, c) => {
      const s = getStatus(c.id)
      acc[s] += 1
      return acc
    },
    { 未学習: 0, 学習中: 0, 習得済み: 0, 苦手: 0 } as Record<LearningStatus, number>,
  )

  const weakChars = HIRAGANA_CHARACTERS.filter((c) => getStatus(c.id) === '苦手')

  return (
    <Layout title="학습 기록" showBack>
      {/* 全体進捗 */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
        <h2 className="text-sm font-bold text-teal-900">전체 학습 진행률</h2>
        <p className="mt-1 text-2xl font-extrabold text-teal-900">
          {summary.learnedCount} / {summary.totalCharacters}글자
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
          전체 정답률:{' '}
          <strong>
            {summary.overallAccuracy === null ? '—' : `${summary.overallAccuracy}%`}
          </strong>
          / 연속 학습: <strong>{summary.streakDays}일</strong>
        </p>
      </section>

      {weakChars.length > 0 && (
        <section className="mt-4" aria-label="취약 글자">
          <h2 className="text-sm font-bold text-teal-900">취약 글자</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {weakChars.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  navigate('/study', {
                    state: { characterIds: [c.id], source: 'single' },
                  })
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl font-bold text-orange-900"
                aria-label={`${c.hiragana} 연습하기`}
              >
                {c.hiragana}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 五十音表 */}
      <section className="mt-6" aria-label="히라가나 표">
        <h2 className="mb-2 text-sm font-bold text-teal-900">히라가나 표</h2>
        <p className="mb-3 text-xs text-teal-700/70">
          글자를 누르면 해당 글자만 연습할 수 있습니다
        </p>

        <div className="space-y-3">
          {Object.entries(rows).map(([row, chars]) => (
            <div key={row}>
              <p className="mb-1 text-xs font-medium text-teal-600">{row}행</p>
              <div className="grid grid-cols-5 gap-1.5">
                {chars.map((c) => {
                  const progress = getProgress(c.id)
                  const status = getStatus(c.id)
                  const accuracy = getCharAccuracy(c.id)
                  const style = STATUS_STYLES[status]

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        navigate('/study', {
                          state: { characterIds: [c.id], source: 'single' },
                        })
                      }
                      className={`flex flex-col items-center rounded-xl p-2 ${style.bg} transition active:scale-95`}
                      aria-label={`${c.hiragana}, ${style.label}, 학습 ${progress.studyCount}회`}
                    >
                      <span className="text-2xl font-extrabold leading-none">
                        {c.hiragana}
                      </span>
                      <span className="mt-1 text-[9px] font-medium opacity-80">
                        {style.shortLabel}
                      </span>
                      <span className="sr-only">
                        학습 {progress.studyCount}회, 테스트 {progress.testCount}회,
                        정답 {progress.correctCount}, 오답 {progress.incorrectCount},
                        정답률 {accuracy === null ? '없음' : `${accuracy}%`}
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

      {/* 詳細リスト（選択文字の数値） */}
      <section className="mt-6" aria-label="글자별 상세">
        <h2 className="mb-2 text-sm font-bold text-teal-900">글자별 기록</h2>
        <ul className="max-h-64 space-y-2 overflow-y-auto rounded-2xl bg-white p-3 ring-1 ring-teal-50">
          {HIRAGANA_CHARACTERS.map((c) => {
            const p = getProgress(c.id)
            const acc = getCharAccuracy(c.id)
            return (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 border-b border-teal-50 py-2 text-sm last:border-0"
              >
                <button
                  type="button"
                  className="flex items-center gap-2 font-bold text-teal-900"
                  onClick={() =>
                    navigate('/study', {
                      state: { characterIds: [c.id], source: 'single' },
                    })
                  }
                >
                  <span className="text-xl">{c.hiragana}</span>
                  <StatusBadge status={getStatus(c.id)} compact />
                </button>
                <div className="text-right text-xs text-teal-700/80">
                  <div>학습 {p.studyCount} / 쓰기 {p.writeCount}</div>
                  <div>
                    테스트 {p.testCount} (정답 {p.correctCount}/오답 {p.incorrectCount})
                    {acc !== null ? ` ${acc}%` : ''}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
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
