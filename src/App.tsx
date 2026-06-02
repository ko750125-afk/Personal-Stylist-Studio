import { useState, useRef } from 'react';
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import HistoryScreen from './screens/HistoryScreen';
import AnalysisResult from './components/AnalysisResult';
import Header from './components/layout/Header';
import { analyzeStyle, generateAllOutfitImages } from './services/openaiService';
import type { BodyAnalysisResult } from './services/openaiService';
import { saveAnalysisResult } from './services/resultService';
import type { SavedResult } from './services/resultService';
import { useAuth } from './contexts/AuthContext';
import styles from './App.module.css';

// ─── Types ──────────────────────────────────────────────────────
type AppScreen = 'home' | 'input' | 'analyzing' | 'generating' | 'result' | 'history';

export interface FormState {
  photo: File | null;
  photoPreview: string | null;
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | '';
}

const EMPTY_FORM: FormState = {
  photo: null,
  photoPreview: null,
  height: '',
  weight: '',
  gender: '',
};

// ─── App ────────────────────────────────────────────────────────
export default function App() {
  const { user } = useAuth();

  // Navigation state
  const [screen, setScreen] = useState<AppScreen>('home');

  // Form + result state
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [result, setResult] = useState<BodyAnalysisResult | null>(null);
  const [outfitImages, setOutfitImages] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Save status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveAttempted = useRef(false);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!form.photo || !form.photoPreview || !form.height || !form.weight || !form.gender) return;

    setError(null);
    setOutfitImages([]);
    setScreen('analyzing');

    try {
      // Step 1: Text analysis via Gemini
      const analysisResult = await analyzeStyle(
        form.photoPreview,
        form.gender,
        form.height,
        form.weight
      );
      setResult(analysisResult);

      // Step 2: Outfit image generation via Imagen
      setScreen('generating');
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
      const images = await generateAllOutfitImages(
        analysisResult.styleRecommendations,
        analysisResult.personalColor.season,
        apiKey
      );
      setOutfitImages(images);
      setScreen('result');

      // Step 3: Auto-save if logged in (non-blocking)
      if (user && form.photo && !saveAttempted.current) {
        saveAttempted.current = true;
        setSaveStatus('saving');
        saveAnalysisResult(user.uid, analysisResult, form.photo, images)
          .then(() => setSaveStatus('saved'))
          .catch((e) => {
            console.warn('[App] 결과 저장 실패:', e);
            setSaveStatus('error');
          });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
      setScreen('input');
    }
  };

  const handleReset = () => {
    setScreen('home');
    setResult(null);
    setOutfitImages([]);
    setError(null);
    setForm(EMPTY_FORM);
    setSaveStatus('idle');
    saveAttempted.current = false;
  };

  const handleHistorySelect = (saved: SavedResult) => {
    setResult(saved.result);
    setOutfitImages(saved.outfitImages);
    setForm((prev) => ({
      ...prev,
      photoPreview: saved.photoUrl,
    }));
    setScreen('result');
  };

  // ─── Screens ──────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <HomeScreen
        onStartAnalysis={() => setScreen('input')}
        onHistoryClick={() => setScreen('history')}
      />
    );
  }

  if (screen === 'history' && user) {
    return (
      <HistoryScreen
        uid={user.uid}
        onSelect={handleHistorySelect}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'result' && result && form.photoPreview) {
    return (
      <div className={styles.auraApp}>
        <Header onLogoClick={handleReset} onHistoryClick={() => setScreen('history')} disableScrollEffect />
        <main style={{ paddingTop: '80px' }}>
          <AnalysisResult
            result={result}
            photoPreview={form.photoPreview}
            outfitImages={outfitImages}
            onReset={handleReset}
            saveStatus={saveStatus}
          />
        </main>
      </div>
    );
  }

  // 'input' | 'analyzing' | 'generating'
  return (
    <InputScreen
      form={form}
      setForm={setForm}
      error={error}
      setError={setError}
      analysisStage={
        screen === 'analyzing' ? 'analyzing'
        : screen === 'generating' ? 'generating'
        : null
      }
      isLoading={screen === 'analyzing'}
      onGoHome={() => setScreen('home')}
      onAnalyze={handleAnalyze}
      onHistoryClick={() => setScreen('history')}
    />
  );
}
