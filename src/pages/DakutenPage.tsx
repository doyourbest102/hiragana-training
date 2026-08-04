import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

const DAKUTEN_GROUPS = [
  {
    title: 'か行からが行',
    changes: [
      ['か', 'が'],
      ['き', 'ぎ'],
      ['く', 'ぐ'],
      ['け', 'げ'],
      ['こ', 'ご'],
    ],
  },
  {
    title: 'さ行からざ行',
    changes: [
      ['さ', 'ざ'],
      ['し', 'じ'],
      ['す', 'ず'],
      ['せ', 'ぜ'],
      ['そ', 'ぞ'],
    ],
  },
  {
    title: 'た行からだ行',
    changes: [
      ['た', 'だ'],
      ['ち', 'ぢ'],
      ['つ', 'づ'],
      ['て', 'で'],
      ['と', 'ど'],
    ],
  },
  {
    title: 'は行からば行',
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
    <Layout title="濁点と半濁点" showBack backTo="/useful-info">
      <nav className="mb-3 text-xs text-teal-700" aria-label="パンくず">
        <Link to="/useful-info" className="underline">
          役立つ情報
        </Link>
        <span aria-hidden="true"> ＞ </span>
        <span>濁点と半濁点</span>
      </nav>

      <section className="rounded-2xl bg-teal-50 p-4 text-sm leading-relaxed text-teal-900">
        <p>ひらがなの右上に「てんてん」や「まる」を付けると、音が変わります。</p>
        <p className="mt-2 font-bold">順番に見てみましょう。</p>
      </section>

      <div className="mt-4 space-y-4">
        <StepSection number={1} title="2つの記号を覚えよう">
          <div className="grid grid-cols-2 gap-2">
            <SymbolCard title="濁点（だくてん）" symbol="゛" description="てんてん" />
            <SymbolCard
              title="半濁点（はんだくてん）"
              symbol="゜"
              description="小さなまる"
            />
          </div>
          <div className="mt-3 grid gap-2 text-center text-xl font-extrabold text-teal-900">
            <p className="rounded-xl bg-teal-50 p-3">か ＋ ゛ ＝ が</p>
            <p className="rounded-xl bg-teal-50 p-3">は ＋ ゜ ＝ ぱ</p>
          </div>
        </StepSection>

        <StepSection number={2} title="濁点「゛」を付けてみよう">
          <p className="text-sm leading-relaxed text-teal-800">
            濁点は、か行・さ行・た行・は行に付きます。
          </p>
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

        <StepSection number={3} title="半濁点「゜」を付けてみよう">
          <div className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <strong className="block text-base">半濁点を付けられるのは、は行だけです。</strong>
            <span className="mt-1 block">「ぱ・ぴ・ぷ・ぺ・ぽ」の音になります。</span>
          </div>
          <div className="mt-3">
            <ChangeGroup title="は行からぱ行" changes={HANDAKUTEN_CHANGES} />
          </div>
        </StepSection>

        <StepSection number={4} title="間違えやすい文字">
          <div className="space-y-2 text-sm leading-relaxed text-teal-800">
            <p>「じ」と「ぢ」、「ず」と「づ」は、同じように聞こえることがあります。</p>
            <p>使う文字は言葉によって決まります。</p>
            <p className="font-bold text-teal-900">
              今すぐ完全に使い分けられなくても大丈夫です。まずは、形が違うことを覚えましょう。
            </p>
          </div>
        </StepSection>
      </div>

      <section className="mt-4 rounded-2xl bg-teal-700 p-4 text-white shadow-sm">
        <h2 className="text-lg font-extrabold">これだけ覚えよう</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed">
          <p>
            <strong>゛は濁点です。</strong>
            <br />
            か・さ・た・は行に付き、が・ざ・だ・ば行になります。
          </p>
          <p>
            <strong>゜は半濁点です。</strong>
            <br />
            は行だけに付き、ぱ行になります。
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-100">
        <h2 className="text-lg font-extrabold text-teal-900">発音も聞いてみよう</h2>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-teal-800">
          <p>
            濁点と半濁点は、文字を見るだけでなく、実際の音を聞くと覚えやすくなります。
          </p>
          <p>
            YouTubeなどで「日本語 濁点 半濁点
            発音」と検索して、日本語学習動画の発音も参考にしてみましょう。
          </p>
          <p className="text-xs text-teal-700/80">
            動画を選ぶときは、文字と口の動きが一緒に表示されるものがおすすめです。
          </p>
        </div>
      </section>

      <Link
        to="/useful-info"
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-bold text-teal-800 ring-1 ring-teal-200"
      >
        役立つ情報に戻る
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
            aria-label={`${before}から${after}`}
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
