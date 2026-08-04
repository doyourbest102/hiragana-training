import type { Character } from '../types'

/**
 * 清音46文字のデータ。
 * 濁音・半濁音・拗音を追加するときは、同じ形式で配列に足すだけでよい。
 */
export const HIRAGANA_CHARACTERS: Character[] = [
  // あ行
  { id: 'a', hiragana: 'あ', romaji: 'a', row: 'あ', category: 'seion' },
  { id: 'i', hiragana: 'い', romaji: 'i', row: 'あ', category: 'seion' },
  { id: 'u', hiragana: 'う', romaji: 'u', row: 'あ', category: 'seion' },
  { id: 'e', hiragana: 'え', romaji: 'e', row: 'あ', category: 'seion' },
  { id: 'o', hiragana: 'お', romaji: 'o', row: 'あ', category: 'seion' },
  // か行
  { id: 'ka', hiragana: 'か', romaji: 'ka', row: 'か', category: 'seion' },
  { id: 'ki', hiragana: 'き', romaji: 'ki', row: 'か', category: 'seion' },
  { id: 'ku', hiragana: 'く', romaji: 'ku', row: 'か', category: 'seion' },
  { id: 'ke', hiragana: 'け', romaji: 'ke', row: 'か', category: 'seion' },
  { id: 'ko', hiragana: 'こ', romaji: 'ko', row: 'か', category: 'seion' },
  // さ行
  { id: 'sa', hiragana: 'さ', romaji: 'sa', row: 'さ', category: 'seion' },
  { id: 'shi', hiragana: 'し', romaji: 'shi', row: 'さ', category: 'seion' },
  { id: 'su', hiragana: 'す', romaji: 'su', row: 'さ', category: 'seion' },
  { id: 'se', hiragana: 'せ', romaji: 'se', row: 'さ', category: 'seion' },
  { id: 'so', hiragana: 'そ', romaji: 'so', row: 'さ', category: 'seion' },
  // た行
  { id: 'ta', hiragana: 'た', romaji: 'ta', row: 'た', category: 'seion' },
  { id: 'chi', hiragana: 'ち', romaji: 'chi', row: 'た', category: 'seion' },
  { id: 'tsu', hiragana: 'つ', romaji: 'tsu', row: 'た', category: 'seion' },
  { id: 'te', hiragana: 'て', romaji: 'te', row: 'た', category: 'seion' },
  { id: 'to', hiragana: 'と', romaji: 'to', row: 'た', category: 'seion' },
  // な行
  { id: 'na', hiragana: 'な', romaji: 'na', row: 'な', category: 'seion' },
  { id: 'ni', hiragana: 'に', romaji: 'ni', row: 'な', category: 'seion' },
  { id: 'nu', hiragana: 'ぬ', romaji: 'nu', row: 'な', category: 'seion' },
  { id: 'ne', hiragana: 'ね', romaji: 'ne', row: 'な', category: 'seion' },
  { id: 'no', hiragana: 'の', romaji: 'no', row: 'な', category: 'seion' },
  // は行
  { id: 'ha', hiragana: 'は', romaji: 'ha', row: 'は', category: 'seion' },
  { id: 'hi', hiragana: 'ひ', romaji: 'hi', row: 'は', category: 'seion' },
  { id: 'fu', hiragana: 'ふ', romaji: 'fu', row: 'は', category: 'seion' },
  { id: 'he', hiragana: 'へ', romaji: 'he', row: 'は', category: 'seion' },
  { id: 'ho', hiragana: 'ほ', romaji: 'ho', row: 'は', category: 'seion' },
  // ま行
  { id: 'ma', hiragana: 'ま', romaji: 'ma', row: 'ま', category: 'seion' },
  { id: 'mi', hiragana: 'み', romaji: 'mi', row: 'ま', category: 'seion' },
  { id: 'mu', hiragana: 'む', romaji: 'mu', row: 'ま', category: 'seion' },
  { id: 'me', hiragana: 'め', romaji: 'me', row: 'ま', category: 'seion' },
  { id: 'mo', hiragana: 'も', romaji: 'mo', row: 'ま', category: 'seion' },
  // や行
  { id: 'ya', hiragana: 'や', romaji: 'ya', row: 'や', category: 'seion' },
  { id: 'yu', hiragana: 'ゆ', romaji: 'yu', row: 'や', category: 'seion' },
  { id: 'yo', hiragana: 'よ', romaji: 'yo', row: 'や', category: 'seion' },
  // ら行
  { id: 'ra', hiragana: 'ら', romaji: 'ra', row: 'ら', category: 'seion' },
  { id: 'ri', hiragana: 'り', romaji: 'ri', row: 'ら', category: 'seion' },
  { id: 'ru', hiragana: 'る', romaji: 'ru', row: 'ら', category: 'seion' },
  { id: 're', hiragana: 'れ', romaji: 're', row: 'ら', category: 'seion' },
  { id: 'ro', hiragana: 'ろ', romaji: 'ro', row: 'ら', category: 'seion' },
  // わ行
  { id: 'wa', hiragana: 'わ', romaji: 'wa', row: 'わ', category: 'seion' },
  { id: 'wo', hiragana: 'を', romaji: 'wo', row: 'わ', category: 'seion' },
  { id: 'n', hiragana: 'ん', romaji: 'n', row: 'わ', category: 'seion' },
]

/** IDから文字を取得 */
export function getCharacterById(id: string): Character | undefined {
  return HIRAGANA_CHARACTERS.find((c) => c.id === id)
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

/** 行ごとに文字をグループ化（五十音表表示用） */
export function groupByRow(): Record<Character['row'], Character[]> {
  const groups = {} as Record<Character['row'], Character[]>
  for (const row of ROW_ORDER) {
    groups[row] = HIRAGANA_CHARACTERS.filter((c) => c.row === row)
  }
  return groups
}
