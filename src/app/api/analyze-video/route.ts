import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import path from 'path';
import { AnalysisResponse } from '@/types';
import { AIProvider } from '@/config/constants';
import { validateFile } from '@/utils/fileUtils';
import { extractFramesFromVideo, encodeImageToBase64, cleanupTempFiles } from '@/utils/videoUtils';
import { calculateCost } from '@/utils/openaiUtils';
import { analyzeVideoWithGemini, calculateGeminiCost } from '@/utils/geminiUtils';
import { generateSystemPrompt, generateAnalysisPrompt } from '@/utils/promptUtils';
import { GPT4O_MODEL, MAX_TOKENS, TEMPERATURE, TEMP_FILE_PREFIX, ALLOWED_FILE_NAME_CHARS } from '@/config/constants';

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
  let tempVideoPath: string | null = null;
  let frameFiles: string[] = [];

  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const provider = (formData.get('provider') as AIProvider) || 'openai';
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Save uploaded file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${TEMP_FILE_PREFIX}${Date.now()}_${file.name.replace(ALLOWED_FILE_NAME_CHARS, '_')}`;
    tempVideoPath = path.join(process.cwd(), 'public', 'videos', filename);
    
    await writeFile(tempVideoPath, buffer);

    let analysis: string;
    let cost: number;
    let inputTokens: number;
    let outputTokens: number;
    let totalTokens: number;

    if (provider === 'gemini') {
      // Analyze with Gemini using File API (direct video upload)
      const geminiResult = await analyzeVideoWithGemini(tempVideoPath, file.type);
      analysis = geminiResult.analysis;
      inputTokens = geminiResult.inputTokens;
      outputTokens = geminiResult.outputTokens;
      totalTokens = inputTokens + outputTokens;
      cost = calculateGeminiCost(inputTokens, outputTokens);
      
      console.log('Gemini Analysis Result:', { inputTokens, outputTokens, cost });
    } else {
      // Initialize OpenAI client only when needed
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Extract frames from video for OpenAI
      frameFiles = await extractFramesFromVideo(tempVideoPath);
      
      if (frameFiles.length === 0) {
        throw new Error('No frames could be extracted from the video');
      }

      // Encode frames to base64
      const base64Images = await Promise.all(
        frameFiles.map(async (framePath) => {
          const base64 = await encodeImageToBase64(framePath);
          return {
            type: "image_url" as const,
            image_url: {
              url: `data:image/jpeg;base64,${base64}`,
              detail: "high" as const
            }
          };
        })
      );

      // Analyze with OpenAI GPT-4o Vision
      const response = await openai.chat.completions.create({
        model: GPT4O_MODEL,
        messages: [
          {
            role: "system",
            content: generateSystemPrompt()
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: generateAnalysisPrompt()
              },
              ...base64Images
            ]
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE
      });

      analysis = response.choices[0]?.message?.content || '分析結果を取得できませんでした。';
      
      // Calculate cost
      const usage = response.usage;
      cost = calculateCost(usage);
      inputTokens = usage?.prompt_tokens || 0;
      outputTokens = usage?.completion_tokens || 0;
      totalTokens = usage?.total_tokens || 0;
      
      console.log('OpenAI Response Usage:', usage);
      console.log('Calculated Cost:', cost);
    }

    // Clean up temporary files
    await cleanupTempFiles([tempVideoPath, ...frameFiles]);

    return NextResponse.json({
      success: true,
      analysis,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
      cost: {
        totalCost: cost,
        inputTokens,
        outputTokens,
        totalTokens,
        provider
      }
    });

  } catch (error) {
    console.error('Error analyzing video:', error);
    
    // Clean up temporary files in case of error
    if (tempVideoPath || frameFiles.length > 0) {
      const filesToCleanup = [tempVideoPath, ...frameFiles].filter((file): file is string => file !== null);
      await cleanupTempFiles(filesToCleanup);
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { success: false, error: `Failed to analyze video: ${errorMessage}` },
      { status: 500 }
    );
  }
}