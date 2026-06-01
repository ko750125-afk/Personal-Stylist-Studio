import React from 'react';
import styles from './AnalyzeButton.module.css';

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  isLoading,
  isDisabled,
}) => {
  return (
    <div className={styles.wrapper}>
      <button
        id="analyze-button"
        type="button"
        className={`${styles.button} ${isLoading ? styles.loading : ''}`}
        onClick={onClick}
        disabled={isDisabled || isLoading}
        aria-label="AI 스타일 분석 시작"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>분석 중...</span>
          </span>
        ) : (
          <span className={styles.defaultContent}>
            <span className={styles.buttonIcon}>✦</span>
            <span>AI 스타일 분석하기</span>
            <span className={styles.buttonArrow}>→</span>
          </span>
        )}
        <div className={styles.glow} aria-hidden="true" />
      </button>

      {isDisabled && !isLoading && (
        <p className={styles.hint}>사진과 체형 정보를 모두 입력해주세요</p>
      )}
    </div>
  );
};

export default AnalyzeButton;
