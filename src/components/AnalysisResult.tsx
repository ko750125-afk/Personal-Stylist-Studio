import React, { useState, useEffect, useRef } from 'react';
import type { BodyAnalysisResult } from '../services/openaiService';
import SharePanel from './SharePanel';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
  result: BodyAnalysisResult;
  photoPreview: string;
  outfitImages?: (string | null)[];
  onReset: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

const COLOR_LABELS: Record<number, { name: string; usage: string }> = {
  0: { name: '메인 컬러', usage: '코트, 재킷 등 아우터' },
  1: { name: '서브 컬러', usage: '팬츠, 스커트 등 하의' },
  2: { name: '포인트 컬러', usage: '블라우스, 셔츠 등 상의' },
  3: { name: '악세서리', usage: '가방, 신발, 주얼리' },
  4: { name: '뉴트럴', usage: '이너웨어, 베이직 아이템' },
};

const StyleImage: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (error) return (
    <div className={styles.imgPlaceholder}>
      <span className="material-symbols-outlined" style={{fontSize:'40px',color:'#cec3d0'}}>checkroom</span>
    </div>
  );
  return (
    <>
      {!loaded && (
        <div className={styles.imgPlaceholder}>
          <span className="material-symbols-outlined" style={{fontSize:'24px',color:'#cec3d0',animation:'spin 1s linear infinite'}}>progress_activity</span>
        </div>
      )}
      <img
        src={src} alt={alt} className={className}
        style={loaded ? {} : { display: 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result, photoPreview, outfitImages = [], onReset, saveStatus = 'idle',
}) => {
  const { bodyType, personalColor, styleRecommendations } = result;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (containerRef.current) {
        containerRef.current.style.background =
          `radial-gradient(circle at ${x}% ${y}%, rgba(242,218,255,0.4) 0%, rgba(250,248,255,1) 90%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={onReset}>
          <span className="material-symbols-outlined">arrow_back</span>
          <span>다시 분석하기</span>
        </button>

        <div className={styles.heroGrid}>
          {/* Photo */}
          <div className={styles.heroPhoto}>
            <div className={styles.photoCard}>
              <img src={photoPreview} alt="분석된 사진" className={styles.photoImg} />
              <div className={styles.photoBadge}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                AI 분석 완료
              </div>
              {saveStatus !== 'idle' && (
                <div className={styles.saveBadge} data-status={saveStatus}>
                  <span className="material-symbols-outlined" style={{fontSize:'16px', fontVariationSettings:"'FILL' 1"}}>
                    {saveStatus === 'saving' ? 'sync' : saveStatus === 'saved' ? 'cloud_done' : 'cloud_off'}
                  </span>
                  {saveStatus === 'saving' ? '저장 중...' : saveStatus === 'saved' ? '저장 완료' : '저장 실패'}
                </div>
              )}
            </div>
          </div>

          {/* Body Type Info */}
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <span className="material-symbols-outlined" style={{fontSize:'16px', fontVariationSettings:"'FILL' 1"}}>colors_spark</span>
              퍼스널 스타일 리포트
            </div>
            <h1 className={styles.heroTitle}>
              당신은 <span className={styles.heroAccent}>{bodyType.name}</span>이에요
            </h1>
            <p className={styles.heroDesc}>{bodyType.description}</p>
            <div className={styles.chips}>
              {bodyType.characteristics.map((c) => (
                <span key={c} className={styles.chip}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Personal Color */}
      <section className={styles.colorSection}>
        <div className={styles.colorSectionTop}>
          <div>
            <div className={styles.sectionLabelRow}>
              <div className={styles.sectionIconBox}>
                <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>palette</span>
              </div>
              <h2 className={styles.sectionTitle}>퍼스널 컬러 팔레트</h2>
            </div>
            <p className={styles.colorKeywords}>
              {personalColor.keywords.join(' • ')}
            </p>
          </div>
          <div className={styles.seasonPill}>{personalColor.season}</div>
        </div>
        <p className={styles.colorDesc}>{personalColor.description}</p>

        <div className={styles.colorGrid}>
          {personalColor.palette.map((hex, i) => {
            const meta = COLOR_LABELS[i] ?? { name: `컬러 ${i + 1}`, usage: '' };
            return (
              <div key={i} className={styles.colorCard}>
                <div className={styles.colorSwatch} style={{ background: hex }} />
                <h3 className={styles.colorName}>{meta.name}</h3>
                <p className={styles.colorHex}>{hex}</p>
                <p className={styles.colorUsage}>{meta.usage}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Style Lookbook */}
      <section className={styles.lookbookSection}>
        <div className={styles.lookbookHeader}>
          <div className={styles.lookbookIconTitle}>
            <div className={styles.lookbookIcon}>
              <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1", color:'white', fontSize:'24px'}}>styler</span>
            </div>
            <div>
              <h2 className={styles.lookbookTitle}>AI 추천 스타일</h2>
              <p className={styles.lookbookSubtitle}>체형과 퍼스널 컬러에 최적화된 코디 3가지</p>
            </div>
          </div>
        </div>

        <div className={styles.lookbookList}>
          {styleRecommendations.map((card, i) => {
            const imgSrc = outfitImages[i] ?? null;
            const isReversed = i % 2 !== 0;
            return (
              <div key={i} className={`${styles.lookbookCard} ${isReversed ? styles.lookbookCardReversed : ''}`}>
                {/* Image side */}
                <div className={styles.lookbookImgWrap}>
                  <div className={styles.lookbookBadge}
                    style={isReversed ? {right:'24px', left:'auto'} : {left:'24px'}}>
                    STYLE {String(i + 1).padStart(2, '0')}
                  </div>
                  {imgSrc ? (
                    <StyleImage src={imgSrc} alt={`${card.title} 코디`} className={styles.lookbookImg} />
                  ) : (
                    <div className={styles.imgPlaceholder}>
                      <span className="material-symbols-outlined" style={{fontSize:'48px',color:'#cec3d0'}}>checkroom</span>
                    </div>
                  )}
                </div>

                {/* Text side */}
                <div className={styles.lookbookInfo}>
                  <div className={styles.lookbookCategoryRow}>
                    <span className="material-symbols-outlined" style={{color:'#9d72c0', fontSize:'20px', fontVariationSettings:"'FILL' 1"}}>
                      {i === 0 ? 'steps' : i === 1 ? 'favorite' : 'work'}
                    </span>
                    <span className={styles.lookbookCategory}>{card.style}</span>
                  </div>
                  <h3 className={styles.lookbookCardTitle}>{card.title}</h3>
                  <p className={styles.lookbookDesc}>{card.description}</p>

                  <div className={styles.lookbookOccasion}>
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>location_on</span>
                    {card.occasion}
                  </div>

                  <div className={styles.lookbookItemGrid}>
                    {card.items.map((item, j) => (
                      <a
                        key={j}
                        className={styles.lookbookItemRow}
                        href={`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={styles.lookbookItemLeft}>
                          <span className={styles.lookbookDot} />
                          <span className={styles.lookbookItemName}>{item}</span>
                        </div>
                        <span className="material-symbols-outlined" style={{fontSize:'20px', color:'#cec3d0'}}>shopping_cart</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </section>

      {/* Tips + Share */}
      <section className={styles.tipsSection}>
        <div className={styles.tipsGrid}>
          <div className={styles.tipsCard}>
            <div className={styles.tipsCardHeader}>
              <div className={styles.tipsIconBox} style={{background:'#e9d5ff'}}>
                <span className="material-symbols-outlined" style={{color:'#5c347d', fontVariationSettings:"'FILL' 1"}}>straighten</span>
              </div>
              <h3 className={styles.tipsTitle}>실루엣 팁</h3>
            </div>
            <ul className={styles.tipsList}>
              {result.silhouetteTips.map((tip, i) => (
                <li key={i} className={styles.tipsItem}>
                  <span className={styles.tipsBullet}>{i + 1}</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.tipsCard}>
            <div className={styles.tipsCardHeader}>
              <div className={styles.tipsIconBox} style={{background:'#ffd9e2'}}>
                <span className="material-symbols-outlined" style={{color:'#8e0048', fontVariationSettings:"'FILL' 1"}}>palette</span>
              </div>
              <h3 className={styles.tipsTitle}>컬러 활용 팁</h3>
            </div>
            <ul className={styles.tipsList}>
              {result.colorsTips.map((tip, i) => (
                <li key={i} className={styles.tipsItem}>
                  <span className={styles.tipsBullet}>{i + 1}</span>{tip}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.tipsCard} ${styles.avoidCard}`}>
            <div className={styles.tipsCardHeader}>
              <div className={styles.tipsIconBox} style={{background:'#ffdad6'}}>
                <span className="material-symbols-outlined" style={{color:'#ba1a1a', fontVariationSettings:"'FILL' 1"}}>block</span>
              </div>
              <h3 className={styles.tipsTitle}>피해야 할 스타일</h3>
            </div>
            <ul className={styles.tipsList}>
              {result.avoidTips.map((tip, i) => (
                <li key={i} className={styles.tipsItem}>
                  <span className={styles.avoidBullet}>✕</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SharePanel result={result} photoPreview={photoPreview} />

      <section className={styles.ctaSection}>
        <button className={styles.ctaBtn} onClick={onReset}>
          <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>refresh</span>
          다시 분석하기
        </button>
      </section>
    </div>
  );
};

export default AnalysisResult;
