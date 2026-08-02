import { Layout } from '../components/Layout'

/** 앱의 목적과 학습 방법을 안내하는 화면 */
export function GuidePage() {
  return (
    <Layout title="사용 방법" showBack>
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-teal-50">
        <h2 className="text-lg font-extrabold text-teal-900">앱의 목적</h2>
        <p className="mt-2 text-sm leading-relaxed text-teal-800/80">
          히라가나를 쓰고 들으며 익히는 학습 앱입니다. 쓰기 순서를 확인하고
          반복해서 쓴 다음, 소리 테스트로 기억했는지 확인할 수 있습니다.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-base font-extrabold text-teal-900">추천 학습 순서</h2>
        <ol className="mt-2 space-y-2 text-sm text-teal-800">
          <GuideStep number={1} text="학습 모드에서 연습할 글자를 선택합니다." />
          <GuideStep
            number={2}
            text="쓰기 순서와 소리를 확인하고, 캔버스에 5번 씁니다."
          />
          <GuideStep number={3} text="테스트 모드에서 들은 글자를 선택합니다." />
          <GuideStep
            number={4}
            text="취약 글자를 다시 연습하고 학습 기록을 확인합니다."
          />
        </ol>
      </section>

      <section className="mt-5 space-y-3" aria-label="기능별 사용 방법">
        <GuideCard title="학습 모드">
          히라가나를 선택하면 쓰기 순서 애니메이션이 재생됩니다. 소리 듣기
          버튼으로 발음을 확인한 뒤 캔버스에 써 보세요. 한 번 쓸 때마다
          &quot;다시 쓰기&quot;를 누르고, 5번 연습하면 완료할 수 있습니다.
        </GuideCard>
        <GuideCard title="테스트 모드">
          재생되는 소리를 듣고 네 개의 히라가나 중 정답을 선택합니다. 자동
          재생이 되지 않으면 소리 듣기 버튼을 눌러 주세요.
        </GuideCard>
        <GuideCard title="취약 글자 연습">
          테스트에서 자주 틀린 글자만 모아서 다시 쓰기 연습을 할 수 있습니다.
        </GuideCard>
        <GuideCard title="학습 기록">
          글자별 학습 횟수, 쓰기 횟수와 테스트 결과를 확인할 수 있습니다.
          학습 기록은 현재 기기의 브라우저에 저장됩니다.
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
