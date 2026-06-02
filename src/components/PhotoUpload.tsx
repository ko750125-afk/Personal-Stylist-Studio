import React, { useCallback, useRef, useState } from 'react';
import styles from './PhotoUpload.module.css';

interface PhotoUploadProps {
  photo: File | null;
  preview: string | null;
  onPhotoChange: (file: File, preview: string) => void;
  onPhotoRemove: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  preview,
  onPhotoChange,
  onPhotoRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoChange(file, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.container}>


      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className={styles.hiddenInput}
        id="photo-upload"
        aria-label="사진 업로드"
      />

      {preview ? (
        <div className={styles.previewWrapper}>
          <img src={preview} alt="업로드된 사진" className={styles.previewImage} />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={handleClick}
              aria-label="사진 변경"
            >
              <span>사진 변경</span>
            </button>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={onPhotoRemove}
              aria-label="사진 제거"
            >
              ✕
            </button>
          </div>
          <div className={styles.fileName}>{photo?.name}</div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          aria-label="사진을 드래그하거나 클릭하여 업로드"
        >
          <p className={styles.dropzoneTitle}>카메라(모바일버전), 이미지업로드(컴퓨터버전)</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
