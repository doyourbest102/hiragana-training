import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

/** 学習する文字種を選ぶ画面 */
export function ScriptSelectPage() {
  return (
    <Layout title="문자를 선택해 주세요" showBack>
      <p className="text-center text-sm text-teal-800/80">
        연습할 문자 종류를 선택하세요.
      </p>
      <div className="mt-6 grid gap-4">
        <ScriptButton
          to="/study/hiragana"
          label="히라가나"
          examples="あ か さ"
        />
        <ScriptButton
          to="/study/katakana"
          label="가타카나"
          examples="ア カ サ"
        />
      </div>
    </Layout>
  )
}

function ScriptButton({
  to,
  label,
  examples,
}: {
  to: string
  label: string
  examples: string
}) {
  return (
    <Link
      to={to}
      className="flex min-h-24 flex-col items-center justify-center rounded-2xl bg-white px-4 py-5 text-teal-900 shadow-sm ring-1 ring-teal-100 transition active:scale-[0.98]"
    >
      <span className="text-xl font-extrabold">{label}</span>
      <span className="mt-2 text-2xl tracking-widest text-teal-700" aria-hidden="true">
        {examples}
      </span>
    </Link>
  )
}
