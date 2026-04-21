import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import { useTranslation } from '../QueueCTA.i18next';


import { LandingProcess } from '@/widgets/LandingProcess';


import ctaBgQueue from '@/shared/assets/cta_back.png';
import ctaBgPager from '@/shared/assets/cta_back_pager.png';

import styles from './QueueCTA.module.scss';

interface QueueCTAProps {
  variant?: 'queue' | 'pager';
}

export const QueueCTA: React.FC<QueueCTAProps> = ({ variant = 'queue' }) => {
  const { t } = useTranslation();
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const isPager = variant === 'pager';

  const currentBg = isPager ? ctaBgPager : ctaBgQueue;

  const handleMoreClick = () => {
    window.location.href = isPager ? '/queue' : '/pager';
  };

  return (
    <section className={styles.ctaSection}>
      <motion.div
        className={styles.container}
        style={{ backgroundImage: `url(${currentBg})` }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.content}>
          <h2 className={styles.title}>
            {t(`${variant}.title` as any)}
          </h2>
          <p className={styles.subtitle}>
            {t(`${variant}.subtitle` as any)}
          </p>

          <div className={styles.actions}>
            <button
              className={styles.outlineBtn}
              onClick={handleMoreClick}
            >
              {t('btn_more')}
            </button>
            <button
              className={styles.glassBtn}
              onClick={() => setIsProcessModalOpen(true)}
            >
              {t('btn_how')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно с процессом */}
      <Modal
        open={isProcessModalOpen}
        onCancel={() => setIsProcessModalOpen(false)}
        footer={null}
        width={1440}
        centered
        destroyOnHidden
        closeIcon={<CloseOutlined style={{ color: 'var(--text-main)' }} />}
        styles={{
          content: {
            padding: 0,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'var(--modal-bg)',
          },
          body: { padding: 0 },
        }}
      >
        <div className={styles.modalContentWrapper}>
          { }
          <LandingProcess variant="main" isModalView={true} />
        </div>
      </Modal>
    </section>
  );
};