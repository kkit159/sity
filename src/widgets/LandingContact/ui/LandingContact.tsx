import React from 'react';
import { motion } from 'framer-motion';

import { useTranslation } from '../LandingContact.i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './LandingContact.module.scss';

import backTimeImg from '@/shared/assets/back-time.png'; 
import queueBackImg from '@/shared/assets/contact_queue.png'; 
import pagerBackImg from '@/shared/assets/contact_pager.png'; 
import qrImg from '@/shared/assets/qr.png';
import tgIcon from '@/shared/assets/tg.png';

interface LandingContactProps {
  variant?: 'main' | 'queue' | 'pager';
}

export const LandingContact: React.FC<LandingContactProps> = ({ variant = 'main' }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  let currentBg = backTimeImg;
  if (variant === 'queue') {
    currentBg = queueBackImg;
  } else if (variant === 'pager') {
    currentBg = pagerBackImg; 
  }

  return (
    <section 
      className={styles.section} 
      id="contact" 
      data-theme={theme} 
      data-variant={variant}
      style={{ backgroundImage: `url(${currentBg})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        
        {/* HEADER СНАРУЖИ, КАК НА ФОТО 1 */}
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('title')}
          </motion.h2>
        </div>

        <motion.div 
          className={styles.glassWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* ВЕРХНЯЯ ЧАСТЬ: Контакты и QR (идут рядом) */}
          <div className={styles.topSection}>
            
            {/* 1. Карточка с контактами */}
            <div className={styles.innerCard}>
              <div className={styles.infoRow}>
                <label>{t('phone_label')}</label>
                <a href="tel:88888888888">8 (888) 88-88-88</a>
              </div>
              <div className={styles.infoRow}>
                <label>{t('email_label')}</label>
                <a href="mailto:online.zapis@yandex.ru">online.zapis@yandex.ru</a>
              </div>
              <div className={styles.infoRow}>
                <label>{t('address_label')}</label>
                <span>{t('address_val')}</span>
              </div>
            </div>

            {/* 2. Карточка с QR */}
            <div className={styles.innerCard}>
              <div className={styles.qrArea}>
                <img src={qrImg} alt="QR Code" className={styles.qrImage} />
                <a href="#" className={styles.qrButton}>
                  <img src={tgIcon} alt="Telegram" className={styles.tgIcon} />
                  <span>{t('qr_btn')}</span>
                </a>
              </div>
            </div>

          </div>

          <div className={styles.divider}></div>

          {/* НИЖНЯЯ ЧАСТЬ: Форма */}
          <div className={styles.formSection}>
            <h3>{t('form_title')}</h3>
            <form className={styles.form}>
              <input type="text" placeholder={t('ph_name')} />
              <input type="tel" placeholder={t('ph_phone')} />
              <textarea placeholder={t('ph_msg')}></textarea>
              
              <button type="submit" className={styles.submitBtn}>
                {t('btn_submit')}
              </button>

              <label className={styles.agreement}>
                <input type="checkbox" />
                <span>{t('agreement')}</span>
              </label>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
};