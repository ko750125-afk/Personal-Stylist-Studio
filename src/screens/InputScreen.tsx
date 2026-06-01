import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PhotoUpload from '../components/PhotoUpload';
import BodyMetrics from '../components/BodyMetrics';
import AnalyzeButton from '../components/AnalyzeButton';
import AuthModal from '../components/AuthModal';
import AnalyzingLoader from '../components/AnalyzingLoader';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { FormState } from '../App';
import styles from '../App.module.css';

interface InputScreenProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  analysisStage: 'analyzing' | 'generating' | null;
  isLoading: boolean;
  onGoHome: () => void;
  onAnalyze: () => void;
}

export default function InputScreen({
  form,
  setForm,
  error,
  setError,
  analysisStage,
  isLoading,
  onGoHome,
  onAnalyze
}: InputScreenProps) {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnalyzeClick = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    onAnalyze();
  };

  if (analysisStage) {
    return <AnalyzingLoader stage={analysisStage} />;
  }

  return (
    <div className={styles.auraApp}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <Header onLogoClick={onGoHome} />

      <main className={styles.auraMain}>
        <section className={styles.auraInputSection}>
          <div className={styles.auraInputHeader}>
            <button className={styles.auraBackBtn} onClick={onGoHome}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </button>
            <h2 className={styles.auraInputTitle}>당신의 스타일을 알려주세요</h2>
            <p className={styles.auraInputSub}>
              정확한 체형 분석을 위해 전신 사진과 기본 신체 정보를 입력해 주세요.
            </p>
          </div>

          <div className={styles.auraInputGrid}>
            <div className={styles.auraInputLeft}>
              <div className={styles.auraCard}>
                <div className={styles.auraCardHeader}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--aura-primary)' }}>photo_camera</span>
                  <h3 className={styles.auraCardTitle}>전신 사진 업로드</h3>
                </div>
                <PhotoUpload
                  photo={form.photo}
                  preview={form.photoPreview}
                  onPhotoChange={(file, preview) => {
                    setForm(prev => ({ ...prev, photo: file, photoPreview: preview }));
                    setError(null);
                  }}
                  onPhotoRemove={() => {
                    setForm(prev => ({ ...prev, photo: null, photoPreview: null }));
                  }}
                />
              </div>
            </div>

            <div className={styles.auraInputRight}>
              <div className={styles.auraCard}>
                <div className={styles.auraCardHeader}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--aura-secondary)' }}>straighten</span>
                  <h3 className={styles.auraCardTitle}>신체 정보</h3>
                </div>
                <BodyMetrics
                  height={form.height}
                  weight={form.weight}
                  gender={form.gender}
                  onHeightChange={(val) => setForm(prev => ({ ...prev, height: val }))}
                  onWeightChange={(val) => setForm(prev => ({ ...prev, weight: val }))}
                  onGenderChange={(val) => setForm(prev => ({ ...prev, gender: val }))}
                />
              </div>

              {error && (
                <div className={styles.auraErrorMessage}>
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <div className={styles.auraActionCard}>
                <AnalyzeButton
                  onClick={handleAnalyzeClick}
                  disabled={!form.photo || !form.height || !form.weight || !form.gender || isLoading}
                  isAnalyzing={isLoading}
                />
                <p className={styles.auraActionNote}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                  업로드된 사진은 분석 후 즉시 삭제되며 저장되지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
