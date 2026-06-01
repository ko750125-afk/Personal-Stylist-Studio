import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from '../App.module.css';

interface HomeScreenProps {
  onStartAnalysis: () => void;
}

export default function HomeScreen({ onStartAnalysis }: HomeScreenProps) {
  return (
    <div className={styles.auraApp}>
      <Header />

      <main className={styles.auraMain}>
        {/* Hero */}
        <section className={styles.auraHero}>
          <div className={styles.auraHeroContent}>
            <div className={styles.auraTagline}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bolt</span>
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
              <button className={styles.auraPrimaryBtn} onClick={onStartAnalysis}>
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
              <div
                className={`${styles.auraBentoCard} ${styles.auraBentoTall} ${styles.auraBentoFloat}`}
                style={{ animationDelay: '-1s' }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjxQPUa9t4_VM6EKWWdpQVLQ3UVzp8sZLGtrXbTuON1jknY2vkmi8k-Y4jRos2oBBMFINVlJeMIRPNcb5l7FuE0DkIsz9YZY6f7FpZPrB4qRNiANJyLlP7YFVWHktsfjrwbUIuQG9DRoTrD0frPi3joYNvwu8xCZbg2EMp3I-6rQTa-U4cuM9fUCGfz0wdPIDd_-IMu4uUbbjP-0TOEJp-fAPyV-mA7MzZfB37n4_hNOem9BtUh5XIE4qjsJJ-_lpVX4CZXrvFHK4"
                  alt="fashion editorial"
                />
              </div>
              <div className={styles.auraBentoCard}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEtvNHTyQpVhxzYiJ_cSbowqylQRlKLh9lVF047uw2_H_ZJCqeFlNBrYb9bjNOG8uWPkgyD4l1IUeaZEFA78E4Wb9YJZ4U13V-kbJCa3IxvSWO68BSQcc6rYm8jpSbOaSffElbor_rbR95xYDJZeezBilTT7wxSuUSQKtuzJcLUH1dqH6uDsB09NcnjGmLs4ylRUoyRTgiRJcQ4Pssvfk0vaykq0itddnWSTTprA3Et1c1ZJzaTpx09QHpHnTBDI0WDbuz466946s"
                  alt="accessories"
                />
              </div>
            </div>
            <div className={styles.auraBentoCol}>
              <div className={styles.auraBentoCard}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwU01oadBZUM6SnpJUe2PYIM7jFxzyqihTx53cOYieiq_nQ1qN11AZPQ_XuEIVLeGdaDjPoXdQfoOxdpkyn9HAC0h3QX7DqVPESqlLhHzloyvoL0kxAfveRkbCvXU1o1Y--A3AfOhFbqNw6Dyozifs6fBx85eiWByF07kXnMxi80XdlMawoBeSTrRlX8JBadxQSzR_i13oSLrv1JBdi0Q_yxOuovV0O8rlTaNkKP-X-zyzQrDtWiMTahO6tR7CBSbgQ05gTKTg8Hw"
                  alt="fashion flatlay"
                />
              </div>
              <div className={`${styles.auraBentoCard} ${styles.auraBentoTall} ${styles.auraBentoFloat}`}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIgBVuG03obHu9A-UeApC_uFs_xgjYkyJiEI_i3FCCVel8cJMJ_Fiyuf5mlMDDfsSltTHi708se25bO7Pblopyecd4sm8f4-MCmuTQT9pMX9RnGA0hZPzSIZVjnA2cYSrZ-nI8uubGnKNckORzYjob_Ul0SqbYoOND8B3JSHgMJ2iE1p8504VEzFUcbASTlkSj-JWUZlGtS5Vff1ycLtpX44zbqfnEeHAcPJEx4KagkbvxvQfkCR6SzGKT9jTZ1uwTAaQv0YYXzFo"
                  alt="fashion model"
                />
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
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{f.icon}</span>
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
              <p className={styles.auraQuizDesc}>
                사진 한 장으로 나만의 체형과 퍼스널 컬러를 분석하고 AI 맞춤 코디를 받아보세요.
              </p>
              <button className={styles.auraQuizBtn} onClick={onStartAnalysis}>
                Start Analysis
              </button>
            </div>
            <div className={styles.auraQuizImg}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbU5RiFyiy8_mXeAUYXGZHh2JQWTasoI7c40stga_lCH1MOW24O6kI0lqvDmtJ9kw3rcYnSYdsy1iraJ8hI8WujnZsL11z2Fozk4hqwAJvdHk7G4X6shIQLL2wYLmXhQqNmFlkln0NV1rMgW43J5PiRLWX4Q2zNkk64J-be00URFwqki-M8DswC2zlLnSxdZZaFoHJMe21Hk6VmIQCTROWAFYWqLQM1oA0BsETEzNuyHyoyJ1lMmn6W6CePe_yZpj1J7DDS6IbV-8"
                alt="fashion fabric"
              />
              <div className={styles.auraQuizImgOverlay} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
