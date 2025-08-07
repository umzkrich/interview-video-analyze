// ファイル関連の定数
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];

// AI Provider Types
export type AIProvider = 'openai' | 'gemini';

// OpenAI関連の定数
export const GPT4O_INPUT_PRICE = 0.005 / 1000; // $0.005 per 1K input tokens
export const GPT4O_OUTPUT_PRICE = 0.015 / 1000; // $0.015 per 1K output tokens
export const GPT4O_MODEL = 'gpt-4o';

// Gemini関連の定数
export const GEMINI_INPUT_PRICE = 0.00125 / 1000; // $0.00125 per 1K input tokens
export const GEMINI_OUTPUT_PRICE = 0.00375 / 1000; // $0.00375 per 1K output tokens
export const GEMINI_MODEL = 'gemini-1.5-pro';

// 共通設定
export const MAX_TOKENS = 1500;
export const TEMPERATURE = 0.3;

// AI Provider Options
export const AI_PROVIDERS = [
  {
    id: 'openai' as AIProvider,
    name: 'OpenAI GPT-4o'
  },
  {
    id: 'gemini' as AIProvider,
    name: 'Google Gemini 1.5 Pro'
  }
] as const;

// 動画処理関連の定数
export const TEMP_FRAMES_DIR = 'public/temp_frames';
export const FRAME_PATTERN = 'frame_%03d.jpg';
export const FRAMES_COUNT = 20; // Extract 10 frames from video
export const FRAME_SCALE = '512:512';

// ファイル名パターン
export const TEMP_FILE_PREFIX = 'temp_';
export const ALLOWED_FILE_NAME_CHARS = /[^a-zA-Z0-9.-]/g;