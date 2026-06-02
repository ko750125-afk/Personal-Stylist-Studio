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

      <main className={styles.auraMain} style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section className={styles.auraInputSection} style={{ width: '100%' }}>


          <div className={styles.auraInputGrid}>
            <div className={styles.auraInputLeft}>
              <div className={styles.auraCard}>

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

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
