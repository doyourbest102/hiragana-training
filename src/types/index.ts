/** 五十音の行（濁音・半濁音追加時も拡張しやすい） */
export type HiraganaRow =
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

/** ひらがな1文字の定義データ */
export interface Character {
  /** 一意ID（例: "a", "ka"） */
  id: string
  /** ひらがな本体 */
  hiragana: string
  /** 韓国語の読み方 */
  koreanReading: string
  /** 五十音の行 */
  row: HiraganaRow
  /** 文字カテゴリ */
  category: CharacterCategory
}

/** 1文字あたりの学習進捗 */
export interface CharacterProgress {
  /** 勉強モードで学習した回数 */
  studyCount: number
  /** キャンバスに書いた回数 */
  writeCount: number
  /** 利用者が手動で設定する習得済み状態 */
  isMastered: boolean
}

/** 学習ステータス（五十音表の色分け用） */
export type LearningStatus = '未学習' | '学習中' | '習得済み'

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

/** 勉強モードの開始オプション */
export interface StudyOptions {
  /** 特定の文字だけ練習する場合のID一覧。未指定なら文字選択画面 */
  characterIds?: string[]
  /** 結果画面からの遷移理由など */
  source?: 'single' | 'picker'
}
