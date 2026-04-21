import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { DownOutlined, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '../LandingProcess.i18next';
import { Button } from 'antd';
import { noWidow } from '@/shared/lib/utils';
import styles from './LandingProcess.module.scss';

import queueBg from '@/shared/assets/queue-bg2.png';
import pagerBg from '@/shared/assets/pager-bg2.png';
import questionBg from '@/shared/assets/question.jpg';

type ModuleType = 'queue' | 'pager';

interface Step {
  id: string;
  title: string;
  content: string;
  note?: string;
  fullId?: string;
}

interface LandingProcessProps {
  variant?: 'main' | 'queue' | 'pager';
  isModalView?: boolean;
}

const ProcessCard = ({
  title,
  features,
  bgImage,
  isActive,
  onClick,
  disabled = false
}: {
  title: string;
  features?: string[];
  bgImage: string;
  isActive: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <div
    className={classNames(styles.processCard, {
      [styles.active]: isActive,
      [styles.disabled]: disabled
    })}
    onClick={!disabled ? onClick : undefined}
  >
    <img src={bgImage} alt="" className={styles.bgImage} />

    <div className={styles.content}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {!disabled && (
          <div className={classNames(styles.checkbox, { [styles.checked]: isActive })}>
            <CheckOutlined />
          </div>
        )}
      </div>

      {features && (
        <ul className={styles.featuresList}>
          {features.map((feat, i) => (
            <li key={i}>{feat}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const AccordionRow = ({
  step,
  isOpen,
  onToggle
}: {
  step: Step;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={styles.accordionItem}>
    <div className={styles.itemHeader} onClick={onToggle}>
      <div className={styles.number}>{step.id}</div>
      <div className={styles.title}>{step.title}</div>
      <DownOutlined className={classNames(styles.icon, { [styles.open]: isOpen })} />
    </div>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={styles.itemContent}
        >
          <div className={styles.inner}>
            {noWidow(step.content)}
            {step.note && <div className={styles.note}>{noWidow(step.note)}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const LandingProcess: React.FC<LandingProcessProps> = ({ variant = 'main', isModalView = false }) => {
  const { t } = useTranslation();
  const [selectedModules, setSelectedModules] = useState<ModuleType[]>(variant === 'pager' ? ['pager'] : ['queue']);
  const [openStepId, setOpenStepId] = useState<string | null>(variant === 'pager' ? 'pager-01' : 'queue-01');

  const toggleModule = (module: ModuleType) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleToggle = (id: string) => {
    setOpenStepId(openStepId === id ? null : id);
  };

  const stepsQueue = t('steps_queue', { returnObjects: true }) as Step[];
  const stepsPager = t('steps_pager', { returnObjects: true }) as Step[];

  const currentSteps = [
    ...(selectedModules.includes('queue') ? stepsQueue.map(s => ({ ...s, fullId: `queue-${s.id}` })) : []),
    ...(selectedModules.includes('pager') ? stepsPager.map(s => ({ ...s, fullId: `pager-${s.id}` })) : [])
  ].map((step, index) => ({
    ...step,
    id: String(index + 1).padStart(2, '0')
  }));

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  const queueFeatures = t('cards.queue.features', { returnObjects: true }) as string[];
  const pagerFeatures = t('cards.pager.features', { returnObjects: true }) as string[];

  return (
    <section className={classNames(styles.section, { [styles.isModal]: isModalView })} data-variant={variant}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{noWidow(t('desc'))}</p>
        </div>

        <div className={styles.cardsGrid}>
          <ProcessCard
            title={t('cards.queue.title')}
            bgImage={queueBg}
            isActive={selectedModules.includes('queue')}
            onClick={() => toggleModule('queue')}
            features={queueFeatures}
          />
          <ProcessCard
            title={t('cards.pager.title')}
            bgImage={pagerBg}
            isActive={selectedModules.includes('pager')}
            onClick={() => toggleModule('pager')}
            features={pagerFeatures}
          />
          <ProcessCard
            title={t('cards.soon.title')}
            bgImage={questionBg}
            isActive={false}
            disabled={true}
          />
        </div>

        {currentSteps.length > 0 ? (
          <div className={styles.accordionSection}>
            <h3 className={styles.accordionTitle}>{t('how_it_works')}</h3>
            <div className={styles.list}>
              {currentSteps.map((step) => (
                <AccordionRow
                  key={step.fullId}
                  step={step}
                  isOpen={openStepId === step.fullId}
                  onToggle={() => handleToggle(step.fullId!)}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.zeroStateWrapper}
          >
            <div className={styles.infoBanner}>
              <InfoCircleOutlined className={styles.infoIcon} />
              <p>{noWidow(t('zero_state_info'))}</p>
            </div>

            <Button type="primary" size="large" className={styles.zeroBtn} onClick={handleRegisterClick}>
              {t('btn_reg')}
            </Button>
          </motion.div>
        )}

        {isModalView && currentSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.modalBottomAction}
          >
            <Button type="primary" size="large" className={styles.zeroBtn} onClick={handleRegisterClick}>
              {t('btn_reg')}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};