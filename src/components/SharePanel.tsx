import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { BodyAnalysisResult } from '../services/openaiService';
import ShareCard from './ShareCard';
import styles from './SharePanel.module.css';

interface SharePanelProps {
  result: BodyAnalysisResult;
  photoPreview: string;
}

type ShareStatus = 'idle' | 'capturing' | 'shared' | 'saved' | 'error';

const SharePanel: React.FC<SharePanelProps> = ({ result, photoPreview }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ShareStatus>('idle');

  const captureCard = async (): Promise<{ blob: Blob; url: string }> => {
    if (!cardRef.current) throw new Error('카드를 찾을 수 없습니다');
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0a0a0c', scale: 2, useCORS: true, allowTaint: true, logging: false,
    });
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('이미지 변환 실패'));
        resolve({ blob, url: URL.createObjectURL(blob) });
      }, 'image/png', 0.95);
    });
  };

  const handleKakaoShare = async () => {
    setStatus('capturing');
    try {
      const { blob, url } = await captureCard();

      // 모바일: Web Share API (카카오톡 포함 시스템 공유 시트)
      if (navigator.share) {
        const file = new File([blob], 'aura-style.png', { type: 'image/png' });
        const shareData = navigator.canShare?.({ files: [file] })
          ? {
              files: [file],
              title: 'AURA 스타일 분석 결과',
              text: `AI가 분석한 나의 스타일!\n체형: ${result.bodyType.name} | 퍼스널 컬러: ${result.personalColor.season}`,
            }
          : {
              title: 'AURA 스타일 분석 결과',
              text: `AI가 분석한 나의 스타일!\n체형: ${result.bodyType.name} | 퍼스널 컬러: ${result.personalColor.season}`,
            };
        await navigator.share(shareData);
        setStatus('shared');
        return;
      }

      // PC 데스크톱: 이미지 다운로드 후 카카오톡에 직접 전송 안내
      const a = document.createElement('a');
      a.href = url;
      a.download = `aura-style-${Date.now()}.png`;
      a.click();
      setStatus('saved');
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setStatus('error');
      else setStatus('idle');
    }
  };

  const isCapturing = status === 'capturing';

  const statusMsg: Record<ShareStatus, string | null> = {
    idle: null,
    capturing: null,
    shared: '카카오톡으로 공유됐어요! 🎉',
    saved: '이미지가 저장됐어요. 카카오톡에서 직접 전송해주세요.',
    error: '공유 중 오류가 발생했습니다. 다시 시도해주세요.',
  };

  return (
    <section className={styles.panel}>
      {/* Hidden capture target */}
      <div className={styles.cardHidden} aria-hidden="true">
        <ShareCard cardRef={cardRef} result={result} photoPreview={photoPreview} />
      </div>

      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'white', fontSize: '24px' }}>share</span>
        </div>
        <div>
          <h2 className={styles.sectionTitle}>결과 공유하기</h2>
          <p className={styles.sectionSubtitle}>분석 결과를 카카오톡으로 공유해보세요</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left: Preview */}
        <div>
          <p className={styles.previewLabel}>공유 이미지 미리보기</p>
          <div className={styles.previewCard}>
            <ShareCard cardRef={{ current: null }} result={result} photoPreview={photoPreview} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.actionsCol}>
          <p className={styles.previewLabel}>공유하기</p>

          {/* KakaoTalk share button */}
          <button
            className={styles.kakaoBtn}
            onClick={handleKakaoShare}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                <span>이미지 생성 중...</span>
              </>
            ) : (
              <>
                {/* KakaoTalk bubble icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.582 2 11c0 2.82 1.682 5.315 4.286 6.869L5.5 21l4.054-2.162C10.296 18.945 11.14 19 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                </svg>
                <span>카카오톡으로 공유하기</span>
              </>
            )}
          </button>

          {/* Status message */}
          {statusMsg[status] && (
            <div className={`${styles.statusMsg} ${status === 'error' ? styles.statusError : status === 'shared' ? styles.statusSuccess : styles.statusInfo}`}>
              {statusMsg[status]}
            </div>
          )}

          {/* PC guide (shown when navigator.share unavailable) */}
          <div className={styles.tipCard}>
            <p className={styles.tipTitle}>💡 PC에서는</p>
            <p className={styles.tipText}>
              버튼 클릭 시 이미지가 자동 저장됩니다.<br />
              저장된 이미지를 카카오톡에서 파일 전송으로 공유해주세요.
            </p>
            <p className={styles.tipTitle} style={{ marginTop: '12px' }}>📱 모바일에서는</p>
            <p className={styles.tipText}>
              버튼 클릭 시 공유 시트가 열리고<br />
              카카오톡을 선택하면 바로 전달됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SharePanel;
