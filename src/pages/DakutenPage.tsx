import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

const DAKUTEN_GROUPS = [
  {
    title: 'か행 → が행',
    changes: [
      ['か', 'が'],
      ['き', 'ぎ'],
      ['く', 'ぐ'],
      ['け', 'げ'],
      ['こ', 'ご'],
    ],
  },
  {
    title: 'さ행 → ざ행',
    changes: [
      ['さ', 'ざ'],
      ['し', 'じ'],
      ['す', 'ず'],
      ['せ', 'ぜ'],
      ['そ', 'ぞ'],
    ],
  },
  {
    title: 'た행 → だ행',
    changes: [
      ['た', 'だ'],
      ['ち', 'ぢ'],
      ['つ', 'づ'],
      ['て', 'で'],
      ['と', 'ど'],
    ],
  },
  {
    title: 'は행 → ば행',
    changes: [
      ['は', 'ば'],
      ['ひ', 'び'],
      ['ふ', 'ぶ'],
      ['へ', 'べ'],
      ['ほ', 'ぼ'],
    ],
  },
] as const

const HANDAKUTEN_CHANGES = [
  ['は', 'ぱ'],
  ['ひ', 'ぴ'],
  ['ふ', 'ぷ'],
  ['へ', 'ぺ'],
  ['ほ', 'ぽ'],
] as const

/** 初心者向けの濁点・半濁点解説 */
export function DakutenPage() {
  return (
    <Layout title="탁음과 반탁음" showBack backTo="/useful-info">
      <nav className="mb-3 text-xs text-teal-700" aria-label="현재 위치">
        <Link to="/useful-info" className="underline">
          유용한 정보
        </Link>
        <span aria-hidden="true"> ＞ </span>
        <span>탁음과 반탁음</span>
      </nav>

      <section className="rounded-2xl bg-teal-50 p-4 text-sm leading-relaxed text-teal-900">
        <p>
          히라가나 오른쪽 위에 「점 두 개」나 「작은 동그라미」를 붙이면 소리가
          바뀝니다.
        </p>
        <p className="mt-2 font-bold">차례대로 알아봅시다.</p>
      </section>

      <div className="mt-4 space-y-4">
        <StepSection number={1} title="두 가지 기호를 배워 봅시다">
          <div className="grid grid-cols-2 gap-2">
            <SymbolCard
              title="탁점（だくてん）"
              symbol="゛"
              description="점 두 개"
            />
            <SymbolCard
              title="반탁점（はんだくてん）"
              symbol="゜"
              description="작은 동그라미"
            />
          </div>
          <div className="mt-3 grid gap-2 text-center text-xl font-extrabold text-teal-900">
            <p className="rounded-xl bg-teal-50 p-3">か ＋ ゛ ＝ が</p>
            <p className="rounded-xl bg-teal-50 p-3">は ＋ ゜ ＝ ぱ</p>
          </div>
          <p className="mt-3 text-sm text-teal-800">
            탁점과 반탁점은 글자의 오른쪽 위에 붙습니다.
          </p>
        </StepSection>

        <StepSection number={2} title="탁점 「゛」을 붙여 봅시다">
          <div className="space-y-1 text-sm leading-relaxed text-teal-800">
            <p>탁점은 か행, さ행, た행, は행에 붙습니다.</p>
            <p>탁점이 붙으면 소리가 탁하게 바뀝니다.</p>
          </div>
          <div className="mt-3 space-y-3">
            {DAKUTEN_GROUPS.map((group) => (
              <ChangeGroup
                key={group.title}
                title={group.title}
                changes={group.changes}
              />
            ))}
          </div>
        </StepSection>

        <StepSection number={3} title="반탁점 「゜」을 붙여 봅시다">
          <div className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <strong className="block text-base">
              반탁점은 は행에만 붙습니다.
            </strong>
            <span className="mt-1 block">
              반탁점이 붙으면 「ぱ・ぴ・ぷ・ぺ・ぽ」 소리로 바뀝니다.
            </span>
          </div>
          <div className="mt-3">
            <ChangeGroup title="は행 → ぱ행" changes={HANDAKUTEN_CHANGES} />
          </div>
        </StepSection>

        <StepSection number={4} title="헷갈리기 쉬운 글자">
          <div className="space-y-2 text-sm leading-relaxed text-teal-800">
            <p>「じ」와 「ぢ」, 「ず」와 「づ」는 비슷하게 들릴 수 있습니다.</p>
            <p>어떤 글자를 쓰는지는 단어에 따라 정해집니다.</p>
            <p className="font-bold text-teal-900">
              처음에는 모양이 다르다는 것만 기억해도 괜찮습니다.
            </p>
          </div>
        </StepSection>
      </div>

      <section className="mt-4 rounded-2xl bg-teal-700 p-4 text-white shadow-sm">
        <h2 className="text-lg font-extrabold">이것만 기억해요</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed">
          <p>
            <strong>゛는 탁점입니다.</strong>
            <br />
            か・さ・た・は행에 붙어
            <br />
            が・ざ・だ・ば행이 됩니다.
          </p>
          <p>
            <strong>゜는 반탁점입니다.</strong>
            <br />
            は행에만 붙어 ぱ행이 됩니다.
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-100">
        <h2 className="text-lg font-extrabold text-teal-900">발음도 들어 봅시다</h2>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-teal-800">
          <p>
            탁음과 반탁음은 글자만 보는 것보다 실제 소리를 함께 들으면 더 쉽게
            기억할 수 있습니다.
          </p>
          <p>
            YouTube 등에서 「일본어 탁음 반탁음 발음」을 검색해 일본어 학습
            영상의 발음도 참고해 보세요.
          </p>
          <p className="text-xs text-teal-700/80">
            글자와 입 모양이 함께 나오는 영상을 보면 발음을 이해하는 데 도움이
            됩니다.
          </p>
        </div>
      </section>

      <Link
        to="/useful-info"
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-bold text-teal-800 ring-1 ring-teal-200"
      >
        유용한 정보로 돌아가기
      </Link>
    </Layout>
  )
}

function StepSection({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-100">
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-teal-900">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          {number}
        </span>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

function SymbolCard({
  title,
  symbol,
  description,
}: {
  title: string
  symbol: string
  description: string
}) {
  return (
    <article className="min-w-0 rounded-xl bg-teal-50 p-3 text-center">
      <h3 className="text-xs font-bold leading-snug text-teal-900">{title}</h3>
      <p className="mt-1 text-5xl font-extrabold leading-none text-teal-700">
        {symbol}
      </p>
      <p className="mt-2 text-xs text-teal-800">{description}</p>
    </article>
  )
}

function ChangeGroup({
  title,
  changes,
}: {
  title: string
  changes: readonly (readonly [string, string])[]
}) {
  return (
    <section>
      <h3 className="mb-1 text-xs font-bold text-teal-700">{title}</h3>
      <div className="grid grid-cols-5 gap-1">
        {changes.map(([before, after]) => (
          <div
            key={`${before}-${after}`}
            className="min-w-0 rounded-xl bg-teal-50 px-1 py-2 text-center"
            aria-label={`${before}에서 ${after}로 변화`}
          >
            <span className="block text-lg font-bold text-teal-800">{before}</span>
            <span className="block text-xs text-teal-500" aria-hidden="true">
              ↓
            </span>
            <span className="block text-2xl font-extrabold text-teal-900">{after}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
