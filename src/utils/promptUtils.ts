/**
 * Generate system prompt for video analysis
 */
export function generateSystemPrompt(): string {
  return 'ユーザーから、人が写った動画の分析を頼まれます。人を特定することなく、一般的、客観的に動画の場面を分析してください。出力は与えられるマークダウン形式に従ってください。';
}

/**
 * Generate analysis prompt for video analysis
 */
export function generateAnalysisPrompt(): string {
  return `あなたは大学受験の面接官です。この面接を受けた受験生の動画を分析して、表情やジェスチャー、コミュニケーションの観点から一般的なフィードバックを日本語で提供してください。以下の項目について分析してください：

1. 表情の分析
2. ジェスチャーの分析
3. 聞き手への印象

それぞれの項目について文章でまとめ、それを元に100点満点で「点数」を出してください。出力は次のマークダウン形式のxxxの部分を埋めるようにしてください。人物の顔認識や個人特定を避けるため、動画の分析は一般的な表情やジェスチャーに基づいて行ってください。

## 動画分析結果
### 1. 表情の分析
- xxx
- 点数：xxx
### 2. ジェスチャーの分析
- xxx
- 点数：xxx
### 3. 聞き手への印象
- xxx
- 点数：xxx`;
}