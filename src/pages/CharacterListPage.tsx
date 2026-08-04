import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { StatusBadge, STATUS_STYLES } from '../components/StatusBadge'
import {
  getCharactersByScript,
  groupByRow,
  isCharacterScript,
} from '../data/characters'
import { useLearningStore } from '../store/LearningContext'

/** ひらがな・カタカナ共通の五十音文字一覧 */
export function CharacterListPage() {
  const navigate = useNavigate()
  const { script: scriptParam } = useParams()
  const { getProgress, getStatus } = useLearningStore()

  if (!isCharacterScript(scriptParam)) {
    return <Navigate to="/study" replace />
  }

  const characters = getCharactersByScript(scriptParam)
  const rows = groupByRow(scriptParam)
  const scriptLabel = scriptParam === 'hiragana' ? '히라가나' : '가타카나'

  return (
    <Layout title={`${scriptLabel} 글자 선택`} showBack backTo="/study">
      <p className="mb-4 text-sm text-teal-800/80">
        연습을 시작할 글자를 선택하세요. 선택한 글자부터 순서대로 연습합니다.
      </p>

      <div className="space-y-3" aria-label={`${scriptLabel} 표`}>
        {Object.entries(rows).map(([row, rowCharacters]) => (
          <section key={row} aria-labelledby={`${scriptParam}-row-${row}`}>
            <h2
              id={`${scriptParam}-row-${row}`}
              className="mb-1 text-xs font-bold text-teal-700"
            >
              {row}행
            </h2>
            <div className="grid grid-cols-5 gap-1.5">
              {rowCharacters.map((character) => {
                const progress = getProgress(character.id)
                const status = getStatus(character.id)
                const style = STATUS_STYLES[status]
                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() =>
                      navigate(`/study/${scriptParam}/${character.id}`)
                    }
                    className={`flex min-h-20 flex-col items-center justify-center rounded-xl p-1 ${style.bg} shadow-sm transition active:scale-95`}
                    aria-label={`${character.character}, ${style.label}, 쓰기 ${progress.writeCount}회, 연습 시작`}
                  >
                    <span className="text-2xl font-extrabold leading-none">
                      {character.character}
                    </span>
                    <span className="mt-1 flex items-center gap-1">
                      <StatusBadge status={status} compact />
                      <span className="text-[9px] font-bold">
                        {progress.writeCount}회
                      </span>
                    </span>
                  </button>
                )
              })}
              {Array.from({ length: 5 - rowCharacters.length }).map((_, i) => (
                <div
                  key={`empty-${row}-${i}`}
                  className="opacity-0"
                  aria-hidden="true"
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="sr-only">{characters.length}글자</p>
    </Layout>
  )
}
