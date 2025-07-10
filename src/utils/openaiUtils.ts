import { OpenAIUsage } from '@/types';
import { GPT4O_INPUT_PRICE, GPT4O_OUTPUT_PRICE } from '@/config/constants';

/**
 * Calculate cost based on OpenAI usage
 */
export function calculateCost(usage: OpenAIUsage | undefined): number {
  if (!usage) return 0;
  
  const inputCost = (usage.prompt_tokens || 0) * GPT4O_INPUT_PRICE;
  const outputCost = (usage.completion_tokens || 0) * GPT4O_OUTPUT_PRICE;
  
  return inputCost + outputCost;
}

/**
 * Generate system prompt
 */
export function generateSystemPrompt(): string {
  return 'ユーザーから、人が写った画像の分析を頼まれます。人を特定することなく、一般的、客観的に画像の場面を分析してください。';
}

/**
 * Generate analysis prompt
 */
export function generateAnalysisPrompt(): string {
  return `あなたは大学受験の面接官です。これらの面接を受けた受験生の動画のフレームを分析して、表情やジェスチャー、コミュニケーションの観点から一般的なフィードバックを日本語で提供してください。以下の項目について分析してください：

1. 表情の分析（感情表現、目の表情、口元の表現）
2. ジェスチャーの分析（手の動き、体の姿勢、頭の動き）
3. コミュニケーション効果（聞き手への印象）

それぞれの項目について、「良い点」と「改善点」をそれぞれ文章でまとめ、100点満点で「点数」を出してください。出力は次のマークダウン形式のxxxの部分を埋めるようにしてください。人物の顔認識や個人特定を避けるため、フレームの分析は一般的な表情やジェスチャーに基づいて行ってください。

## 動画分析結果
### 1. 表情の分析
- 良い点：xxx
- 改善点：xxx
- 点数：xxx
### 2. ジェスチャーの分析
- 良い点：xxx
- 改善点：xxx
- 点数：xxx
### 3. コミュニケーション効果
- 良い点：xxx
- 改善点：xxx
- 点数：xxx`;
}
