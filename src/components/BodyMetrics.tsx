import React from 'react';
import styles from './BodyMetrics.module.css';

interface BodyMetricsProps {
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | '';
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onGenderChange: (value: 'male' | 'female' | 'other') => void;
}

const BodyMetrics: React.FC<BodyMetricsProps> = ({
  height,
  weight,
  gender,
  onHeightChange,
  onWeightChange,
  onGenderChange,
}) => {
  const handleHeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 250)) {
      onHeightChange(val);
    }
  };

  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 300)) {
      onWeightChange(val);
    }
  };

  const bmi =
    height && weight
      ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)
      : null;

  const getBmiLabel = (bmi: number) => {
    if (bmi < 18.5) return { text: '저체중', color: '#94d8ff' };
    if (bmi < 23) return { text: '정상', color: '#7fff94' };
    if (bmi < 25) return { text: '과체중', color: '#f5c842' };
    return { text: '비만', color: '#ff9494' };
  };

  const bmiNum = bmi ? parseFloat(bmi) : null;
  const bmiLabel = bmiNum ? getBmiLabel(bmiNum) : null;

  const genderOptions = [
    { value: 'female' as const, label: '여성', icon: '♀' },
    { value: 'male' as const, label: '남성', icon: '♂' },
    { value: 'other' as const, label: '기타', icon: '⚬' },
  ];

  return (
    <div className={styles.container}>
      {/* Gender Selection */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          <span className={styles.labelIcon}>👤</span>
          성별
        </label>
        <div className={styles.genderGroup} role="group" aria-label="성별 선택">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              id={`gender-${opt.value}`}
              className={`${styles.genderBtn} ${gender === opt.value ? styles.genderBtnActive : ''}`}
              onClick={() => onGenderChange(opt.value)}
              aria-pressed={gender === opt.value}
            >
              <span className={styles.genderIcon}>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div className={styles.metricsRow}>
        <div className={styles.inputGroup}>
          <label className={styles.sectionLabel} htmlFor="input-height">
            <span className={styles.labelIcon}>📏</span>
            키
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="input-height"
              type="number"
              className={styles.input}
              value={height}
              onChange={handleHeightInput}
              placeholder="170"
              min="100"
              max="250"
              step="0.1"
              aria-label="키 (cm)"
            />
            <span className={styles.unit}>cm</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.sectionLabel} htmlFor="input-weight">
            <span className={styles.labelIcon}>⚖️</span>
            몸무게
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="input-weight"
              type="number"
              className={styles.input}
              value={weight}
              onChange={handleWeightInput}
              placeholder="65"
              min="30"
              max="300"
              step="0.1"
              aria-label="몸무게 (kg)"
            />
            <span className={styles.unit}>kg</span>
          </div>
        </div>
      </div>

      {/* BMI Display */}
      {bmi && bmiLabel && (
        <div className={styles.bmiCard}>
          <div className={styles.bmiLeft}>
            <span className={styles.bmiTitle}>BMI 지수</span>
            <span className={styles.bmiValue}>{bmi}</span>
          </div>
          <div className={styles.bmiRight}>
            <span
              className={styles.bmiLabel}
              style={{ color: bmiLabel.color, borderColor: bmiLabel.color + '40', background: bmiLabel.color + '15' }}
            >
              {bmiLabel.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMetrics;
