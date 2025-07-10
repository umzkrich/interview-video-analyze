import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResultsProps } from '@/types';
import CostDisplay from './CostDisplay';

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => (
  <>
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">分析結果</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">分析対象ファイル:</h3>
        <p className="text-sm text-blue-600 break-all">{result.filename}</p>
      </div>

      <div className="prose max-w-none text-gray-900 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold text-black mb-6 mt-8">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold text-black mb-4 mt-6">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold text-black mb-3 mt-4">{children}</h3>,
            p: ({ children }) => <p className="text-black mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="text-black mb-4 ml-6 list-disc space-y-1">{children}</ul>,
            li: ({ children }) => <li className="text-black">{children}</li>,
            strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
            em: ({ children }) => <em className="italic text-black">{children}</em>,
          }}
        >
          {result.analysis}
        </ReactMarkdown>
      </div>
    </div>

    <CostDisplay cost={result.cost} />
  </>
);

export default AnalysisResults;