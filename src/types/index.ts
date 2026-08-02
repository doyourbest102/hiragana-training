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
  /** ローマ字 */
  romaji: string
  /** 五十音の行 */
  row: HiraganaRow
  /** 音声読み上げ用テキスト */
  speechText: string
  /** 文字カテゴリ */
  category: CharacterCategory
}

/** 1文字あたりの学習進捗 */
export interface CharacterProgress {
  /** 勉強モードで学習した回数 */
  studyCount: number
  /** キャンバスに書いた回数 */
  writeCount: number
  /** テスト出題回数 */
  testCount: number
  /** 正解回数 */
  correctCount: number
  /** 不正解回数 */
  incorrectCount: number
  /** 苦手判定フラグ */
  isWeak: boolean
}

/** 学習ステータス（五十音表の色分け用） */
export type LearningStatus = '未学習' | '学習中' | '習得済み' | '苦手'

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

/** テスト1問分 */
export interface QuizQuestion {
  correctId: string
  /** 選択肢の文字ID（正解1 + 不正解3） */
  optionIds: string[]
}

/** テスト結果 */
export interface TestResult {
  total: number
  correct: number
  incorrect: number
  /** 間違えた文字のID一覧 */
  wrongIds: string[]
}

/** 勉強モードの開始オプション */
export interface StudyOptions {
  /** 特定の文字だけ練習する場合のID一覧。未指定なら全文字 */
  characterIds?: string[]
  /** 結果画面からの遷移理由など */
  source?: 'all' | 'wrong' | 'single'
}
