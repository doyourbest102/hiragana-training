import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { getCharacterById } from '../data/hiragana'
import type { TestResult } from '../types'

/** テスト結果画面 */
export function TestResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state as TestResult | null

  // 直接URLで来た場合はホームへ
  if (!result) {
    return (
      <Layout title="テスト結果" showBack>
        <p className="text-center text-teal-800">結果データがありません。</p>
        <Link
          to="/test"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white"
        >
          テストを始める
        </Link>
      </Layout>
    )
  }

  const accuracy = Math.round((result.correct / result.total) * 100)
  const wrongChars = result.wrongIds
    .map((id) => getCharacterById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <Layout title="テスト結果" showBack backTo="/">
      <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-teal-50">
        <p className="text-sm text-teal-700">正答率</p>
        <p className="mt-1 text-5xl font-extrabold text-teal-900">{accuracy}%</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-emerald-700">正解</p>
            <p className="text-2xl font-bold text-emerald-800">{result.correct}</p>
          </div>
          <div className="rounded-xl bg-red-50 p-3">
            <p className="text-red-700">不正解</p>
            <p className="text-2xl font-bold text-red-800">{result.incorrect}</p>
          </div>
        </div>
      </div>

      <section className="mt-6" aria-label="間違えたひらがな">
        <h2 className="text-base font-bold text-teal-900">間違えたひらがな</h2>
        {wrongChars.length === 0 ? (
          <p className="mt-2 rounded-xl bg-emerald-50 p-4 text-center text-emerald-800">
            全問正解です！すばらしい！
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {wrongChars.map((c) => (
              <li
                key={c.id}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-2xl font-bold text-orange-900 ring-1 ring-orange-200"
              >
                {c.hiragana}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-3">
        {wrongChars.length > 0 && (
          <button
            type="button"
            onClick={() =>
              navigate('/study', {
                state: {
                  characterIds: result.wrongIds,
                  source: 'wrong',
                },
              })
            }
            className="flex h-12 items-center justify-center rounded-xl bg-amber-400 font-bold text-amber-950"
          >
            間違えた文字を勉強する
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/test')}
          className="flex h-12 items-center justify-center rounded-xl bg-teal-600 font-bold text-white"
        >
          もう一度テストする
        </button>
        <Link
          to="/"
          className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-teal-800 ring-1 ring-teal-100"
        >
          ホームに戻る
        </Link>
      </div>
    </Layout>
  )
}
