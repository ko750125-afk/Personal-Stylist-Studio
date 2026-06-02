import React, { useEffect, useState } from 'react';
import styles from './AnalyzingLoader.module.css';

type Stage = 'analyzing' | 'generating';

interface Props {
  stage?: Stage;
}

const analyzeSteps = [
  { text: 'Analyzing photo...' },
  { text: 'Detecting body type...' },
  { text: 'Analyzing colors...' },
  { text: 'Generating recommendations...' },
];

const generateSteps = [
  { text: 'Generating outfit #1...' },
  { text: 'Generating outfit #2...' },
  { text: 'Generating outfit #3...' },
  { text: 'Finishing up...' },
];

const AnalyzingLoader: React.FC<Props> = ({ stage = 'analyzing' }) => {
  const steps = stage === 'generating' ? generateSteps : analyzeSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(stage === 'generating' ? 50 : 0);

  const title = stage === 'generating' ? 'Generating outfits' : 'AI is analyzing';
  const subtitle =
    stage === 'generating'
      ? 'Creating custom outfit images (approx. 20-30s)'
      : 'Please wait — finding your best style';

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
          {stage === 'generating' ? 'Image Generation' : 'Analysis'}
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
