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
        disabled={isLoading}
        aria-label="AI 스타일 분석 시작"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>Analyzing...</span>
          </span>
        ) : (
          <span className={styles.defaultContent}>
            <span className={styles.buttonIcon}>✦</span>
            <span>Analyze</span>
            <span className={styles.buttonArrow}>→</span>
          </span>
        )}
        <div className={styles.glow} aria-hidden="true" />
      </button>


    </div>
  );
};

export default AnalyzeButton;
