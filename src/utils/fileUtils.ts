import { ValidationResult } from '@/types';
import { MAX_FILE_SIZE, SUPPORTED_VIDEO_TYPES } from '@/config/constants';

/**
 * ファイルサイズを人間が読みやすい形式にフォーマットする
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * アップロードされたファイルを検証する
 */
export const validateFile = (file: File): ValidationResult => {
  if (!file) {
    return { isValid: false, error: '動画ファイルを選択してください。' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'ファイルサイズが100MBを超えています。' };
  }
  
  if (!SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return { isValid: false, error: 'サポートされていない動画形式です。MP4、AVI、MOVファイルを選択してください。' };
  }
  
  return { isValid: true };
};
