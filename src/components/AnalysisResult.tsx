import React, { useState, useEffect, useRef } from 'react';
import type { BodyAnalysisResult } from '../services/openaiService';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
  result: BodyAnalysisResult;
  photoPreview: string;
  outfitImages?: (string | null)[];
  onReset: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  expiresAt?: Date;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
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
  result, photoPreview, outfitImages = [], onReset, saveStatus = 'idle', expiresAt,
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
          <span>Analyze Again</span>
        </button>

        <div className={styles.heroGrid}>
          {/* Photo */}
          <div className={styles.heroPhoto}>
            <div className={styles.auraGlowContainer}>
              {personalColor.palette && personalColor.palette.length > 0 && (
                <div
                  className={styles.auraGlowBg}
                  style={{
                    background: `linear-gradient(135deg, ${personalColor.palette.join(', ')})`
                  }}
                />
              )}
              <div className={styles.photoCard}>
                {saveStatus !== 'idle' && (
                  <div className={styles.saveBadge} data-status={saveStatus}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                      {saveStatus === 'saving' ? 'sync'
                       : saveStatus === 'saved' ? 'check_circle'
                       : 'error'}
                    </span>
                    {saveStatus === 'saving' ? 'Saving...'
                     : saveStatus === 'saved' ? 'Saved'
                     : 'Save Error'}
                  </div>
                )}
                <img src={photoPreview} alt="분석된 사진" className={styles.photoImg} />
                <div className={styles.photoBadge}>
                  <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                  AI Analyzed
                </div>
              </div>
            </div>
          </div>

          {/* Body Type Info */}
          <div className={styles.heroContent}>

            <h1 className={styles.heroTitle}>
              You are a <span className={styles.heroAccent}>{bodyType.name}</span>
            </h1>
            <p className={styles.heroDesc}>{bodyType.description}</p>
            <div className={styles.chips}>
              {bodyType.characteristics.map((c) => (
                <span key={c} className={styles.chip}>{c}</span>
              ))}
            </div>
            {expiresAt && (
              <div className={styles.expiryNotice}>
                <span className="material-symbols-outlined">schedule</span>
                <span>이 스타일 진단 결과와 이미지들은 2주간 보관되며, <strong>{formatDate(expiresAt)}</strong>에 자동 소멸됩니다.</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Personal Color */}


      {/* Style Lookbook */}
      <section className={styles.lookbookSection}>
        <div className={styles.lookbookHeader}>
          <div className={styles.lookbookIconTitle}>
            <div className={styles.lookbookIcon}>
              <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1", color:'white', fontSize:'24px'}}>styler</span>
            </div>
            <div>
              <h2 className={styles.lookbookTitle}>AI Style Picks</h2>
              <p className={styles.lookbookSubtitle}>3 outfits tailored for you</p>
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

                  <div className={styles.lookbookItemGrid} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {card.items.map((item, j) => {
                      const category = item.split(' ').pop() || '아이템';
                      return (
                        <div key={j} className={styles.lookbookItemRow} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '16px', background: 'var(--aura-glass-bg)', borderRadius: '12px', border: '1px solid var(--aura-glass-border)' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--aura-primary)', marginBottom: '4px' }}>{category}</span>
                          <span className={styles.lookbookItemName} style={{ fontSize: '15px' }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </section>

      {/* Tips + Share */}


      <section className={styles.ctaSection}>
        <button className={styles.ctaBtn} onClick={onReset}>
          <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>refresh</span>
          Analyze Again
        </button>
      </section>
    </div>
  );
};

export default AnalysisResult;
