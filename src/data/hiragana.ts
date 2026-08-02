import type { Character } from '../types'

/**
 * 清音46文字のデータ。
 * 濁音・半濁音・拗音を追加するときは、同じ形式で配列に足すだけでよい。
 */
export const HIRAGANA_CHARACTERS: Character[] = [
  // あ行
  { id: 'a', hiragana: 'あ', romaji: 'a', row: 'あ', speechText: 'あ', category: 'seion' },
  { id: 'i', hiragana: 'い', romaji: 'i', row: 'あ', speechText: 'い', category: 'seion' },
  { id: 'u', hiragana: 'う', romaji: 'u', row: 'あ', speechText: 'う', category: 'seion' },
  { id: 'e', hiragana: 'え', romaji: 'e', row: 'あ', speechText: 'え', category: 'seion' },
  { id: 'o', hiragana: 'お', romaji: 'o', row: 'あ', speechText: 'お', category: 'seion' },
  // か行
  { id: 'ka', hiragana: 'か', romaji: 'ka', row: 'か', speechText: 'か', category: 'seion' },
  { id: 'ki', hiragana: 'き', romaji: 'ki', row: 'か', speechText: 'き', category: 'seion' },
  { id: 'ku', hiragana: 'く', romaji: 'ku', row: 'か', speechText: 'く', category: 'seion' },
  { id: 'ke', hiragana: 'け', romaji: 'ke', row: 'か', speechText: 'け', category: 'seion' },
  { id: 'ko', hiragana: 'こ', romaji: 'ko', row: 'か', speechText: 'こ', category: 'seion' },
  // さ行
  { id: 'sa', hiragana: 'さ', romaji: 'sa', row: 'さ', speechText: 'さ', category: 'seion' },
  { id: 'shi', hiragana: 'し', romaji: 'shi', row: 'さ', speechText: 'し', category: 'seion' },
  { id: 'su', hiragana: 'す', romaji: 'su', row: 'さ', speechText: 'す', category: 'seion' },
  { id: 'se', hiragana: 'せ', romaji: 'se', row: 'さ', speechText: 'せ', category: 'seion' },
  { id: 'so', hiragana: 'そ', romaji: 'so', row: 'さ', speechText: 'そ', category: 'seion' },
  // た行
  { id: 'ta', hiragana: 'た', romaji: 'ta', row: 'た', speechText: 'た', category: 'seion' },
  { id: 'chi', hiragana: 'ち', romaji: 'chi', row: 'た', speechText: 'ち', category: 'seion' },
  { id: 'tsu', hiragana: 'つ', romaji: 'tsu', row: 'た', speechText: 'つ', category: 'seion' },
  { id: 'te', hiragana: 'て', romaji: 'te', row: 'た', speechText: 'て', category: 'seion' },
  { id: 'to', hiragana: 'と', romaji: 'to', row: 'た', speechText: 'と', category: 'seion' },
  // な行
  { id: 'na', hiragana: 'な', romaji: 'na', row: 'な', speechText: 'な', category: 'seion' },
  { id: 'ni', hiragana: 'に', romaji: 'ni', row: 'な', speechText: 'に', category: 'seion' },
  { id: 'nu', hiragana: 'ぬ', romaji: 'nu', row: 'な', speechText: 'ぬ', category: 'seion' },
  { id: 'ne', hiragana: 'ね', romaji: 'ne', row: 'な', speechText: 'ね', category: 'seion' },
  { id: 'no', hiragana: 'の', romaji: 'no', row: 'な', speechText: 'の', category: 'seion' },
  // は行
  { id: 'ha', hiragana: 'は', romaji: 'ha', row: 'は', speechText: 'は', category: 'seion' },
  { id: 'hi', hiragana: 'ひ', romaji: 'hi', row: 'は', speechText: 'ひ', category: 'seion' },
  { id: 'fu', hiragana: 'ふ', romaji: 'fu', row: 'は', speechText: 'ふ', category: 'seion' },
  { id: 'he', hiragana: 'へ', romaji: 'he', row: 'は', speechText: 'へ', category: 'seion' },
  { id: 'ho', hiragana: 'ほ', romaji: 'ho', row: 'は', speechText: 'ほ', category: 'seion' },
  // ま行
  { id: 'ma', hiragana: 'ま', romaji: 'ma', row: 'ま', speechText: 'ま', category: 'seion' },
  { id: 'mi', hiragana: 'み', romaji: 'mi', row: 'ま', speechText: 'み', category: 'seion' },
  { id: 'mu', hiragana: 'む', romaji: 'mu', row: 'ま', speechText: 'む', category: 'seion' },
  { id: 'me', hiragana: 'め', romaji: 'me', row: 'ま', speechText: 'め', category: 'seion' },
  { id: 'mo', hiragana: 'も', romaji: 'mo', row: 'ま', speechText: 'も', category: 'seion' },
  // や行
  { id: 'ya', hiragana: 'や', romaji: 'ya', row: 'や', speechText: 'や', category: 'seion' },
  { id: 'yu', hiragana: 'ゆ', romaji: 'yu', row: 'や', speechText: 'ゆ', category: 'seion' },
  { id: 'yo', hiragana: 'よ', romaji: 'yo', row: 'や', speechText: 'よ', category: 'seion' },
  // ら行
  { id: 'ra', hiragana: 'ら', romaji: 'ra', row: 'ら', speechText: 'ら', category: 'seion' },
  { id: 'ri', hiragana: 'り', romaji: 'ri', row: 'ら', speechText: 'り', category: 'seion' },
  { id: 'ru', hiragana: 'る', romaji: 'ru', row: 'ら', speechText: 'る', category: 'seion' },
  { id: 're', hiragana: 'れ', romaji: 're', row: 'ら', speechText: 'れ', category: 'seion' },
  { id: 'ro', hiragana: 'ろ', romaji: 'ro', row: 'ら', speechText: 'ろ', category: 'seion' },
  // わ行
  { id: 'wa', hiragana: 'わ', romaji: 'wa', row: 'わ', speechText: 'わ', category: 'seion' },
  { id: 'wo', hiragana: 'を', romaji: 'wo', row: 'わ', speechText: 'を', category: 'seion' },
  { id: 'n', hiragana: 'ん', romaji: 'n', row: 'わ', speechText: 'ん', category: 'seion' },
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
