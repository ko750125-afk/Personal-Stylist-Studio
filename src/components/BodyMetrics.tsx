import React from 'react';
import styles from './BodyMetrics.module.css';

interface BodyMetricsProps {
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | '';
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onGenderChange: (value: 'male' | 'female' | 'other') => void;
  avatarAge?: string;
  avatarRace?: string;
  avatarHair?: string;
  onAvatarAgeChange?: (value: string) => void;
  onAvatarRaceChange?: (value: string) => void;
  onAvatarHairChange?: (value: string) => void;
}

const BodyMetrics: React.FC<BodyMetricsProps> = ({
  height,
  weight,
  gender,
  onHeightChange,
  onWeightChange,
  onGenderChange,
  avatarAge,
  avatarRace,
  avatarHair,
  onAvatarAgeChange,
  onAvatarRaceChange,
  onAvatarHairChange,
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
    if (bmi < 18.5) return { text: 'Underweight', color: '#94d8ff' };
    if (bmi < 23) return { text: 'Normal', color: '#7fff94' };
    if (bmi < 25) return { text: 'Overweight', color: '#f5c842' };
    return { text: 'Obese', color: '#ff9494' };
  };

  const bmiNum = bmi ? parseFloat(bmi) : null;
  const bmiLabel = bmiNum ? getBmiLabel(bmiNum) : null;

  const genderOptions = [
    { value: 'female' as const, label: 'WOMAN' },
    { value: 'male' as const, label: 'MAN' },
  ];

  const ageOptions = [
    { value: '10-year-old', label: '10대' },
    { value: '20-year-old', label: '20대' },
    { value: '30-year-old', label: '30대' },
    { value: '40-year-old', label: '40대 이상' },
  ];

  const raceOptions = [
    { value: 'East Asian', label: '동양인' },
    { value: 'South Asian', label: '동남아시아인' },
    { value: 'Caucasian', label: '서양인' },
    { value: 'Black', label: '흑인' },
  ];

  const hairOptions = [
    { value: 'short', label: '숏컷' },
    { value: 'bob', label: '단발' },
    { value: 'long', label: '긴머리' },
    { value: 'tied up', label: '묶은머리' },
    { value: 'wavy', label: '웨이브' },
  ];

  return (
    <div className={styles.container}>
      {/* Gender Selection */}
      <div className={styles.section}>

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

              <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '0.5px' }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div className={styles.metricsRow}>
        <div className={styles.inputGroup}>
          <label className={styles.sectionLabel} htmlFor="input-height">
            Height
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
            Weight
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
            <span className={styles.bmiTitle}>BMI</span>
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

      {/* Avatar Settings */}
      {onAvatarAgeChange && onAvatarRaceChange && onAvatarHairChange && (
        <div className={styles.avatarSection}>
          <h3 className={styles.avatarTitle}>가상 모델(아바타) 설정</h3>
          
          <div className={styles.section}>
            <span className={styles.sectionLabel} style={{ fontSize: '13px', color: '#7d7480' }}>연령대</span>
            <div className={styles.avatarGroup}>
              {ageOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.avatarBtn} ${avatarAge === opt.value ? styles.avatarBtnActive : ''}`}
                  onClick={() => onAvatarAgeChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel} style={{ fontSize: '13px', color: '#7d7480' }}>인종/분위기</span>
            <div className={styles.avatarGroup}>
              {raceOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.avatarBtn} ${avatarRace === opt.value ? styles.avatarBtnActive : ''}`}
                  onClick={() => onAvatarRaceChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel} style={{ fontSize: '13px', color: '#7d7480' }}>헤어스타일</span>
            <div className={styles.avatarGroup}>
              {hairOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.avatarBtn} ${avatarHair === opt.value ? styles.avatarBtnActive : ''}`}
                  onClick={() => onAvatarHairChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMetrics;
