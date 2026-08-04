# ひらがな・カタカナトレーニング

日本語学習者がひらがなとカタカナを「書いて」覚えるモバイルファーストの学習 Web アプリ（PWA）です。

## できること

- **勉強モード**: 文字種と五十音表の文字を選び、書き順アニメーションを見ながら5回書く
- **学習記録**: ひらがな・カタカナを切り替えて進捗を確認し、習得済み状態をLocalStorageに別々に保存
- **役立つ情報**: 初心者向けに濁点・半濁点などの日本語知識を紹介
- **韓国語UI**: 操作文言を韓国語で表示

ひらがなとカタカナの清音各46文字、合計92文字に対応しています。濁音、半濁音、拗音は現在の書き練習対象に含まれません。

「役立つ情報」の濁点・半濁点ページでは、文字の変化を4ステップで説明し、発音はYouTubeなどの日本語学習動画も参考にするよう案内しています。アプリ内で動画や音声を再生する機能ではありません。

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

スマートフォンで確認する場合は、同じ Wi-Fi 内の PC の IP アドレス付き URL を開くか、ビルド後にHTTPSで配信してください（PWAはHTTPSまたはlocalhostが必要です）。

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
| Canvas API | 手書き練習 |
| vite-plugin-pwa | PWA（Manifest / Service Worker） |

## ディレクトリ構成

```
src/
  components/   # 共通UI（キャンバス、ボタンなど）
  pages/        # 画面
  data/         # ひらがな・カタカナ文字データ
  types/        # 型定義
  utils/        # 日付処理
  services/     # LocalStorage 読み書き
  store/        # 学習状態の Context
  styles/       # グローバルCSS
```

## 重要な実装判断

- **学習ステータス**: 未習得・学習中・習得済みを文字ごとに保存し、学習記録画面の文字タップで循環させる
- **LocalStorage**: `version` フィールド付き。v4で練習回数を維持したまま明示的な学習ステータスへ移行する
- **手書き認識**: 初期版では正誤判定なし。`WritingCanvas.getStrokeData()` で将来拡張可能な入口を用意

## 未実装・既知の制限

- 手書き文字の自動正誤判定は未実装（なぞり練習のみ）
- 濁音・半濁音・拗音は未収録（データ形式は追加しやすい構造）
- PWA のインストール・オフラインは HTTPS（または localhost）が必要

## ライセンス

学習・個人利用向けのサンプルプロジェクトです。

ひらがな・カタカナの書き順SVGは [animCJK](https://github.com/parsimonhi/animCJK)
（Copyright 2016-2026 FM-SH）を使用し、LGPL-3.0-or-laterの条件で再配布しています。
ライセンス本文は `public/licenses/animcjk/` を参照してください。
