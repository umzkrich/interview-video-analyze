import React from 'react';
import { AnalysisButtonProps } from '@/types';

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ selectedFile, isAnalyzing, onAnalyze }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
    <button
      onClick={onAnalyze}
      disabled={!selectedFile || isAnalyzing}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
    >
      {isAnalyzing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          分析中...
        </>
      ) : (
        '動画を分析する'
      )}
    </button>
  </div>
);

export default AnalysisButton;