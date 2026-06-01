import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  onClose: () => void;
}

type Tab = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [tab, setTab]               = useState<Tab>('login');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setConfirm(''); setError(null); };

  const switchTab = (t: Tab) => { setTab(t); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === 'signup') {
      if (!name.trim()) return setError('이름을 입력해주세요.');
      if (password !== confirm) return setError('비밀번호가 일치하지 않습니다.');
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name.trim());
      }
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">✕</button>

        {/* Logo */}
        <div className={styles.logo}>AURA</div>
        <p className={styles.tagline}>AI 퍼스널 스타일리스트</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login'  ? styles.tabActive : ''}`}
            onClick={() => switchTab('login')}
          >로그인</button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => switchTab('signup')}
          >회원가입</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {tab === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>이름</label>
              <input
                className={styles.input}
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>이메일</label>
            <input
              className={styles.input}
              type="email"
              placeholder="hello@aura.style"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={tab === 'login'}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>비밀번호</label>
            <input
              className={styles.input}
              type="password"
              placeholder="6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {tab === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>비밀번호 확인</label>
              <input
                className={styles.input}
                type="password"
                placeholder="비밀번호 재입력"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          )}

          {error && <p className={styles.error}>⚠️ {error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              tab === 'login' ? '로그인' : '회원가입'
            )}
          </button>
        </form>

        <p className={styles.switchText}>
          {tab === 'login' ? '아직 계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
          <button className={styles.switchLink} onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}>
            {tab === 'login' ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
