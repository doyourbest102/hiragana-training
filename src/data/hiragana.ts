import type { Character } from '../types'

/**
 * 清音46文字のデータ。
 * 濁音・半濁音・拗音を追加するときは、同じ形式で配列に足すだけでよい。
 */
const HIRAGANA_DATA: Omit<Character, 'script'>[] = [
  // あ行
  { id: 'a', character: 'あ', koreanReading: '아', row: 'あ', category: 'seion' },
  { id: 'i', character: 'い', koreanReading: '이', row: 'あ', category: 'seion' },
  { id: 'u', character: 'う', koreanReading: '우', row: 'あ', category: 'seion' },
  { id: 'e', character: 'え', koreanReading: '에', row: 'あ', category: 'seion' },
  { id: 'o', character: 'お', koreanReading: '오', row: 'あ', category: 'seion' },
  // か行
  { id: 'ka', character: 'か', koreanReading: '카', row: 'か', category: 'seion' },
  { id: 'ki', character: 'き', koreanReading: '키', row: 'か', category: 'seion' },
  { id: 'ku', character: 'く', koreanReading: '쿠', row: 'か', category: 'seion' },
  { id: 'ke', character: 'け', koreanReading: '케', row: 'か', category: 'seion' },
  { id: 'ko', character: 'こ', koreanReading: '코', row: 'か', category: 'seion' },
  // さ行
  { id: 'sa', character: 'さ', koreanReading: '사', row: 'さ', category: 'seion' },
  { id: 'shi', character: 'し', koreanReading: '시', row: 'さ', category: 'seion' },
  { id: 'su', character: 'す', koreanReading: '스', row: 'さ', category: 'seion' },
  { id: 'se', character: 'せ', koreanReading: '세', row: 'さ', category: 'seion' },
  { id: 'so', character: 'そ', koreanReading: '소', row: 'さ', category: 'seion' },
  // た行
  { id: 'ta', character: 'た', koreanReading: '타', row: 'た', category: 'seion' },
  { id: 'chi', character: 'ち', koreanReading: '치', row: 'た', category: 'seion' },
  { id: 'tsu', character: 'つ', koreanReading: '츠', row: 'た', category: 'seion' },
  { id: 'te', character: 'て', koreanReading: '테', row: 'た', category: 'seion' },
  { id: 'to', character: 'と', koreanReading: '토', row: 'た', category: 'seion' },
  // な行
  { id: 'na', character: 'な', koreanReading: '나', row: 'な', category: 'seion' },
  { id: 'ni', character: 'に', koreanReading: '니', row: 'な', category: 'seion' },
  { id: 'nu', character: 'ぬ', koreanReading: '누', row: 'な', category: 'seion' },
  { id: 'ne', character: 'ね', koreanReading: '네', row: 'な', category: 'seion' },
  { id: 'no', character: 'の', koreanReading: '노', row: 'な', category: 'seion' },
  // は行
  { id: 'ha', character: 'は', koreanReading: '하', row: 'は', category: 'seion' },
  { id: 'hi', character: 'ひ', koreanReading: '히', row: 'は', category: 'seion' },
  { id: 'fu', character: 'ふ', koreanReading: '후', row: 'は', category: 'seion' },
  { id: 'he', character: 'へ', koreanReading: '헤', row: 'は', category: 'seion' },
  { id: 'ho', character: 'ほ', koreanReading: '호', row: 'は', category: 'seion' },
  // ま行
  { id: 'ma', character: 'ま', koreanReading: '마', row: 'ま', category: 'seion' },
  { id: 'mi', character: 'み', koreanReading: '미', row: 'ま', category: 'seion' },
  { id: 'mu', character: 'む', koreanReading: '무', row: 'ま', category: 'seion' },
  { id: 'me', character: 'め', koreanReading: '메', row: 'ま', category: 'seion' },
  { id: 'mo', character: 'も', koreanReading: '모', row: 'ま', category: 'seion' },
  // や行
  { id: 'ya', character: 'や', koreanReading: '야', row: 'や', category: 'seion' },
  { id: 'yu', character: 'ゆ', koreanReading: '유', row: 'や', category: 'seion' },
  { id: 'yo', character: 'よ', koreanReading: '요', row: 'や', category: 'seion' },
  // ら行
  { id: 'ra', character: 'ら', koreanReading: '라', row: 'ら', category: 'seion' },
  { id: 'ri', character: 'り', koreanReading: '리', row: 'ら', category: 'seion' },
  { id: 'ru', character: 'る', koreanReading: '루', row: 'ら', category: 'seion' },
  { id: 're', character: 'れ', koreanReading: '레', row: 'ら', category: 'seion' },
  { id: 'ro', character: 'ろ', koreanReading: '로', row: 'ら', category: 'seion' },
  // わ行
  { id: 'wa', character: 'わ', koreanReading: '와', row: 'わ', category: 'seion' },
  { id: 'wo', character: 'を', koreanReading: '오', row: 'わ', category: 'seion' },
  { id: 'n', character: 'ん', koreanReading: '응', row: 'わ', category: 'seion' },
]

export const HIRAGANA_CHARACTERS: Character[] = HIRAGANA_DATA.map(
  (character) => ({ ...character, script: 'hiragana' }),
)
