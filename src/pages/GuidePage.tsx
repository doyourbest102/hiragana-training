import { Layout } from '../components/Layout'

/** 앱의 목적과 학습 방법을 안내하는 화면 */
export function GuidePage() {
  return (
    <Layout title="사용 방법" showBack>
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
        <h2 className="text-lg font-extrabold text-teal-900">앱의 목적</h2>
        <p className="mt-2 text-sm leading-relaxed text-teal-800/80">
          히라가나와 가타카나의 쓰기 순서를 확인하고 반복해서 쓰며 익히는 학습
          앱입니다. 글자별 연습 기록을 확인하고 직접 학습 완료 상태를 관리할 수
          있습니다.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-base font-extrabold text-teal-900">추천 학습 순서</h2>
        <ol className="mt-2 space-y-2 text-sm text-teal-800">
          <GuideStep number={1} text="학습 모드에서 문자 종류를 선택합니다." />
          <GuideStep
            number={2}
            text="쓰기 순서를 확인하고 캔버스에 5번 씁니다."
          />
          <GuideStep
            number={3}
            text="학습 기록에서 연습 횟수와 쓰기 횟수를 확인합니다."
          />
          <GuideStep
            number={4}
            text="익힌 글자는 학습 완료로 설정할 수 있습니다."
          />
        </ol>
      </section>

      <section className="mt-5 space-y-3" aria-label="기능별 사용 방법">
        <GuideCard title="학습 모드">
          히라가나 또는 가타카나를 선택하면 쓰기 순서 애니메이션이 재생됩니다.
          캔버스에 한 번 쓸 때마다 &quot;다시 쓰기&quot;를 누르고, 5번 연습하면
          다음 글자로 이동할 수 있습니다.
        </GuideCard>
        <GuideCard title="학습 기록">
          글자별 학습 횟수와 쓰기 횟수를 확인할 수 있습니다. 익혔다고 판단한
          글자는 &quot;학습 완료로 설정&quot;을 누르고, 필요하면 언제든 취소할
          수 있습니다. 기록은 현재 기기의 브라우저에 저장됩니다.
        </GuideCard>
      </section>
    </Layout>
  )
}

function GuideStep({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex gap-3 rounded-xl bg-teal-50 p-3">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <span className="pt-1 leading-relaxed">{text}</span>
    </li>
  )
}

function GuideCard({
  title,
  children,
}: {
  title: string
  children: string
}) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
      <h3 className="font-bold text-teal-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-teal-800/80">{children}</p>
    </article>
  )
}
