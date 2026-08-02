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
        <p className="text-sm font-medium tracking-wide text-teal-600">쓰고 들으며 익히기</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight text-teal-900 sm:text-5xl">
          히라가나
          <br />
          트레이닝
        </h1>
        <p className="mt-3 text-base text-teal-800/75">
          기본음 {HIRAGANA_CHARACTERS.length}글자를 즐겁게 마스터
        </p>
      </header>

      {/* メイン導線 */}
      <nav className="flex flex-col gap-3" aria-label="학습 메뉴">
        <Link
          to="/study"
          className="flex h-14 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white shadow-md transition active:scale-[0.98]"
        >
          학습 모드
        </Link>
        <Link
          to="/test"
          className="flex h-14 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-amber-950 shadow-md transition active:scale-[0.98]"
        >
          테스트 모드
        </Link>
        <Link
          to="/progress"
          className="flex h-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-teal-800 shadow-sm ring-1 ring-teal-100 transition active:scale-[0.98]"
        >
          학습 기록
        </Link>
        <Link
          to="/weak"
          className="flex h-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-900 shadow-sm ring-1 ring-orange-200 transition active:scale-[0.98]"
        >
          취약 글자 연습
        </Link>
      </nav>

      {/* 学習サマリー */}
      <section
        className="mt-8 grid grid-cols-2 gap-3"
        aria-label="오늘의 학습 현황"
      >
        <StatCard label="오늘의 학습" value={`${summary.todayStudyCount}회`} />
        <StatCard
          label="학습한 글자"
          value={`${summary.learnedCount}/${summary.totalCharacters}`}
        />
        <StatCard
          label="정답률"
          value={summary.overallAccuracy === null ? '—' : `${summary.overallAccuracy}%`}
        />
        <StatCard label="연속 학습" value={`${summary.streakDays}일`} />
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
