# ひらがなトレーニング

日本語学習者がひらがなを「書いて・聞いて」覚えるモバイルファーストの学習 Web アプリ（PWA）です。

## できること

- **勉強モード**: 見本をなぞってひらがなを繰り返し書く
- **テストモード**: 音声を聞いて四択から正しい文字を選ぶ（全10問）
- **学習記録**: 五十音表で進捗・苦手文字を確認し、LocalStorage に保存

初期バージョンでは清音 46 文字に対応しています。

## 必要環境

- Node.js 18 以上（推奨: 20 LTS 以降）
- Android Chrome（実機確認推奨）

## 起動方法

```bash
cd hiragana-training
npm install
npm run dev
```

ブラウザで表示された URL（例: `http://localhost:5173`）を開きます。

スマートフォンで確認する場合は、同じ Wi-Fi 内の PC の IP アドレス付き URL を開くか、ビルド後にHTTPSで配信してください（PWA・音声の制約上、HTTPS または localhost が必要です）。

## ビルド方法

```bash
npm run build
npm run preview
```

`dist/` フォルダに静的ファイルが出力されます。任意の静的ホスティング（GitHub Pages、Firebase Hosting、Netlify など）に配置できます。

## PWA のインストール方法（Android Chrome）

1. `npm run build` したアプリを **HTTPS** で公開する（または `npm run preview` を localhost で開く）
2. Android の Chrome でアプリの URL を開く
3. メニュー（⋮）→ **「ホーム画面に追加」** / **「アプリをインストール」**
4. ホーム画面のアイコンからスタンドアロン表示で起動できる

オフライン時も、一度読み込んだ基本画面は Service Worker のキャッシュで開けます。

## 技術構成

| 技術 | 用途 |
|------|------|
| React + TypeScript + Vite | UI / 開発基盤 |
| Tailwind CSS | スタイル |
| LocalStorage | 学習記録の保存 |
| Web Speech API | ひらがなの読み上げ |
| Canvas API | 手書き練習 |
| vite-plugin-pwa | PWA（Manifest / Service Worker） |

## ディレクトリ構成

```
src/
  components/   # 共通UI（キャンバス、ボタンなど）
  pages/        # 画面
  hooks/        # useSpeech など
  data/         # ひらがな文字データ
  types/        # 型定義
  utils/        # クイズ生成・日付など
  services/     # LocalStorage 読み書き
  store/        # 学習状態の Context
  styles/       # グローバルCSS
```

## 重要な実装判断

- **音声**: `SpeechSynthesis` を専用フック `useSpeech` に分離。`lang=ja-JP`、速度 0.75。自動再生がブロックされた場合は「音声を聞く」ボタンを目立たせる
- **苦手判定**: テスト出題 2 回以上かつ正答率 50% 未満
- **習得済み**: 書き練習 3 回以上、かつテストがある場合は正答率 70% 以上
- **LocalStorage**: `version` フィールド付き。文字追加時は不足キーを自動補完
- **手書き認識**: 初期版では正誤判定なし。`WritingCanvas.getStrokeData()` で将来拡張可能な入口を用意

## 未実装・既知の制限

- 手書き文字の自動正誤判定は未実装（なぞり練習のみ）
- 濁音・半濁音・拗音は未収録（データ形式は追加しやすい構造）
- iOS Safari では Web Speech API の挙動が Android Chrome と異なる場合がある
- PWA のインストール・オフラインは HTTPS（または localhost）が必要
- 音声の品質は端末に入っている日本語ボイスに依存する

## ライセンス

学習・個人利用向けのサンプルプロジェクトです。
