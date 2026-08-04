import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

const USEFUL_TOPICS = [
  {
    to: '/useful-info/dakuten',
    title: '濁点と半濁点',
    description:
      '「が」「ざ」「ぱ」など、文字に付く記号と音の変化について学びます。',
    examples: 'が　ざ　ぱ',
  },
] as const

/** 日本語学習に役立つ知識の一覧 */
export function UsefulInfoPage() {
  return (
    <Layout title="役立つ情報" showBack>
      <p className="text-sm leading-relaxed text-teal-800/80">
        ひらがなやカタカナを学ぶときに役立つ知識を紹介します。
        <br />
        知りたい内容を選んでください。
      </p>

      <div className="mt-5 grid gap-3">
        {USEFUL_TOPICS.map((topic) => (
          <Link
            key={topic.to}
            to={topic.to}
            className="flex min-h-28 items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-100 transition active:scale-[0.98]"
          >
            <span>
              <span className="block text-lg font-extrabold text-teal-900">
                {topic.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-teal-800/75">
                {topic.description}
              </span>
            </span>
            <span
              className="shrink-0 rounded-xl bg-teal-50 px-2 py-3 text-lg font-bold text-teal-700"
              aria-hidden="true"
            >
              {topic.examples}
            </span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
