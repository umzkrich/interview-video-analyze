import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GEMINI_INPUT_PRICE, GEMINI_OUTPUT_PRICE, GEMINI_MODEL } from '@/config/constants';
import { generateSystemPrompt, generateAnalysisPrompt } from '@/utils/promptUtils';
import { getVideoDuration } from '@/utils/videoUtils';

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
    
    const systemPrompt = generateSystemPrompt();
    const analysisPrompt = generateAnalysisPrompt();
    
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
    // Text tokens
    const textTokens = Math.ceil((systemPrompt.length + analysisPrompt.length) / 4);
    
    // Video tokens: approximately 258 tokens per second of video
    // This is based on Gemini's internal frame processing
    const videoDuration = await getVideoDuration(videoPath);
    const videoTokens = Math.ceil(videoDuration * 258);
    
    const inputTokens = textTokens + videoTokens;
    const outputTokens = Math.ceil(analysis.length / 4);
    
    console.log(`Gemini token calculation: text=${textTokens}, video=${videoTokens} (${videoDuration}s), output=${outputTokens}`);

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