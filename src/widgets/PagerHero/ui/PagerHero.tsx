import React, { useState, useEffect } from 'react';
import { useTranslation } from '../PagerHero.i18next';
import styles from './PagerHero.module.scss';

import pagerHeroImg from '@/shared/assets/pager_hero.png';
import quoteImg from '@/shared/assets/kovischka.png';

const WavyArrowSvg = () => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.wavyArrow}>
    <path d="M1 10C5 10 7 5 11 5C15 5 17 15 21 15C25 15 27 5 31 5C35 5 37 15 41 15C45 15 47 10 51 10L57 10M57 10L52 5M57 10L52 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PagerHero: React.FC = () => {
  const { t } = useTranslation();
  const [timeStyles, setTimeStyles] = useState<React.CSSProperties>({});

  // Инициализация стартового времени для глобальных CSS-часов
  useEffect(() => {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hour = now.getHours();

    const secDeg = sec * 6;
    const minDeg = min * 6 + sec * 0.1;
    const hourDeg = (hour % 12) * 30 + min * 0.5;

    setTimeStyles({
      '--start-sec': `${secDeg}deg`,
      '--start-min': `${minDeg}deg`,
      '--start-hour': `${hourDeg}deg`,
    } as React.CSSProperties);
  }, []);

  const clockMarkers = Array.from({ length: 12 }).map((_, index) => {
    const isQuarter = index % 3 === 0;
    return (
      <div
        key={index}
        className="markerContainer"
        style={{ transform: `rotate(${index * 30}deg)` }}
      >
        <div className={`markerLine ${isQuarter ? 'quarterMarker' : ''}`} />
      </div>
    );
  });

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* ЛЕВАЯ ПАНЕЛЬ (Картинка + Часы) */}
        <div className={styles.leftPanel}>
          <img src={pagerHeroImg} alt="Pager Background" className={styles.leftPanelBg} />
          
          <div className={styles.clockContainer}>
            <div className="global-clock" style={timeStyles}>
              {clockMarkers}
              <div className="hourHand" />
              <div className="minuteHand" />
              <div className="secondHand" />
              <div className="clockCenter" />
            </div>
          </div>

          <div className={styles.quoteBlock}>
            <div className={styles.quoteGroup}>
              <img src={quoteImg} alt="" className={styles.quoteIcon} />
              <img src={quoteImg} alt="" className={styles.quoteIcon} />
              <img src={quoteImg} alt="" className={styles.quoteIcon} />
            </div>
            <p>{t('quote')}</p>
            <div className={styles.quoteGroup}>
              <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
              <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
              <img src={quoteImg} alt="" className={`${styles.quoteIcon} ${styles.quoteRight}`} />
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ */}
        <div className={styles.rightPanel}>
          <div className={styles.rightContent}>
            
            {/* 1. ЗАГОЛОВОК */}
            <h1 className={styles.title}>
              {t('title1')}
              <div className={styles.titleRow}>
                <WavyArrowSvg />
                {t('title2')}
              </div>
            </h1>

            {/* 2. ОСНОВНОЕ ОПИСАНИЕ */}
            <p className={styles.mainDesc}>
              {t('desc')}
            </p>

            {/* 3. ДЕКОРАТИВНЫЕ ПЛАШКИ */}
            <div className={styles.tagsArea}>
              <div className={styles.tagsContainer}>
                <div className={`${styles.tagItem} ${styles.tag1}`}><span className={styles.dot}></span>{t('tags.0')}</div>
                <div className={`${styles.tagItem} ${styles.tag2}`}><span className={styles.dot}></span>{t('tags.1')}</div>
                <div className={`${styles.tagItem} ${styles.tag3}`}><span className={styles.dot}></span>{t('tags.2')}</div>
                <div className={`${styles.tagItem} ${styles.tag4}`}><span className={styles.dot}></span>{t('tags.3')}</div>
                <div className={`${styles.tagItem} ${styles.tag5}`}><span className={styles.dot}></span>{t('tags.4')}</div>
              </div>
            </div>

            {/* 4. НИЖНИЙ БЛОК */}
            <div className={styles.bottomArea}>
              <p className={styles.bottomDesc}>
                {t('bottomDesc')}
              </p>
              
              <div className={styles.actions}>
                <button className={styles.btnPrimary}>{t('btnReg')}</button>
                <button className={styles.btnSecondary}>{t('btnMore')}</button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};