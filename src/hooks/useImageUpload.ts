import { useState } from 'react';
import { uploadStyleImage, type UploadResult } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';

interface UseImageUploadReturn {
  upload:    (file: File) => Promise<UploadResult | null>;
  uploading: boolean;
  progress:  string;
  error:     string | null;
  reset:     () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState('');
  const [error, setError]         = useState<string | null>(null);

  const upload = async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return null;
    }
    setUploading(true);
    setError(null);
    try {
      setProgress('이미지 압축 중...');
      const result = await uploadStyleImage(user.uid, file);
      setProgress('업로드 완료');
      return result;
    } catch (err) {
      setError('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => { setError(null); setProgress(''); };

  return { upload, uploading, progress, error, reset };
};
