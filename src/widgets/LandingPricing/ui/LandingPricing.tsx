import React from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { useTranslation } from '../LandingPricing.i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import { noWidow } from '@/shared/lib/utils';
import styles from './LandingPricing.module.scss';
import queueImg from '@/shared/assets/queue-bg.png';
import pagerImg from '@/shared/assets/pager-bg.png';

interface LandingPricingProps {
  variant?: 'main' | 'queue' | 'pager';
}

const transition: Transition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

// --- ИКОНКИ ---
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
    <circle cx="12" cy="12" r="12" className={styles.checkCircle} />
    <path d="M16 9L10.5 14.5L8 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.checkPath} />
  </svg>
);

// --- ИНТЕРФЕЙСЫ ---
interface MainProductCardProps {
  title: string;
  desc: string;
  btnText: string;
  imageSrc: string;
}

interface MainTariffCardProps {
  title: string;
  desc: string;
  features: string[];
  priceOld: string;
  priceNew: string;
}

// === УНИВЕРСАЛЬНЫЕ КАРТОЧКИ ===
const MainProductCard: React.FC<MainProductCardProps> = ({ title, desc, btnText, imageSrc }) => (
  <motion.div
    className={styles.mainProductCard}
    variants={fadeInUp}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, margin: "-50px" }}
    transition={transition}
  >
    <div className={styles.topContent}>
      <h3 className={styles.darkCardTitle}>{title}</h3>
      <p className={styles.darkCardDesc}>{desc}</p>
    </div>

    <div className={styles.imageWrapper}>
      <img src={imageSrc} alt={title} loading="lazy" />
    </div>

    <button className={styles.outlineButton}>{btnText}</button>
  </motion.div>
);

const MainTariffCard: React.FC<MainTariffCardProps> = ({ title, desc, features, priceOld, priceNew }) => (
  <motion.div
    className={styles.tariffCard}
    variants={fadeInUp}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, margin: "-50px" }}
    transition={transition}
  >
    <div className={styles.cardBody}>
      <div className={styles.topContent}>
        <h3 className={styles.lightCardTitle}>{title}</h3>
        <p className={styles.lightCardDesc}>{desc}</p>
        <ul className={styles.featureList}>
          {features.map((f, i) => (
            <li key={i}>
              <span className={styles.iconWrapper}><CheckIcon /></span>
              <span className={styles.featureText}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className={styles.priceButtonMain}>
        <span className={styles.oldPrice}>{priceOld}</span>
        <span className={styles.newPrice}>{priceNew}</span>
      </button>
    </div>
  </motion.div>
);

export const LandingPricing: React.FC<LandingPricingProps> = ({ variant = 'main' }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const isQueue = variant === 'queue';
  const isPager = variant === 'pager';

  const liteFeat = t('lite_feat', { returnObjects: true }) as string[];
  const bizFeat = t('biz_feat', { returnObjects: true }) as string[];

  const renderPricingRow = (type: 'queue' | 'pager') => (
    <div className={styles.grid}>
      <MainProductCard
        title={type === 'queue' ? t('queue_title') : t('pager_title')}
        desc={noWidow(type === 'queue' ? t('queue_desc') : t('pager_desc'))}
        btnText={t('btn_more')}
        imageSrc={type === 'queue' ? queueImg : pagerImg}
      />
      <MainTariffCard
        title={t('lite_title')}
        desc={noWidow(t('lite_desc'))}
        features={liteFeat}
        priceOld={t('price_old')}
        priceNew={t('price_new')}
      />
      <MainTariffCard
        title={t('biz_title')}
        desc={noWidow(t('biz_desc'))}
        features={bizFeat}
        priceOld={t('price_old')}
        priceNew={t('price_new')}
      />
    </div>
  );

  return (
    <section className={styles.section} data-theme={theme} data-variant={variant}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{noWidow(t('subtitle'))}</p>
        </div>

        {isQueue && renderPricingRow('queue')}
        {isPager && renderPricingRow('pager')}
        {variant === 'main' && (
          <div className={styles.mainRows}>
            {renderPricingRow('queue')}
            {renderPricingRow('pager')}
          </div>
        )}
      </div>
    </section>
  );
};