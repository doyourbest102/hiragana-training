import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

const USEFUL_TOPICS = [
  {
    to: '/useful-info/dakuten',
    title: '탁음과 반탁음',
    description:
      '「が」「ざ」「ぱ」처럼 글자에 붙는 기호와 소리의 변화를 배웁니다.',
    examples: 'が　ざ　ぱ',
  },
] as const

/** 日本語学習に役立つ知識の一覧 */
export function UsefulInfoPage() {
  return (
    <Layout title="유용한 정보" showBack>
      <p className="text-sm leading-relaxed text-teal-800/80">
        히라가나와 가타카나를 배울 때 도움이 되는 내용을 소개합니다.
        <br />
        알고 싶은 내용을 선택해 주세요.
      </p>

      <div className="mt-5 grid gap-3">
        {USEFUL_TOPICS.map((topic) => (
          <Link
            key={topic.to}
            to={topic.to}
            className="flex min-h-28 items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-100 transition active:scale-[0.98]"
          >
            <span className="min-w-0">
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

      <Link
        to="/"
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-bold text-teal-800 ring-1 ring-teal-200"
      >
        홈으로 돌아가기
      </Link>
    </Layout>
  )
}
