import React, { useEffect, useState } from 'react';
import styles from './AnalyzingLoader.module.css';

type Stage = 'analyzing' | 'generating';

interface Props {
  stage?: Stage;
}

const analyzeSteps = [
  { icon: '📸', text: '사진 분석 중...' },
  { icon: '🧬', text: '체형 특성 파악 중...' },
  { icon: '🎨', text: '퍼스널 컬러 분석 중...' },
  { icon: '✨', text: '스타일 추천 생성 중...' },
];

const generateSteps = [
  { icon: '🖼️', text: '코디 이미지 #1 생성 중...' },
  { icon: '🖼️', text: '코디 이미지 #2 생성 중...' },
  { icon: '🖼️', text: '코디 이미지 #3 생성 중...' },
  { icon: '✅', text: '이미지 완성 중...' },
];

const AnalyzingLoader: React.FC<Props> = ({ stage = 'analyzing' }) => {
  const steps = stage === 'generating' ? generateSteps : analyzeSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(stage === 'generating' ? 50 : 0);

  const title = stage === 'generating' ? '코디 이미지 생성 중' : 'AI가 분석하고 있어요';
  const subtitle =
    stage === 'generating'
      ? '맞춤 코디 이미지를 만들고 있습니다 (약 20~30초)'
      : '잠시만 기다려 주세요 — 최적의 스타일을 찾고 있습니다';

  useEffect(() => {
    setCurrentStep(0);
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stage === 'generating' ? 8000 : 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const max = stage === 'generating' ? 97 : 48;
        if (prev >= max) return prev;
        return prev + Math.random() * (stage === 'generating' ? 0.4 : 2.5);
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [stage]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Animated orb */}
        <div
          className={styles.orb}
          aria-hidden="true"
          style={stage === 'generating' ? { '--orb-color': 'rgba(255,148,200,0.8)' } as React.CSSProperties : {}}
        >
          <div className={styles.orbInner} />
          <div className={styles.orbRing1} />
          <div className={styles.orbRing2} />
        </div>

        {/* Stage badge */}
        <div className={styles.stageBadge}>
          {stage === 'generating' ? '🖼️ 이미지 생성' : '🤖 AI 분석'}
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        {/* Steps */}
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${i <= currentStep ? styles.stepActive : ''} ${i === currentStep ? styles.stepCurrent : ''}`}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <span className={styles.stepText}>{step.text}</span>
              {i < currentStep && <span className={styles.stepCheck}>✓</span>}
              {i === currentStep && <span className={styles.stepDots}>...</span>}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={styles.progressLabel}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default AnalyzingLoader;
