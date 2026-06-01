import React from 'react';
import type { BodyAnalysisResult } from '../services/openaiService';
import styles from './ShareCard.module.css';

interface ShareCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  result: BodyAnalysisResult;
  photoPreview: string;
}

const ShareCard: React.FC<ShareCardProps> = ({ cardRef, result, photoPreview }) => {
  const { bodyType, personalColor, styleRecommendations } = result;

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
      </div>

      <div className={styles.body}>
        {/* Photo */}
        <div className={styles.photoWrap}>
          <img src={photoPreview} alt="profile" className={styles.photo} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          {/* Brand header */}
          <div className={styles.header}>
            <span className={styles.logo}>✦ AURA Personal Stylist Studio</span>
            <span className={styles.badge}>AI 스타일 분석</span>
          </div>

          {/* Body type */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>체형</span>
            <p className={styles.bodyTypeName}>{bodyType.name}</p>
            <p className={styles.bodyTypeEn}>{bodyType.englishName}</p>
            <div className={styles.tags}>
              {bodyType.characteristics.slice(0, 3).map((c) => (
                <span key={c} className={styles.tag}>{c}</span>
              ))}
            </div>
          </div>

          {/* Personal color */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>퍼스널 컬러</span>
            <p className={styles.seasonName}>{personalColor.season}</p>
            <div className={styles.palette}>
              {personalColor.palette.map((hex, i) => (
                <div key={i} className={styles.swatch} style={{ background: hex }} />
              ))}
            </div>
          </div>

          {/* Recommended styles */}
          <div className={styles.footer}>
            <span className={styles.footerLabel}>추천 스타일</span>
            <div className={styles.styleList}>
              {styleRecommendations.map((s) => (
                <span key={s.title} className={styles.styleChip}>
                  <span>{s.emoji}</span>
                  <span>{s.title}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>나만의 AI 스타일 분석 받아보기</span>
        <span className={styles.url}>aura-style.app</span>
      </div>
    </div>
  );
};

export default ShareCard;
