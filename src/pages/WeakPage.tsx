import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { HIRAGANA_CHARACTERS } from '../data/hiragana'
import { useLearningStore } from '../store/LearningContext'
import type { StudyOptions } from '../types'

/** 苦手なひらがなだけを選んで練習する画面 */
export function WeakPage() {
  const navigate = useNavigate()
  const { getStatus } = useLearningStore()
  const weakCharacters = HIRAGANA_CHARACTERS.filter(
    (character) => getStatus(character.id) === '苦手',
  )

  return (
    <Layout title="취약 글자" showBack>
      {weakCharacters.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-lg font-bold text-teal-900">
            아직 취약 글자가 없습니다
          </p>
          <p className="mt-2 text-sm text-teal-800/75">
            테스트 결과에 따라 취약 글자가 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-teal-800/80">
            연습할 히라가나를 눌러 주세요.
          </p>
          <div
            className="grid grid-cols-5 gap-2"
            aria-label="취약 히라가나 목록"
          >
            {weakCharacters.map((character) => (
              <button
                key={character.id}
                type="button"
                onClick={() =>
                  navigate('/study', {
                    state: {
                      characterIds: [character.id],
                      source: 'weak',
                    } satisfies StudyOptions,
                  })
                }
                className="flex aspect-square min-h-12 items-center justify-center rounded-xl bg-orange-100 text-2xl font-extrabold text-orange-900 transition active:scale-95"
                aria-label={`${character.hiragana} 연습하기`}
              >
                {character.hiragana}
              </button>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
