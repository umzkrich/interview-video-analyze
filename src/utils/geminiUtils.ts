import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GEMINI_INPUT_PRICE, GEMINI_OUTPUT_PRICE, GEMINI_MODEL } from '@/config/constants';

// Gemini client initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');

/**
 * Calculate cost based on Gemini usage (estimated)
 */
export function calculateGeminiCost(inputTokens: number, outputTokens: number): number {
  const inputCost = inputTokens * GEMINI_INPUT_PRICE;
  const outputCost = outputTokens * GEMINI_OUTPUT_PRICE;
  
  return inputCost + outputCost;
}

/**
 * Generate system prompt for Gemini
 */
export function generateGeminiSystemPrompt(): string {
  return 'ユーザーから、人が写った動画の分析を頼まれます。人を特定することなく、一般的、客観的に動画の場面を分析してください。';
}

/**
 * Generate analysis prompt for Gemini
 */
export function generateGeminiAnalysisPrompt(): string {
  return `あなたは大学受験の面接官です。この面接を受けた受験生の動画を分析して、表情やジェスチャー、コミュニケーションの観点から一般的なフィードバックを日本語で提供してください。以下の項目について分析してください：

1. 表情の分析（感情表現、目の表情、口元の表現）
2. ジェスチャーの分析（手の動き、体の姿勢、頭の動き）
3. コミュニケーション効果（聞き手への印象）

それぞれの項目について、「良い点」と「改善点」をそれぞれ文章でまとめ、100点満点で「点数」を出してください。出力は次のマークダウン形式のxxxの部分を埋めるようにしてください。人物の顔認識や個人特定を避けるため、動画の分析は一般的な表情やジェスチャーに基づいて行ってください。

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

/**
 * Upload video file to Gemini and analyze
 */
export async function analyzeVideoWithGemini(videoPath: string, mimeType: string): Promise<{
  analysis: string;
  inputTokens: number;
  outputTokens: number;
}> {
  try {
    // Upload the video file to Gemini
    const uploadResult = await fileManager.uploadFile(videoPath, {
      mimeType: mimeType,
      displayName: "Interview Video"
    });

    console.log('Gemini file upload result:', uploadResult);

    // Wait for the file to be processed
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === 'PROCESSING') {
      console.log('Waiting for Gemini file processing...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === 'FAILED') {
      throw new Error('Gemini file processing failed');
    }

    // Generate content using the uploaded file
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    const systemPrompt = generateGeminiSystemPrompt();
    const analysisPrompt = generateGeminiAnalysisPrompt();
    
    const result = await model.generateContent([
      `${systemPrompt}\n\n${analysisPrompt}`,
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri
        }
      }
    ]);

    const response = await result.response;
    const analysis = response.text();

    // Clean up the uploaded file
    await fileManager.deleteFile(uploadResult.file.name);

    // Estimate token usage (Gemini doesn't provide exact counts)
    const inputTokens = Math.ceil((systemPrompt.length + analysisPrompt.length) / 4);
    const outputTokens = Math.ceil(analysis.length / 4);

    return {
      analysis,
      inputTokens,
      outputTokens
    };

  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}