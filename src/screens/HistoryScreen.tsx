import React, { useEffect, useState } from 'react';
import { loadAnalysisHistory, deleteAnalysisResult } from '../services/resultService';
import type { SavedResult } from '../services/resultService';
import Header from '../components/layout/Header';
import styles from './HistoryScreen.module.css';

interface HistoryScreenProps {
  uid: string;
  onSelect: (saved: SavedResult) => void;
  onBack: () => void;
}

export default function HistoryScreen({ uid, onSelect, onBack }: HistoryScreenProps) {
  const [history, setHistory] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    loadAnalysisHistory(uid)
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[History] 히스토리 로드 실패:', err);
        setError('데이터를 불러오지 못했습니다. Firebase Console에서 Firestore 보안 규칙이 정상적으로 적용되었는지 확인해 주세요.');
        setLoading(false);
      });
  }, [uid]);

  const handleDelete = async (e: React.MouseEvent, item: SavedResult) => {
    e.stopPropagation();
    if (!confirm('분석 기록을 삭제하시겠습니까? 관련 사진도 모두 삭제됩니다.')) return;
    
    setDeletingId(item.docId);
    try {
      await deleteAnalysisResult(item);
      setHistory((prev) => prev.filter((x) => x.docId !== item.docId));
    } catch (err) {
      alert('삭제 도중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  return (
    <div className={styles.wrapper}>
      <Header onLogoClick={onBack} disableScrollEffect />

      <main className={styles.main}>
        <div className={styles.studioHeader}>
          <h1 className={styles.title}>My Styling Studio</h1>
          <p className={styles.subtitle}>Your 2-week style archive</p>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <span className="material-symbols-outlined spin">progress_activity</span>
            <p>Loading your style history...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined icon" style={{ color: '#ff4d4f' }}>error</span>
            <p className={styles.emptyText} style={{ color: '#ff4d4f', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{error}</p>
            <button className={styles.startBtn} onClick={onBack}>Back to Home</button>
          </div>
        ) : history.length === 0 ? (
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined icon">auto_awesome</span>
            <p className={styles.emptyText}>No styling history found.</p>
            <button className={styles.startBtn} onClick={onBack}>Start Your First Analysis</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {history.map((item) => {
              const isDeleting = deletingId === item.docId;
              const expDateStr = formatDate(item.expiresAt);
              
              return (
                <div
                  key={item.docId}
                  className={`${styles.card} ${isDeleting ? styles.cardDeleting : ''}`}
                  onClick={() => onSelect(item)}
                >
                  <div className={styles.photoContainer}>
                    <img src={item.photoUrl} alt="Style Photo" className={styles.photo} />
                  </div>
                  
                  <div className={styles.info}>
                    <div className={styles.headerRow}>
                      <span className={styles.date}>{formatDate(item.createdAt)}</span>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(e, item)}
                        disabled={isDeleting}
                        aria-label="Delete analysis"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    <h3 className={styles.bodyType}>
                      {item.result.bodyType.name}
                    </h3>
                    
                    <div className={styles.colorBadgeRow}>
                      <span className={styles.colorBadge}>
                        {item.result.personalColor.season}
                      </span>
                    </div>

                    <div className={styles.expiryBox}>
                      <span className="material-symbols-outlined">schedule</span>
                      <span>보관 기한: {expDateStr} 까지</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
