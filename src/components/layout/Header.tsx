import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/authService';
import AuthModal from '../AuthModal';
import styles from '../../App.module.css';

interface HeaderProps {
  onLogoClick?: () => void;
  onHistoryClick?: () => void;
  disableScrollEffect?: boolean;
}

export default function Header({ onLogoClick, onHistoryClick, disableScrollEffect = false }: HeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (disableScrollEffect) {
      setIsScrolled(true); // disable이면 항상 흰색 배경이 되도록 할 수도 있지만, 기본은 스타일 참조
      return;
    }
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [disableScrollEffect]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <header className={`${styles.auraHeader} ${isScrolled || disableScrollEffect ? styles.auraHeaderScrolled : ''}`}>
        <nav className={styles.auraNav}>
          <span
            className={styles.auraLogo}
            style={{ cursor: onLogoClick ? 'pointer' : 'default' }}
            onClick={handleLogoClick}
          >
            AURA
          </span>
          {user ? (
            <div className={styles.auraUserNav}>
              {onHistoryClick && (
                <button className={styles.auraHistoryBtn} onClick={onHistoryClick}>My History</button>
              )}
              <span className={styles.auraUserAvatar}>
                {user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
              </span>
              <span className={styles.auraUserName}>{user.displayName ?? user.email}</span>
              <button className={styles.auraLogoutBtn} onClick={() => signOut()}>Sign Out</button>
            </div>
          ) : (
            <button className={styles.auraSignInBtn} onClick={() => setShowAuth(true)}>
              Sign In
            </button>
          )}
        </nav>
      </header>
    </>
  );
}
