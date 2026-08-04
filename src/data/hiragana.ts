import type { Character } from '../types'

/**
 * 清音46文字のデータ。
 * 濁音・半濁音・拗音を追加するときは、同じ形式で配列に足すだけでよい。
 */
export const HIRAGANA_CHARACTERS: Character[] = [
  // あ行
  { id: 'a', hiragana: 'あ', koreanReading: '아', row: 'あ', category: 'seion' },
  { id: 'i', hiragana: 'い', koreanReading: '이', row: 'あ', category: 'seion' },
  { id: 'u', hiragana: 'う', koreanReading: '우', row: 'あ', category: 'seion' },
  { id: 'e', hiragana: 'え', koreanReading: '에', row: 'あ', category: 'seion' },
  { id: 'o', hiragana: 'お', koreanReading: '오', row: 'あ', category: 'seion' },
  // か行
  { id: 'ka', hiragana: 'か', koreanReading: '카', row: 'か', category: 'seion' },
  { id: 'ki', hiragana: 'き', koreanReading: '키', row: 'か', category: 'seion' },
  { id: 'ku', hiragana: 'く', koreanReading: '쿠', row: 'か', category: 'seion' },
  { id: 'ke', hiragana: 'け', koreanReading: '케', row: 'か', category: 'seion' },
  { id: 'ko', hiragana: 'こ', koreanReading: '코', row: 'か', category: 'seion' },
  // さ行
  { id: 'sa', hiragana: 'さ', koreanReading: '사', row: 'さ', category: 'seion' },
  { id: 'shi', hiragana: 'し', koreanReading: '시', row: 'さ', category: 'seion' },
  { id: 'su', hiragana: 'す', koreanReading: '스', row: 'さ', category: 'seion' },
  { id: 'se', hiragana: 'せ', koreanReading: '세', row: 'さ', category: 'seion' },
  { id: 'so', hiragana: 'そ', koreanReading: '소', row: 'さ', category: 'seion' },
  // た行
  { id: 'ta', hiragana: 'た', koreanReading: '타', row: 'た', category: 'seion' },
  { id: 'chi', hiragana: 'ち', koreanReading: '치', row: 'た', category: 'seion' },
  { id: 'tsu', hiragana: 'つ', koreanReading: '츠', row: 'た', category: 'seion' },
  { id: 'te', hiragana: 'て', koreanReading: '테', row: 'た', category: 'seion' },
  { id: 'to', hiragana: 'と', koreanReading: '토', row: 'た', category: 'seion' },
  // な行
  { id: 'na', hiragana: 'な', koreanReading: '나', row: 'な', category: 'seion' },
  { id: 'ni', hiragana: 'に', koreanReading: '니', row: 'な', category: 'seion' },
  { id: 'nu', hiragana: 'ぬ', koreanReading: '누', row: 'な', category: 'seion' },
  { id: 'ne', hiragana: 'ね', koreanReading: '네', row: 'な', category: 'seion' },
  { id: 'no', hiragana: 'の', koreanReading: '노', row: 'な', category: 'seion' },
  // は行
  { id: 'ha', hiragana: 'は', koreanReading: '하', row: 'は', category: 'seion' },
  { id: 'hi', hiragana: 'ひ', koreanReading: '히', row: 'は', category: 'seion' },
  { id: 'fu', hiragana: 'ふ', koreanReading: '후', row: 'は', category: 'seion' },
  { id: 'he', hiragana: 'へ', koreanReading: '헤', row: 'は', category: 'seion' },
  { id: 'ho', hiragana: 'ほ', koreanReading: '호', row: 'は', category: 'seion' },
  // ま行
  { id: 'ma', hiragana: 'ま', koreanReading: '마', row: 'ま', category: 'seion' },
  { id: 'mi', hiragana: 'み', koreanReading: '미', row: 'ま', category: 'seion' },
  { id: 'mu', hiragana: 'む', koreanReading: '무', row: 'ま', category: 'seion' },
  { id: 'me', hiragana: 'め', koreanReading: '메', row: 'ま', category: 'seion' },
  { id: 'mo', hiragana: 'も', koreanReading: '모', row: 'ま', category: 'seion' },
  // や行
  { id: 'ya', hiragana: 'や', koreanReading: '야', row: 'や', category: 'seion' },
  { id: 'yu', hiragana: 'ゆ', koreanReading: '유', row: 'や', category: 'seion' },
  { id: 'yo', hiragana: 'よ', koreanReading: '요', row: 'や', category: 'seion' },
  // ら行
  { id: 'ra', hiragana: 'ら', koreanReading: '라', row: 'ら', category: 'seion' },
  { id: 'ri', hiragana: 'り', koreanReading: '리', row: 'ら', category: 'seion' },
  { id: 'ru', hiragana: 'る', koreanReading: '루', row: 'ら', category: 'seion' },
  { id: 're', hiragana: 'れ', koreanReading: '레', row: 'ら', category: 'seion' },
  { id: 'ro', hiragana: 'ろ', koreanReading: '로', row: 'ら', category: 'seion' },
  // わ行
  { id: 'wa', hiragana: 'わ', koreanReading: '와', row: 'わ', category: 'seion' },
  { id: 'wo', hiragana: 'を', koreanReading: '오', row: 'わ', category: 'seion' },
  { id: 'n', hiragana: 'ん', koreanReading: '응', row: 'わ', category: 'seion' },
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
