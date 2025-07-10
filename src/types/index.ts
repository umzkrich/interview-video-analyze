// 共通型定義
export interface CostInfo {
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// OpenAI関連の型定義
export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// API レスポンス型（サーバーサイド用）
export interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  filename?: string;
  fileSize?: number;
  fileType?: string;
  cost?: CostInfo;
  error?: string;
}

export interface AnalysisResult {
  success: boolean;
  analysis: string;
  filename: string;
  fileSize: number;
  fileType: string;
  cost?: CostInfo;
}

export interface ApiResponse {
  success: boolean;
  analysis?: string;
  filename?: string;
  fileSize?: number;
  fileType?: string;
  cost?: CostInfo;
  error?: string;
}

// バリデーション結果の型
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// コンポーネントのProps型
export interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  error: string | null;
}

export interface AnalysisButtonProps {
  selectedFile: File | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export interface AnalysisResultsProps {
  result: AnalysisResult;
}

export interface CostDisplayProps {
  cost?: CostInfo;
}