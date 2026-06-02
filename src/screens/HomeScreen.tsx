import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from '../App.module.css';

interface HomeScreenProps {
  onStartAnalysis: () => void;
  onHistoryClick: () => void;
}

export default function HomeScreen({ onStartAnalysis, onHistoryClick }: HomeScreenProps) {
  return (
    <div className={`${styles.auraApp} ${styles.bgModern}`}>
      <Header onHistoryClick={onHistoryClick} />

      <main className={styles.auraMain} style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
        {/* Hero */}
        <section className={styles.auraHero} style={{ width: '100%', paddingBottom: '0', display: 'flex', justifyContent: 'center' }}>
          <div className={styles.auraHeroContent} style={{ maxWidth: '600px', margin: '0 auto', alignItems: 'center', textAlign: 'center' }}>
            <h1 className={styles.auraHeroTitle} style={{ textAlign: 'center' }}>
              Style made for <br />
              <span className={styles.auraAccent}>your body</span>
            </h1>
            <div className={styles.auraHeroBtns} style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button className={styles.auraPrimaryBtn} onClick={onStartAnalysis}>
                Start Analysis
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
