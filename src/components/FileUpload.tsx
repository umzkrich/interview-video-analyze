import React from 'react';
import { FileUploadProps } from '@/types';
import { formatFileSize } from '@/utils/fileUtils';

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, onFileSelect, error }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          動画ファイルを選択
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-2">
          対応形式: MP4, AVI, MOV (最大100MB)
        </p>
      </div>

      {selectedFile && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">選択されたファイル:</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ファイル名:</span> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">サイズ:</span> {formatFileSize(selectedFile.size)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">タイプ:</span> {selectedFile.type}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;