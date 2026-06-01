import React from 'react';
import styles from '../../App.module.css';

export default function Footer() {
  return (
    <footer className={styles.auraFooter}>
      <div className={styles.auraFooterGrid}>
        <div>
          <span className={styles.auraFooterLogo}>AURA</span>
          <p className={styles.auraFooterDesc}>
            Elevating personal style through the power of AI and professional curation.
          </p>
        </div>
        <div>
          <h4 className={styles.auraFooterHeading}>Explore</h4>
          <ul className={styles.auraFooterLinks}>
            <li><a href="#">Style Guide</a></li>
            <li><a href="#">Trends 2025</a></li>
            <li><a href="#">Personal Stylists</a></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.auraFooterHeading}>Company</h4>
          <ul className={styles.auraFooterLinks}>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.auraFooterHeading}>Social</h4>
          <div className={styles.auraFooterSocial}>
            {(['public', 'camera_alt', 'mail'] as const).map((icon) => (
              <button key={icon} className={styles.auraFooterSocialBtn} aria-label={`Share via ${icon}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.auraFooterBottom}>
        <p>© 2025 AURA STYLING. ALL RIGHTS RESERVED.</p>
        <div className={styles.auraFooterBottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
