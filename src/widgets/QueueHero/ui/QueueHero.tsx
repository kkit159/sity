import React, { useState, useEffect } from 'react';
import styles from './QueueHero.module.scss';
import rightPanelImg from '../../../shared/assets/queue-hero-3d.png';
import quoteImg from '../../../shared/assets/kovischka.png';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from '../QueueHero.i18next';

const ToggleIconO = () => (
  <span className={styles.toggleO} aria-hidden="true">
    <span className={styles.toggleOThumb}></span>
  </span>
);

// Компонент живых часов
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minDeg = minutes * 6;
  const secDeg = seconds * 6;

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clockFace}>
          {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.tick} style={{ transform: `rotate(${i * 30}deg) translateY(-163px)` }} />
        ))}
        <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className={styles.minuteHand} style={{ transform: `rotate(${minDeg}deg)` }} />
        <div className={styles.secondHand} style={{ transform: `rotate(${secDeg}deg)` }} />
        <div className={styles.clockCenter} />
      </div>
    </div>
  );
};

export const QueueHero: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <section className={`${styles.hero} ${theme === 'dark' ? styles.dark : ''}`} aria-label="Hero section">
      {/* Левая панель контента */}
      <article className={styles.leftPanel}>
        <h1 className={styles.title}>
          {t('title1')} <br />
          {t('title2')}<ToggleIconO />{t('title3')}
        </h1>

        <p className={styles.description}>
          {t('desc')}
        </p>

        <div className={styles.tagsArea}>
          <div className={styles.tagsContainer}>
            <div className={`${styles.tagItem} ${styles.tag1}`}><span className={styles.dot}></span>{t('tags.reliability')}</div>
            <div className={`${styles.tagItem} ${styles.tag2}`}><span className={styles.dot}></span>{t('tags.convenience')}</div>
            <div className={`${styles.tagItem} ${styles.tag3}`}><span className={styles.dot}></span>{t('tags.control')}</div>
            <div className={`${styles.tagItem} ${styles.tag4}`}><span className={styles.dot}></span>{t('tags.stability')}</div>
            <div className={`${styles.tagItem} ${styles.tag5}`}><span className={styles.dot}></span>{t('tags.simplicity')}</div>
          </div>
        </div>

        <div className={styles.bottomBlock}>
          <p className={styles.bottomText}>
            {t('bottomText')}
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary}>
              {t('btnReg')}
            </button>
            <button type="button" className={styles.btnSecondary}>
              {t('btnMore')}
            </button>
          </div>
        </div>
      </article>

      {/* Правая панель с графикой */}
      <article className={styles.rightPanel}>
        <img src={rightPanelImg} alt="Abstract fluid clock overlay" className={styles.rightPanelBg} loading="lazy" />
        
        <LiveClock />

        <div className={styles.glassDecoration}>
          <div className={styles.quoteGroup}>
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
          </div>
          {t('quote1')}
          <div className={styles.quoteGroup}>
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
          </div>
        </div>

        <div style={{ flexGrow: 1 }}></div>

        <div className={styles.glassDecoration}>
          <div className={styles.quoteGroup}>
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
            <img src={quoteImg} alt="" className={styles.quoteIcon} />
          </div>
          {t('quote2')}
          <div className={styles.quoteGroup}>
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
            <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
          </div>
        </div>
      </article>
    </section>
  );
};