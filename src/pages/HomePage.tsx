import { Link } from 'react-router-dom'
import { useLearningStore } from '../store/LearningContext'
import { HIRAGANA_CHARACTERS } from '../data/hiragana'

/** ホーム画面 */
export function HomePage() {
  const { summary } = useLearningStore()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* ブランドをヒーロー級に配置 */}
      <header className="mb-8 text-center">
        <p className="text-sm font-medium tracking-wide text-teal-600">書いて・聞いて覚える</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight text-teal-900 sm:text-5xl">
          ひらがな
          <br />
          トレーニング
        </h1>
        <p className="mt-3 text-base text-teal-800/75">
          清音 {HIRAGANA_CHARACTERS.length} 文字を楽しくマスター
        </p>
      </header>

      {/* メイン導線 */}
      <nav className="flex flex-col gap-3" aria-label="学習メニュー">
        <Link
          to="/study"
          className="flex h-14 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white shadow-md transition active:scale-[0.98]"
        >
          勉強モード
        </Link>
        <Link
          to="/test"
          className="flex h-14 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-amber-950 shadow-md transition active:scale-[0.98]"
        >
          テストモード
        </Link>
        <Link
          to="/progress"
          className="flex h-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-teal-800 shadow-sm ring-1 ring-teal-100 transition active:scale-[0.98]"
        >
          学習記録
        </Link>
      </nav>

      {/* 学習サマリー */}
      <section
        className="mt-8 grid grid-cols-2 gap-3"
        aria-label="本日の学習状況"
      >
        <StatCard label="本日の学習" value={`${summary.todayStudyCount}回`} />
        <StatCard
          label="学習済み文字"
          value={`${summary.learnedCount}/${summary.totalCharacters}`}
        />
        <StatCard
          label="正答率"
          value={summary.overallAccuracy === null ? '—' : `${summary.overallAccuracy}%`}
        />
        <StatCard label="連続学習" value={`${summary.streakDays}日`} />
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-teal-50">
      <p className="text-xs font-medium text-teal-700/70">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-teal-900">{value}</p>
    </div>
  )
}
