import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

const FAQS = [
  {
    question: '학습 기록은 어디에 저장되나요?',
    answer:
      '사용 중인 기기의 브라우저에 자동으로 저장돼요. 브라우저 데이터를 삭제하거나 다른 기기를 사용하면 기록이 이어지지 않을 수 있어요.',
  },
  {
    question: '・, △, ◎는 무엇인가요?',
    answer:
      '각 글자의 학습 상태예요. ・는 미습득, △는 학습 중, ◎는 습득 완료를 뜻해요. 학습 기록 화면에서 글자를 누르면 상태를 바꿀 수 있어요.',
  },
  {
    question: '잘못 썼을 때는 어떻게 하나요?',
    answer:
      '쓰기 화면의 다시 쓰기 버튼을 누르면 현재 글자를 처음부터 다시 쓸 수 있어요.',
  },
  {
    question: '학습 기록을 처음부터 다시 시작할 수 있나요?',
    answer:
      '학습 기록 화면의 기록 초기화를 누르고 확인하면 모든 상태를 처음으로 되돌릴 수 있어요.',
  },
  {
    question: '탁음과 반탁음 설명은 어디에 있나요?',
    answer:
      '홈 화면에서 유용한 정보를 누른 다음, 탁음과 반탁음을 선택하면 볼 수 있어요.',
  },
] as const

/** 앱의 기능을 처음부터 순서대로 안내하는 화면 */
export function GuidePage() {
  return (
    <Layout title="사용 방법" showBack>
      <section className="rounded-2xl bg-teal-600 p-4 text-white shadow-sm">
        <h2 className="text-lg font-extrabold">처음 사용해도 괜찮아요!</h2>
        <p className="mt-1 text-sm leading-relaxed text-teal-50">
          아래 순서대로 따라 하면 바로 글자 연습을 시작할 수 있어요.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-extrabold text-teal-900">학습하는 방법</h2>
        <ol className="mt-3 space-y-3">
          <GuideStep
            number={1}
            title="학습 모드를 선택해요"
            description="홈 화면에서 학습 모드를 누른 다음, 히라가나 또는 가타카나를 선택해요."
            flow="학습 모드 → 히라가나 / 가타카나"
          />
          <GuideStep
            number={2}
            title="연습할 글자를 눌러요"
            description="글자표에서 연습하고 싶은 글자를 누르면 쓰기 연습 화면으로 이동해요."
            flow="글자표 → あ 또는 ア"
          />
          <GuideStep
            number={3}
            title="글자를 5번 써요"
            description={
              <>
                화면의 안내선을 보며 손가락으로 따라 써요. 잘못 썼다면{' '}
                <strong>다시 쓰기</strong>를 눌러요. 5번 쓰고{' '}
                <strong>다음</strong>을 누르면 다음 글자로 이동해요.
              </>
            }
            flow="5번 쓰기 → 다음"
          />
          <GuideStep
            number={4}
            title="학습 기록을 확인해요"
            description="학습 기록의 글자를 누르면 상태가 미습득 → 학습 중 → 습득 완료 → 미습득 순서로 바뀌어요."
          >
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs font-bold">
              <span className="rounded-lg bg-slate-100 px-1 py-2 text-slate-700">
                ・ 미습득
              </span>
              <span className="rounded-lg bg-amber-100 px-1 py-2 text-amber-800">
                △ 학습 중
              </span>
              <span className="rounded-lg bg-sky-100 px-1 py-2 text-sky-800">
                ◎ 습득 완료
              </span>
            </div>
          </GuideStep>
          <GuideStep
            number={5}
            title="유용한 정보도 확인해요"
            description="홈 화면의 유용한 정보에서는 일본어 학습에 필요한 기초 지식을 쉽게 확인할 수 있어요."
          >
            <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-teal-100">
              <h3 className="text-sm font-bold text-teal-900">
                현재 볼 수 있는 내용: 탁음과 반탁음
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-teal-800/80">
                「が」「ざ」「ぱ」처럼 기호가 붙으면 글자와 소리가 어떻게
                달라지는지 배울 수 있어요.
              </p>
            </div>
          </GuideStep>
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-extrabold text-teal-900">자주 묻는 질문</h2>
        <div className="mt-3 space-y-2">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </section>

      <aside className="mt-5 rounded-r-xl border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        학습 내용은 이 기기에 자동으로 저장돼요. 같은 기기와 브라우저에서 계속
        학습해 주세요.
      </aside>

      <Link
        to="/"
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-teal-600 px-4 font-bold text-white shadow-sm"
      >
        홈으로 돌아가기
      </Link>
    </Layout>
  )
}

function GuideStep({
  number,
  title,
  description,
  flow,
  children,
}: {
  number: number
  title: string
  description: ReactNode
  flow?: string
  children?: ReactNode
}) {
  return (
    <li className="flex gap-3 rounded-2xl bg-teal-50 p-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold text-teal-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-teal-800">
          {description}
        </p>
        {flow && (
          <p className="mt-2 rounded-lg bg-white px-2 py-1.5 text-center text-xs font-bold text-teal-700 ring-1 ring-teal-100">
            {flow}
          </p>
        )}
        {children}
      </div>
    </li>
  )
}

function FaqItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string
  answer: string
  defaultOpen: boolean
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-xl bg-white ring-1 ring-teal-100"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-bold text-teal-900">
        <span>{question}</span>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-lg text-teal-700"
          aria-hidden="true"
        >
          <span className="group-open:hidden">＋</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <p className="border-t border-teal-50 px-3 py-3 text-sm leading-relaxed text-teal-800/80">
        {answer}
      </p>
    </details>
  )
}
