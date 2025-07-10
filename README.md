# 動画表情・ジェスチャー分析アプリ

ChatGPT-4o Vision APIを使用して動画内の表情やジェスチャーを分析し、プレゼンテーションスキル向上のための改善アドバイスを提供するNext.jsアプリケーションです。

## 機能

- 動画ファイルのアップロード（MP4, AVI, MOV対応）
- 動画フレームの自動抽出
- AI による表情・ジェスチャー分析
- 詳細なフィードバックとスコア表示
- APIコスト情報の表示

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **AI**: OpenAI GPT-4o Vision API
- **動画処理**: FFmpeg
- **UI**: React Markdown

## 必要な環境

- Node.js 18.0.0 以上
- npm または yarn
- FFmpeg（動画フレーム抽出用）
- OpenAI API キー

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/video-analysis-app.git
cd video-analysis-app
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. FFmpegのインストール

#### macOS (Homebrew使用)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
[FFmpeg公式サイト](https://ffmpeg.org/download.html)からダウンロードしてインストール

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、OpenAI API キーを設定します：

```bash
# .env.local ファイルを作成
touch .env.local
```

`.env.local` ファイルに以下の内容を記述：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### OpenAI API キーの取得方法

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントにログイン（未登録の場合は新規登録）
3. 右上のメニューから「API keys」を選択
4. 「Create new secret key」をクリック
5. 生成されたAPIキーをコピーして `.env.local` に貼り付け

**⚠️ 重要**: APIキーは秘密情報です。GitHubにコミットしないよう注意してください。

### 5. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてアプリケーションを確認できます。

## 使用方法

1. **動画ファイルの選択**: 対応形式（MP4, AVI, MOV）の動画ファイルを選択
2. **分析実行**: 「動画を分析する」ボタンをクリック
3. **結果確認**: 表情、ジェスチャー、コミュニケーション効果の分析結果とスコアを確認
4. **コスト確認**: API使用料金の詳細を確認

## ファイル構成

```
video-analysis-app/
├── src/
│   ├── app/
│   │   ├── api/analyze-video/route.ts  # API エンドポイント
│   │   ├── page.tsx                    # メインページ
│   │   └── layout.tsx                  # レイアウト
│   ├── components/                     # UIコンポーネント
│   │   ├── FileUpload.tsx
│   │   ├── AnalysisButton.tsx
│   │   ├── AnalysisResults.tsx
│   │   └── CostDisplay.tsx
│   ├── utils/                          # ユーティリティ関数
│   │   ├── fileUtils.ts
│   │   ├── videoUtils.ts
│   │   └── openaiUtils.ts
│   ├── types/                          # 型定義
│   │   └── index.ts
│   └── config/                         # 設定ファイル
│       └── constants.ts
├── public/
│   └── videos/                         # 一時的な動画ファイル保存場所
├── .env.local                          # 環境変数（要作成）
└── README.md
```

## 制限事項

- 最大ファイルサイズ: 100MB
- 対応動画形式: MP4, AVI, MOV
- 分析は動画から抽出した3フレームに基づいて実行

## トラブルシューティング

### FFmpegが見つからないエラー
```
Error: FFmpeg not found
```
FFmpegが正しくインストールされ、PATHに追加されていることを確認してください。

### OpenAI API エラー
```
Error: Invalid API key
```
`.env.local` ファイルのAPIキーが正しく設定されていることを確認してください。

### ファイルアップロードエラー
- ファイルサイズが100MB以下であることを確認
- 対応形式（MP4, AVI, MOV）であることを確認

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 注意事項

- このアプリケーションはOpenAI APIを使用するため、使用量に応じて料金が発生します
- アップロードされた動画ファイルは分析後に自動的に削除されます
- 個人情報を含む動画の使用は避けてください
