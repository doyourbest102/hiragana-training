import type { Character, CharacterScript } from '../types'
import { HIRAGANA_CHARACTERS } from './hiragana'
import { KATAKANA_CHARACTERS } from './katakana'

export const ALL_CHARACTERS: Character[] = [
  ...HIRAGANA_CHARACTERS,
  ...KATAKANA_CHARACTERS,
]

/** URLなどの文字列が対応する文字種かを判定する */
export function isCharacterScript(value: string | undefined): value is CharacterScript {
  return value === 'hiragana' || value === 'katakana'
}

/** 文字種に属する清音46文字を五十音順で取得する */
export function getCharactersByScript(script: CharacterScript): Character[] {
  return script === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS
}

/** IDから文字を取得 */
export function getCharacterById(id: string): Character | undefined {
  return ALL_CHARACTERS.find((character) => character.id === id)
}

/** 五十音表の行順 */
export const ROW_ORDER: Character['row'][] = [
  'あ',
  'か',
  'さ',
  'た',
  'な',
  'は',
  'ま',
  'や',
  'ら',
  'わ',
]

/** 選択した文字種を行ごとにグループ化する */
export function groupByRow(
  script: CharacterScript,
): Record<Character['row'], Character[]> {
  const characters = getCharactersByScript(script)
  const groups = {} as Record<Character['row'], Character[]>
  for (const row of ROW_ORDER) {
    groups[row] = characters.filter((character) => character.row === row)
  }
  return groups
}
