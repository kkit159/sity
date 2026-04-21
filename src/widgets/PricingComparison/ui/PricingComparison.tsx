import React, { useState } from 'react';
import { useTranslation } from '../PricingComparison.i18next';
import styles from './PricingComparison.module.scss';

type PlanStatus = 'check' | 'cross' | 'none';

type PlanValue = {
    text?: string;
    status: PlanStatus;
};

interface Feature {
    id: string;
    name: string;
    lite: PlanValue;
    business: PlanValue;
}

interface FeatureCategory {
    id: string;
    categoryName: string;
    features: Feature[];
}

const renderValue = (value: PlanValue) => {
    return (
        <div className={styles.valueContainer}>
            {value.status === 'check' && <span className={styles.checkIcon}>✓</span>}
            {value.status === 'cross' && <span className={styles.crossIcon}>✕</span>}
            {value.text && <span className={styles.valueText}>{value.text}</span>}
        </div>
    );
};

export const PricingComparison: React.FC = () => {
    const { t } = useTranslation();

    const [openCategories, setOpenCategories] = useState<string[]>(['business-process']);
    const [mobilePlan, setMobilePlan] = useState<'lite' | 'business'>('lite');

    const toggleCategory = (id: string) => {
        setOpenCategories((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const getCommonFeatures = (prefix: string): Feature[] => [
        { 
            id: `${prefix}1`, name: t('features.f1Name'), 
            lite: { text: t('features.f1Lite'), status: 'none' }, business: { text: t('features.f1Bus'), status: 'none' } 
        },
        { 
            id: `${prefix}2`, name: t('features.f2Name'), 
            lite: { text: t('features.f2Lite'), status: 'cross' }, business: { status: 'check' } 
        },
        { 
            id: `${prefix}3`, name: t('features.f3Name'), 
            lite: { text: t('features.f3Both'), status: 'check' }, business: { text: t('features.f3Both'), status: 'check' } 
        },
        { 
            id: `${prefix}4`, name: t('features.f4Name'), 
            lite: { status: 'cross' }, business: { status: 'check' } 
        },
        { 
            id: `${prefix}5`, name: t('features.f5Name'), 
            lite: { status: 'cross' }, business: { text: t('features.f5Bus'), status: 'check' } 
        },
        { 
            id: `${prefix}6`, name: t('features.f6Name'), 
            lite: { status: 'cross' }, business: { text: t('features.f6Bus'), status: 'check' } 
        },
        { 
            id: `${prefix}7`, name: t('features.f7Name'), 
            lite: { text: t('features.f7Lite'), status: 'check' }, business: { text: t('features.f7Bus'), status: 'check' } 
        },
        { 
            id: `${prefix}8`, name: t('features.f8Name'), 
            lite: { text: t('features.f8Lite'), status: 'none' }, business: { text: t('features.f8Bus'), status: 'none' } 
        },
        { 
            id: `${prefix}9`, name: t('features.f9Name'), 
            lite: { text: t('features.f9Lite'), status: 'none' }, business: { text: t('features.f9Bus'), status: 'none' } 
        },
    ];

    const comparisonData: FeatureCategory[] = [
        {
            id: 'business-process',
            categoryName: t('categories.bp'),
            features: getCommonFeatures('bp'),
        },
        {
            id: 'client-interaction',
            categoryName: t('categories.ci'),
            features: getCommonFeatures('ci'),
        },
        {
            id: 'reports',
            categoryName: t('categories.rp'),
            features: getCommonFeatures('rp'),
        },
    ];

    return (
        <section className={styles.comparisonWidget} data-mobile-plan={mobilePlan}>
            <div className={styles.container}>
                
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{t('title')}</h2>
                </div>

                <div className={styles.mobileSelectorWrapper}>
                    <select 
                        className={styles.mobileSelect}
                        value={mobilePlan}
                        onChange={(e) => setMobilePlan(e.target.value as 'lite' | 'business')}
                    >
                        <option value="lite">{t('planLiteMobile')}</option>
                        <option value="business">{t('planBusinessMobile')}</option>
                    </select>
                </div>

                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        
                        <div className={styles.tableCard}>
                            {comparisonData.map((category) => {
                                const isOpen = openCategories.includes(category.id);

                                return (
                                    <div className={styles.categoryBlock} key={category.id}>
                                        
                                        <div 
                                            className={styles.categoryHeader} 
                                            onClick={() => toggleCategory(category.id)}
                                        >
                                            <div className={`${styles.arrowBox} ${isOpen ? styles.arrowOpen : ''}`}>
                                                <span className={styles.arrowIcon}>▼</span>
                                            </div>
                                            <span className={styles.categoryTitle}>{category.categoryName}</span>
                                        </div>

                                        <div className={`${styles.collapsibleContent} ${isOpen ? styles.contentVisible : ''}`}>
                                            <div className={styles.plansHeaderRow}>
                                                <div className={styles.headerCellEmpty}></div>
                                                <div className={styles.headerCell}>{t('planLite')}</div>
                                                <div className={styles.headerCell}>{t('planBusiness')}</div>
                                            </div>

                                            <div className={styles.featuresList}>
                                                {category.features.map((feature) => (
                                                    <div className={styles.featureRow} key={feature.id}>
                                                        <div className={styles.featureName}>{feature.name}</div>
                                                        <div className={`${styles.featureValue} ${styles.liteValue}`}>
                                                            {renderValue(feature.lite)}
                                                        </div>
                                                        <div className={`${styles.featureValue} ${styles.businessValue}`}>
                                                            {renderValue(feature.business)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};