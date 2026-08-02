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
    <Layout title="学習記録" showBack>
      {/* 全体進捗 */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
        <h2 className="text-sm font-bold text-teal-900">全体の学習進捗</h2>
        <p className="mt-1 text-2xl font-extrabold text-teal-900">
          {summary.learnedCount} / {summary.totalCharacters} 文字
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
          全体正答率:{' '}
          <strong>
            {summary.overallAccuracy === null ? '—' : `${summary.overallAccuracy}%`}
          </strong>
          ／ 連続学習: <strong>{summary.streakDays}日</strong>
        </p>
      </section>

      {weakChars.length > 0 && (
        <section className="mt-4" aria-label="苦手な文字">
          <h2 className="text-sm font-bold text-teal-900">苦手な文字</h2>
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
                aria-label={`${c.hiragana}を練習する`}
              >
                {c.hiragana}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 五十音表 */}
      <section className="mt-6" aria-label="五十音表">
        <h2 className="mb-2 text-sm font-bold text-teal-900">五十音表</h2>
        <p className="mb-3 text-xs text-teal-700/70">文字をタップするとその文字だけ練習できます</p>

        <div className="space-y-3">
          {Object.entries(rows).map(([row, chars]) => (
            <div key={row}>
              <p className="mb-1 text-xs font-medium text-teal-600">{row}行</p>
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
                      aria-label={`${c.hiragana}、${status}、学習${progress.studyCount}回`}
                    >
                      <span className="text-2xl font-extrabold leading-none">
                        {c.hiragana}
                      </span>
                      <span className="mt-1 text-[9px] font-medium opacity-80">
                        {status === '未学習'
                          ? '未'
                          : status === '学習中'
                            ? '中'
                            : status === '習得済み'
                              ? '済'
                              : '苦'}
                      </span>
                      <span className="sr-only">
                        学習{progress.studyCount}回、テスト{progress.testCount}回、
                        正解{progress.correctCount}、不正解{progress.incorrectCount}、
                        正答率{accuracy === null ? 'なし' : `${accuracy}%`}
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
      <section className="mt-6" aria-label="文字ごとの詳細">
        <h2 className="mb-2 text-sm font-bold text-teal-900">文字ごとの記録</h2>
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
                  <div>学習{p.studyCount}／書{p.writeCount}</div>
                  <div>
                    テスト{p.testCount}（正{p.correctCount}/誤{p.incorrectCount}）
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
        学習記録をリセットする
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="学習記録のリセット"
        message="すべての学習記録が削除されます。この操作は取り消せません。よろしいですか？"
        confirmLabel="リセットする"
        cancelLabel="キャンセル"
        onConfirm={() => {
          resetAll()
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Layout>
  )
}
