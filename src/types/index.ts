/** 文字種 */
export type CharacterScript = 'hiragana' | 'katakana'

/** 五十音の行（濁音・半濁音追加時も拡張しやすい） */
export type CharacterRow =
  | 'あ'
  | 'か'
  | 'さ'
  | 'た'
  | 'な'
  | 'は'
  | 'ま'
  | 'や'
  | 'ら'
  | 'わ'

/** 文字の種類（将来の濁音・拗音追加用） */
export type CharacterCategory = 'seion' | 'dakuon' | 'handakuon' | 'youon'

/** 練習する1文字の定義データ */
export interface Character {
  /** 一意ID（例: "a", "ka"） */
  id: string
  /** 表示・練習する文字 */
  character: string
  /** 韓国語の読み方 */
  koreanReading: string
  /** 五十音の行 */
  row: CharacterRow
  /** 文字カテゴリ */
  category: CharacterCategory
  /** ひらがな・カタカナの区別 */
  script: CharacterScript
}

/** 1文字あたりの学習進捗 */
export interface CharacterProgress {
  /** 勉強モードで学習した回数 */
  studyCount: number
  /** キャンバスに書いた回数 */
  writeCount: number
  /** 書いた回数とは独立して保存する学習状態 */
  status: LearningStatus
}

/** 学習ステータス（五十音表の色分け用） */
export type LearningStatus = '未習得' | '学習中' | '習得済み'

/** LocalStorageに保存する全体データ */
export interface LearningStoreData {
  /** データ構造のバージョン（将来の移行用） */
  version: number
  /** 文字IDごとの進捗 */
  characters: Record<string, CharacterProgress>
  /** 最終学習日 (YYYY-MM-DD) */
  lastStudyDate: string | null
  /** 連続学習日数 */
  streakDays: number
  /** 全体の学習セッション回数 */
  totalStudySessions: number
  /** 本日の学習回数 */
  todayStudyCount: number
  /** 本日の日付 (YYYY-MM-DD) — 日付変更時に todayStudyCount をリセット */
  todayDate: string | null
}

