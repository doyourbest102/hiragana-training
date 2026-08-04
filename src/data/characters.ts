import type { Character, CharacterScript } from '../types'
import { HIRAGANA_CHARACTERS } from './hiragana'
import { KATAKANA_CHARACTERS } from './katakana'

export const ALL_CHARACTERS: Character[] = [
  ...HIRAGANA_CHARACTERS,
  ...KATAKANA_CHARACTERS,
]

export function isCharacterScript(
  value: string | undefined,
): value is CharacterScript {
  return value === 'hiragana' || value === 'katakana'
}

export function getCharactersByScript(script: CharacterScript): Character[] {
  return script === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS
}

export function getCharacterById(id: string): Character | undefined {
  return ALL_CHARACTERS.find((character) => character.id === id)
}

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
