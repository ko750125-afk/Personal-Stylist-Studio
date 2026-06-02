import React from 'react';
import styles from '../../App.module.css';

export default function Footer() {
  return (
    <footer className={styles.auraFooter}>
      <div className={styles.auraFooterGrid} style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
        <div>
          <span className={styles.auraFooterLogo}>AURA</span>
          <p className={styles.auraFooterDesc}>
            Elevating personal style through the power of AI and professional curation.
          </p>
        </div>
      </div>
      <div className={styles.auraFooterBottom} style={{ justifyContent: 'center' }}>
        <p>© 2026 AURA STYLING. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
