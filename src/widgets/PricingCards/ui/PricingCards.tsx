import React, { useState } from 'react';
import { InfoCircleOutlined, StarFilled } from '@ant-design/icons';
import { Modal, Tabs, Badge } from 'antd'; 
import { LandingProcess } from '@/widgets/LandingProcess';
import styles from './PricingCards.module.scss';

import { useTranslation } from '../PricingCards.i18next';
import profileDoubleIcon from '@/shared/assets/profile_double.png';
import phoneMessageIcon from '@/shared/assets/phone_message.png';

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
        <circle cx="12" cy="12" r="12" />
        <path d="M7.5 12.5L10.5 15.5L17 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const PricingCards: React.FC = () => {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<'queue' | 'pager'>('queue');
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

    const plansData = t('plans', { returnObjects: true });
    const currentTabPlans = (typeof plansData === 'object' && plansData !== null) ? plansData[activeTab] : null;

    const currentPlans = currentTabPlans ? [
        { ...currentTabPlans.light, id: 'light', isRecommended: false },
        { ...currentTabPlans.business, id: 'business', isRecommended: true }
    ] : [];

    const tabItems = [
        {
            key: 'queue',
            label: (
                <span className={styles.tabLabel}>
                    <span className={styles.tabIcon} style={{ WebkitMaskImage: `url(${profileDoubleIcon})`, maskImage: `url(${profileDoubleIcon})` }} />
                    {t('tabs.queue')}
                </span>
            ),
        },
        {
            key: 'pager',
            label: (
                <span className={styles.tabLabel}>
                    <span className={styles.tabIcon} style={{ WebkitMaskImage: `url(${phoneMessageIcon})`, maskImage: `url(${phoneMessageIcon})` }} />
                    {t('tabs.pager')}
                </span>
            ),
        }
    ];

    return (
        <section className={styles.pricingSection}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <div className={styles.iconWrapper}>
                            <img src={profileDoubleIcon} alt="icon" />
                        </div>
                        <div>
                            <h1 className={styles.title}>{t('title')}</h1>
                            <p className={styles.subtitle}>{t('subtitle')}</p>
                        </div>
                    </div>

                    <div className={styles.controlsArea}>
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={(key) => setActiveTab(key as 'queue' | 'pager')}
                            items={tabItems}
                            className={styles.antdTabs}
                        />

                        <div 
                            className={styles.howItWorksLink} 
                            onClick={() => setIsHowItWorksOpen(true)}
                        >
                            <InfoCircleOutlined /> {t('howItWorks')}
                        </div>
                    </div>
                </header>

                <div className={styles.cardsGrid}>
                    {currentPlans.map((plan: any) => (
                        <article key={plan.id} className={`${styles.card} ${plan.isRecommended ? styles.recommendedCard : ''}`}>
                            {plan.isRecommended && (
                                <div className={styles.badgeWrapper}>
                                    <Badge 
                                        className={styles.antdBadge}
                                        count={
                                            <div className={styles.badgeContent}>
                                                <StarFilled style={{ fontSize: '12px' }} /> Рекомендуем
                                            </div>
                                        } 
                                    />
                                </div>
                            )}
                            <h2 className={styles.cardTitle}>{plan.name}</h2>
                            <div className={styles.priceBlock}>
                                <span className={styles.oldPrice}>{plan.oldPrice}</span>
                                <div className={styles.newPriceRow}>
                                    <span className={styles.newPrice}>{plan.newPrice}</span>
                                    <span className={styles.period}>{plan.period}</span>
                                </div>
                            </div>
                            <p className={styles.description}>{plan.desc}</p>
                            <ul className={styles.featuresList}>
                                {plan.features?.map((feature: string, idx: number) => (
                                    <li key={idx} className={styles.featureItem}>
                                        <CheckIcon />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>

            <Modal
                open={isHowItWorksOpen}
                onCancel={() => setIsHowItWorksOpen(false)}
                footer={null}
                width={1000}
                centered
                destroyOnHidden
                styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: '12px' } }}
            >
                <LandingProcess variant={activeTab} isModalView={true} />
            </Modal>
        </section>
    );
};