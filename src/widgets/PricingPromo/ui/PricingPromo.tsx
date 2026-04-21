import React from 'react';
import { useTranslation, Trans } from '../PricingPromo.i18next';
import styles from './PricingPromo.module.scss';

export const PricingPromo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.promoSection}>
      {/* 6 декоративных плашек, раскиданных по всему фону */}
      <div className={`${styles.pillSmall} ${styles.pillPos1}`}>10%</div>
      <div className={`${styles.pillSmall} ${styles.pillPos2}`}>10%</div>
      <div className={`${styles.pillSmall} ${styles.pillPos4}`}>10%</div>
      <div className={`${styles.pillSmall} ${styles.pillPos5}`}>10%</div>
      <div className={`${styles.pillSmall} ${styles.pillPos6}`}>10%</div>

      <div className={styles.container}>
        
        <div className={styles.leftBlock}>
          <h2 className={styles.title}>{t('title')}</h2>
          
          <div className={styles.mainPillWrapper}>
            {/* Главная плашка 10% */}
            <div className={styles.mainPill}>
              10%
            </div>
          </div>
        </div>

        <div className={styles.rightBlock}>
          <p className={styles.description}>
            <Trans 
              i18nKey="desc" 
              components={{ b: <b /> }} 
            />
          </p>
          <button className={styles.actionButton}>
            {t('button')}
          </button>
        </div>

      </div>
    </section>
  );
};