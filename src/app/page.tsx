'use client';

import { useState, useCallback } from 'react';
import {
  AnalysisResult,
  ApiResponse
} from '@/types';
import { AIProvider } from '@/config/constants';
import { validateFile } from '@/utils/fileUtils';
import FileUpload from '@/components/FileUpload';
import AnalysisButton from '@/components/AnalysisButton';
import AnalysisResults from '@/components/AnalysisResults';
import ModelSelector from '@/components/ModelSelector';


// Main component
export default function VideoAnalysisApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        setSelectedFile(file);
        setError(null);
        setAnalysisResult(null);
      } else {
        setError(validation.error || '無効なファイルです。');
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
      setError(null);
      setAnalysisResult(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('動画ファイルを選択してください。');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('provider', selectedProvider);

      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();
      
      // Debug logging
      console.log('API Response:', result);
      console.log('Cost data:', result.cost);

      if (result.success && result.analysis) {
        setAnalysisResult({
          success: result.success,
          analysis: result.analysis,
          filename: result.filename || selectedFile.name,
          fileSize: result.fileSize || selectedFile.size,
          fileType: result.fileType || selectedFile.type,
          cost: result.cost,
        });
      } else {
        setError(result.error || '分析に失敗しました。');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました。';
      setError(`分析中にエラーが発生しました: ${errorMessage}`);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            動画分析
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AIを使用して動画を分析し、改善点などを提供します
          </p>
        </header>

        {/* Model Selection */}
        <ModelSelector
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          disabled={isAnalyzing}
        />

        {/* File Upload */}
        <FileUpload
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          error={error}
        />

        {/* Analysis Button */}
        <AnalysisButton
          selectedFile={selectedFile}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />

        {/* Results */}
        {analysisResult && <AnalysisResults result={analysisResult} />}
      </div>
    </div>
  );
}
