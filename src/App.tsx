import { useState, useEffect, useRef } from 'react';
import PhotoUpload from './components/PhotoUpload';
import BodyMetrics from './components/BodyMetrics';
import AnalyzeButton from './components/AnalyzeButton';
import AnalyzingLoader from './components/AnalyzingLoader';
import AnalysisResult from './components/AnalysisResult';
import { analyzeStyle, generateAllOutfitImages } from './services/openaiService';
import type { BodyAnalysisResult } from './services/openaiService';
import styles from './App.module.css';

type AppScreen = 'home' | 'input' | 'analyzing' | 'generating' | 'result';

interface FormState {
  photo: File | null;
  photoPreview: string | null;
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | '';
}

function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [form, setForm] = useState<FormState>({
    photo: null,
    photoPreview: null,
    height: '',
    weight: '',
    gender: '',
  });
  const [result, setResult] = useState<BodyAnalysisResult | null>(null);
  const [outfitImages, setOutfitImages] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    form.photo !== null &&
    form.height !== '' &&
    form.weight !== '' &&
    form.gender !== '';

  const handlePhotoChange = (file: File, preview: string) => {
    setForm((prev) => ({ ...prev, photo: file, photoPreview: preview }));
  };

  const handlePhotoRemove = () => {
    setForm((prev) => ({ ...prev, photo: null, photoPreview: null }));
  };

  const handleAnalyze = async () => {
    if (!isFormValid || !form.photoPreview) return;

    setError(null);
    setOutfitImages([]);
    setScreen('analyzing');

    try {
      // 1단계: 텍스트 분석
      const analysisResult = await analyzeStyle(
        form.photoPreview,
        form.gender,
        form.height,
        form.weight
      );
      setResult(analysisResult);

      // 2단계: 코디 이미지 생성 (DALL-E 2)
      setScreen('generating');
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
      const images = await generateAllOutfitImages(
        analysisResult.styleRecommendations,
        analysisResult.personalColor.season,
        apiKey
      );
      setOutfitImages(images);
      setScreen('result');
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
    setForm({
      photo: null,
      photoPreview: null,
      height: '',
      weight: '',
      gender: '',
    });
  };

  // ─── Home Screen ────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className={styles.auraApp}>
        <header ref={headerRef} className={`${styles.auraHeader} ${isScrolled ? styles.auraHeaderScrolled : ''}`}>
          <nav className={styles.auraNav}>
            <span className={styles.auraLogo}>AURA</span>
            <div className={styles.auraNavLinks}>
              <a href="#" className={styles.auraNavLink}>Style Guide</a>
              <a href="#" className={styles.auraNavLink}>Trend</a>
              <a href="#" className={`${styles.auraNavLink} ${styles.auraNavLinkActive}`}>My Style</a>
            </div>
            <button className={styles.auraSignInBtn} onClick={() => setScreen('input')}>
              Start Analysis
            </button>
          </nav>
        </header>

        <main className={styles.auraMain}>
          {/* Hero */}
          <section className={styles.auraHero}>
            <div className={styles.auraHeroContent}>
              <div className={styles.auraTagline}>
                <span className="material-symbols-outlined" style={{fontSize:'16px'}}>bolt</span>
                AI 기반 퍼스널 스타일링
              </div>
              <h1 className={styles.auraHeroTitle}>
                당신만을 위한{' '}
                <span className={styles.auraAccent}>맞춤 스타일</span>
                <br />분석 서비스
              </h1>
              <p className={styles.auraHeroSub}>
                사진 한 장으로 체형을 분석하고, AI가 완벽한 스타일을 제안해 드립니다.
                당신의 매력을 극대화할 최적의 코디를 찾아보세요.
              </p>
              <div className={styles.auraHeroBtns}>
                <button className={styles.auraPrimaryBtn} onClick={() => setScreen('input')}>
                  Start Analysis
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className={styles.auraSecondaryBtn}>View Lookbook</button>
              </div>
              <div className={styles.auraStats}>
                <div className={styles.auraStatItem}>
                  <span className={styles.auraStatNum}>15k+</span>
                  <span className={styles.auraStatLabel}>STYLE ANALYZED</span>
                </div>
                <div className={styles.auraStatItem}>
                  <span className={styles.auraStatNum}>98%</span>
                  <span className={styles.auraStatLabel}>MATCH RATE</span>
                </div>
                <div className={styles.auraStatItem}>
                  <span className={styles.auraStatNum}>24/7</span>
                  <span className={styles.auraStatLabel}>AI SUPPORT</span>
                </div>
              </div>
            </div>

            {/* Bento Image Grid */}
            <div className={styles.auraBento}>
              <div className={styles.auraBentoCol}>
                <div className={`${styles.auraBentoCard} ${styles.auraBentoTall} ${styles.auraBentoFloat}`} style={{animationDelay:'-1s'}}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxQPUa9t4_VM6EKWWdpQVLQ3UVzp8sZLGtrXbTuON1jknY2vkmi8k-Y4jRos2oBBMFINVlJeMIRPNcb5l7FuE0DkIsz9YZY6f7FpZPrB4qRNiANJyLlP7YFVWHktsfjrwbUIuQG9DRoTrD0frPi3joYNvwu8xCZbg2EMp3I-6rQTa-U4cuM9fUCGfz0wdPIDd_-IMu4uUbbjP-0TOEJp-fAPyV-mA7MzZfB37n4_hNOem9BtUh5XIE4qjsJJ-_lpVX4CZXrvFHK4" alt="fashion editorial" />
                </div>
                <div className={styles.auraBentoCard}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEtvNHTyQpVhxzYiJ_cSbowqylQRlKLh9lVF047uw2_H_ZJCqeFlNBrYb9bjNOG8uWPkgyD4l1IUeaZEFA78E4Wb9YJZ4U13V-kbJCa3IxvSWO68BSQcc6rYm8jpSbOaSffElbor_rbR95xYDJZeezBilTT7wxSuUSQKtuzJcLUH1dqH6uDsB09NcnjGmLs4ylRUoyRTgiRJcQ4Pssvfk0vaykq0itddnWSTTprA3Et1c1ZJzaTpx09QHpHnTBDI0WDbuz466946s" alt="accessories" />
                </div>
              </div>
              <div className={styles.auraBentoCol}>
                <div className={styles.auraBentoCard}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwU01oadBZUM6SnpJUe2PYIM7jFxzyqihTx53cOYieiq_nQ1qN11AZPQ_XuEIVLeGdaDjPoXdQfoOxdpkyn9HAC0h3QX7DqVPESqlLhHzloyvoL0kxAfveRkbCvXU1o1Y--A3AfOhFbqNw6Dyozifs6fBx85eiWByF07kXnMxi80XdlMawoBeSTrRlX8JBadxQSzR_i13oSLrv1JBdi0Q_yxOuovV0O8rlTaNkKP-X-zyzQrDtWiMTahO6tR7CBSbgQ05gTKTg8Hw" alt="fashion flatlay" />
                </div>
                <div className={`${styles.auraBentoCard} ${styles.auraBentoTall} ${styles.auraBentoFloat}`}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIgBVuG03obHu9A-UeApC_uFs_xgjYkyJiEI_i3FCCVel8cJMJ_Fiyuf5mlMDDfsSltTHi708se25bO7Pblopyecd4sm8f4-MCmuTQT9pMX9RnGA0hZPzSIZVjnA2cYSrZ-nI8uubGnKNckORzYjob_Ul0SqbYoOND8B3JSHgMJ2iE1p8504VEzFUcbASTlkSj-JWUZlGtS5Vff1ycLtpX44zbqfnEeHAcPJEx4KagkbvxvQfkCR6SzGKT9jTZ1uwTAaQv0YYXzFo" alt="fashion model" />
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className={styles.auraFeatures}>
            <div className={styles.auraFeaturesHeader}>
              <h2 className={styles.auraFeaturesTitle}>Experience the Future of Styling</h2>
              <p className={styles.auraFeaturesSub}>Simple steps to unlock your true aesthetic potential.</p>
            </div>
            <div className={styles.auraFeaturesGrid}>
              {[
                { icon: 'photo_camera', title: 'Instant Scan', desc: '사진 한 장으로 체형과 피부톤을 즉시 분석합니다.', bg: styles.auraIconGlow },
                { icon: 'insights', title: 'Deep Analysis', desc: '글로벌 트렌드와 체형 데이터를 결합한 정밀 분석.', bg: styles.auraIconSecondary },
                { icon: 'checkroom', title: 'Curated Wardrobe', desc: '맞춤 코디와 쇼핑 링크로 완성된 디지털 룩북.', bg: styles.auraIconTertiary },
              ].map((f) => (
                <div key={f.title} className={styles.auraFeatureCard}>
                  <div className={`${styles.auraFeatureIcon} ${f.bg}`}>
                    <span className="material-symbols-outlined" style={{fontSize:'32px'}}>{f.icon}</span>
                  </div>
                  <h3 className={styles.auraFeatureCardTitle}>{f.title}</h3>
                  <p className={styles.auraFeatureCardDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Quiz Card */}
          <section className={styles.auraQuiz}>
            <div className={styles.auraQuizCard}>
              <div className={styles.auraQuizContent}>
                <span className={styles.auraQuizLabel}>GETTING STARTED</span>
                <h2 className={styles.auraQuizTitle}>스타일 분석을 시작해보세요</h2>
                <p className={styles.auraQuizDesc}>사진 한 장으로 나만의 체형과 퍼스널 컬러를 분석하고 AI 맞춤 코디를 받아보세요.</p>
                <button className={styles.auraQuizBtn} onClick={() => setScreen('input')}>
                  Start Analysis
                </button>
              </div>
              <div className={styles.auraQuizImg}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbU5RiFyiy8_mXeAUYXGZHh2JQWTasoI7c40stga_lCH1MOW24O6kI0lqvDmtJ9kw3rcYnSYdsy1iraJ8hI8WujnZsL11z2Fozk4hqwAJvdHk7G4X6shIQLL2wYLmXhQqNmFlkln0NV1rMgW43J5PiRLWX4Q2zNkk64J-be00URFwqki-M8DswC2zlLnSxdZZaFoHJMe21Hk6VmIQCTROWAFYWqLQM1oA0BsETEzNuyHyoyJ1lMmn6W6CePe_yZpj1J7DDS6IbV-8" alt="fashion fabric" />
                <div className={styles.auraQuizImgOverlay} />
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.auraFooter}>
          <div className={styles.auraFooterGrid}>
            <div>
              <span className={styles.auraFooterLogo}>AURA</span>
              <p className={styles.auraFooterDesc}>Elevating personal style through the power of AI and professional curation.</p>
            </div>
            <div>
              <h4 className={styles.auraFooterHeading}>Explore</h4>
              <ul className={styles.auraFooterLinks}>
                <li><a href="#">Style Guide</a></li>
                <li><a href="#">Trends 2025</a></li>
                <li><a href="#">Personal Stylists</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.auraFooterHeading}>Company</h4>
              <ul className={styles.auraFooterLinks}>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.auraFooterHeading}>Social</h4>
              <div className={styles.auraFooterSocial}>
                {['public','camera_alt','mail'].map(icon => (
                  <button key={icon} className={styles.auraFooterSocialBtn}>
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.auraFooterBottom}>
            <p>© 2025 AURA STYLING. ALL RIGHTS RESERVED.</p>
            <div className={styles.auraFooterBottomLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ─── Result Screen ──────────────────────────────────────────
  if (screen === 'result' && result && form.photoPreview) {
    return (
      <div className={styles.app}>
        <div className={styles.bgOrb1} aria-hidden="true" />
        <div className={styles.bgOrb2} aria-hidden="true" />
        <div className={styles.bgGrid} aria-hidden="true" />
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>Personal Stylist Studio</span>
          </div>
          <nav className={styles.nav}>
            <a href="#" className={styles.navLink}>스타일 가이드</a>
            <a href="#" className={styles.navLink}>트렌드</a>
            <button className={styles.navBtn} onClick={handleReset}>다시 분석</button>
          </nav>
        </header>
        <main className={styles.main} style={{ paddingTop: '24px' }}>
          <AnalysisResult
            result={result}
            photoPreview={form.photoPreview}
            outfitImages={outfitImages}
            onReset={handleReset}
          />
        </main>
        <footer className={styles.footer}>
          <p>© 2025 Personal Stylist Studio. AI 기반 퍼스널 스타일링 서비스</p>
        </footer>
      </div>
    );
  }

  // ─── Input Screen ───────────────────────────────────────────
  const progressPct = (Number(!!form.photo) + Number(!!form.gender) + Number(!!form.height) + Number(!!form.weight)) * 25;

  return (
    <div className={styles.auraApp}>
      {(screen === 'analyzing' || screen === 'generating') && <AnalyzingLoader stage={screen} />}

      <header className={`${styles.auraHeader} ${isScrolled ? styles.auraHeaderScrolled : ''}`}>
        <nav className={styles.auraNav}>
          <span className={styles.auraLogo} style={{cursor:'pointer'}} onClick={() => setScreen('home')}>AURA</span>
          <div className={styles.auraNavLinks}>
            <a href="#" className={styles.auraNavLink}>Style Guide</a>
            <a href="#" className={styles.auraNavLink}>Trend</a>
            <a href="#" className={`${styles.auraNavLink} ${styles.auraNavLinkActive}`}>My Style</a>
          </div>
          <button className={styles.auraSignInBtn}>Sign In</button>
        </nav>
      </header>

      <main className={styles.auraInputMain}>
        <header className={styles.auraInputHeader}>
          <h1 className={styles.auraInputTitle}>체형 분석 시작하기</h1>
          <p className={styles.auraInputSubtitle}>아래 정보를 입력하면 AI가 최적의 스타일을 분석해 드립니다</p>
        </header>

        {error && (
          <div className={styles.auraErrorBox} role="alert">
            <span>⚠️</span>
            <div>
              <strong>분석 중 오류가 발생했습니다</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => setError(null)} aria-label="오류 닫기">✕</button>
          </div>
        )}

        <div className={styles.auraInputGrid}>
          {/* Left: Photo + Tips */}
          <div className={styles.auraInputLeft}>
            <div className={styles.auraDropzoneCard}>
              <PhotoUpload
                photo={form.photo}
                preview={form.photoPreview}
                onPhotoChange={handlePhotoChange}
                onPhotoRemove={handlePhotoRemove}
              />
            </div>
            <div className={styles.auraTipsCard}>
              <div className={styles.auraTipsHeader}>
                <span>💡</span>
                <span className={styles.auraTipsTitle}>좋은 사진 팁</span>
              </div>
              <ul className={styles.auraTipsList}>
                {['전신이 잘 보이는 사진', '밝은 조명 환경 권장', '꽉 끼지 않는 편안한 옷'].map(tip => (
                  <li key={tip} className={styles.auraTipsItem}>
                    <span className={styles.auraTipsDot} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form + Image */}
          <div className={styles.auraInputRight}>
            <div className={styles.auraFormCard}>
              <BodyMetrics
                height={form.height}
                weight={form.weight}
                gender={form.gender}
                onHeightChange={(v) => setForm((p) => ({ ...p, height: v }))}
                onWeightChange={(v) => setForm((p) => ({ ...p, weight: v }))}
                onGenderChange={(v) => setForm((p) => ({ ...p, gender: v }))}
              />
              <div className={styles.auraFormProgress}>
                <div className={styles.auraFormProgressTop}>
                  <span>입력 정보 완성도</span>
                  <span>{progressPct}%</span>
                </div>
                <div className={styles.auraFormProgressBar}>
                  <div className={styles.auraFormProgressFill} style={{width:`${progressPct}%`}} />
                </div>
              </div>
              <AnalyzeButton
                onClick={handleAnalyze}
                isLoading={screen === 'analyzing'}
                isDisabled={!isFormValid}
              />
            </div>

            <div className={styles.auraRefImg}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1EevRLHd5V1WXh_QQdrFOoR7WrsAccn3uWDAY8-9_kzbYlrCre2UN-BSLfO2fan0dcyy5ixH0PRFQ42K4s95wikIvPwRJ8K9xvWe0Xr7kN3d6PSfHNP77-TAC8qjrkZ4dwuA5OmtJCBRNSIRl3xckyPE8AhfTz4EnrQjZ1WXy41UabamuC0Q7Vw8Ef1w_Wwl9b6yixP7axh2O6RIf8g4NPxSeRt_MRNUPMieklbuNwNLkFqj-2DG5oiNF3ZBIT2CwydgUYZ5sLik" alt="fashion" />
              <div className={styles.auraRefImgOverlay}>
                <p>"Find the aesthetic that truly belongs to you."</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.auraFooter}>
        <div className={styles.auraFooterGrid}>
          <div>
            <span className={styles.auraFooterLogo}>AURA</span>
            <p className={styles.auraFooterDesc}>Experience the future of personal styling with AI-driven analysis tailored for the modern woman.</p>
            <p style={{fontSize:'13px',color:'#7d7480',marginTop:'16px'}}>© 2025 AURA STYLING. ALL RIGHTS RESERVED.</p>
          </div>
          <div>
            <h4 className={styles.auraFooterHeading}>Platform</h4>
            <ul className={styles.auraFooterLinks}>
              <li><a href="#">Style Guide</a></li>
              <li><a href="#">Trend Report</a></li>
              <li><a href="#">AI Stylist</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.auraFooterHeading}>Support</h4>
            <ul className={styles.auraFooterLinks}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
