import React, { useState } from 'react';
import { Select, TimePicker, DatePicker, Empty } from 'antd';
import { WalletOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useTranslation } from '../DashboardPage.i18next';
// Импорты виджетов (через индексные файлы для чистоты)
import { AddCompanyModal } from '@/widgets/AddCompanyModal';
import { EditCompanyModal } from '@/widgets/EditCompanyModal'; 
import { DeleteCompanyModal } from '@/widgets/DeleteCompanyModal';
import { AddPointModal } from '@/widgets/AddPointModal';

import calendarIcon from '@/shared/assets/calendar.png';
import profileIcon from '@/shared/assets/profile.png';
import styles from './DashboardPage.module.scss';

const { RangePicker } = DatePicker;

export const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeSessionTab, setActiveSessionTab] = useState<'all' | 'active' | 'completed'>('all');
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);



    const mockCompanyData = {
        id: 1,
        name: 'Рога и копыта',
        inn: '7712345678',
        ogrn: '1127746000000',
        kpp: '770001001',
        address: 'г. Москва, ул. Пушкина, д. Колотушкина',
        phone: '+7 999 123-45-67',
        organization_type: 'commercial'
    };

    const topCards = [
        { id: 1, title: t('revenue'), value: '0 ₽', icon: <WalletOutlined /> },
        { id: 2, title: t('clients'), value: '0', img: profileIcon },
        { id: 3, title: t('requests'), value: '0', icon: <FileTextOutlined /> },
    ];

    const middleCards = [
        { id: 4, title: t('employees'), extra: <span className={styles.extraText}>{t('addEmp')}</span> },
        { id: 5, title: t('recent') },
        { id: 6, title: t('reqChart') },
        { id: 7, title: t('ordChart') },
        { id: 8, title: t('incChart') },
        { id: 9, title: t('servRev') },
    ];

    return (
        <div className={styles.pageWrapper}>

            <section className={styles.banner}>
                <div className={styles.container}>
                    <div className={styles.bannerContent}>
                        <div>
                            <h2 className={styles.bannerTitle}>{t('bannerTitle')}</h2>
                            <p className={styles.bannerSub}>{t('bannerSub')}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {/* Добавление компании */}
                            <button className={styles.addCompanyBtn} onClick={() => setIsModalOpen(true)}>
                                {t('btnAdd')}
                            </button>

                            {/* Редактирование компании (тест) */}
                            <button
                                className={styles.addCompanyBtn}
                                onClick={() => setIsEditModalOpen(true)}
                                style={{ background: 'rgba(255,255,255,0.1)' }}
                            >
                                Тест: Редактировать
                            </button>

                            {/* Удаление компании (тест) */}
                            <button
                                className={styles.addCompanyBtn}
                                onClick={() => setIsDeleteModalOpen(true)}
                                style={{ background: 'rgba(255,0,0,0.3)' }}
                            >
                                Тест: Удалить
                            </button>

                            {/* Добавление бизнес-точки */}
                            <button 
                                className={styles.addCompanyBtn} 
                                onClick={() => setIsPointModalOpen(true)}
                                style={{ background: '#44607A' }} // Твой фирменный синий для отличия
                            >
                                Добавить точку
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cabinetSection}>
                <div className={styles.container}>
                    <div className={styles.cabinetHeader}>
                        <h1 className={styles.cabinetTitle}>{t('cabTitle')}</h1>
                        <Select
                            className={styles.companySelect}
                            size="large"
                            placeholder={t('noCompany')}
                            options={[]}
                            disabled
                        />
                    </div>

                    <article className={styles.pointsCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{t('cardTitle')}</h3>
                        </div>
                        <div className={styles.cardBody}>
                            <span className={styles.emptyText}>{t('emptyDesc')}</span>
                        </div>
                    </article>

                    <div className={styles.statsHeader}>
                        <h2 className={styles.statsTitle}>
                            <span className={styles.desktopText}>{t('statsTitle')}</span>
                            <span className={styles.mobileText}>{t('statsTitleMobile')}</span>
                        </h2>

                        <div className={styles.datePickerWrapper}>
                            <TimePicker
                                className={styles.customTimePicker}
                                format="HH:mm"
                                placeholder={t('timePlaceholder')}
                                defaultValue={dayjs('09:00', 'HH:mm') as any}
                                allowClear={false}
                                variant="borderless"
                                suffixIcon={<span className={styles.selectArrow}></span>}
                                classNames={{ popup: { root: 'mobile-calendar-popup' } }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                            />

                            <div className={styles.dateRangeInner}>
                                <img src={calendarIcon} alt="calendar" className={styles.calendarIcon} />
                                <RangePicker
                                    className={styles.customDatePicker}
                                    format="DD.MM.YYYY"
                                    separator="-"
                                    allowClear={false}
                                    variant="borderless"
                                    defaultValue={[dayjs('2025-10-10'), dayjs('2025-10-15')] as any}
                                    classNames={{ popup: { root: 'mobile-calendar-popup' } }}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        {topCards.map(card => (
                            <div key={card.id} className={`${styles.statCard} ${styles.col4} ${styles.topCard}`}>
                                <div className={styles.topCardInfo}>
                                    <span className={styles.cardLabel}>{card.title}</span>
                                    <span className={styles.cardValue}>{card.value}</span>
                                </div>
                                <div className={styles.iconWrapper}>
                                    {card.img ? <img src={card.img} alt="icon" /> : card.icon}
                                </div>
                            </div>
                        ))}

                        {middleCards.map(card => (
                            <div key={card.id} className={`${styles.statCard} ${styles.col6} ${styles.emptyCard}`}>
                                <h3 className={styles.gridCardTitle}>{card.title}</h3>
                                <div className={styles.emptyContainer}>
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('emptyData')} />
                                </div>
                                {card.extra && card.extra}
                            </div>
                        ))}

                        <div className={`${styles.statCard} ${styles.col12} ${styles.emptyCard}`}>
                            <h3 className={styles.gridCardTitle}>{t('reviews')}</h3>
                            <div className={styles.emptyContainer}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('emptyData')} />
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.col12} ${styles.emptyCard}`}>
                            <div className={styles.cardHeaderWithTabs}>
                                <h3 className={styles.gridCardTitle}>{t('sessions')}</h3>
                                <div className={styles.tabs}>
                                    <span
                                        className={activeSessionTab === 'all' ? styles.activeTab : ''}
                                        onClick={() => setActiveSessionTab('all')}
                                    >
                                        {t('all')}
                                    </span>
                                    <span
                                        className={activeSessionTab === 'active' ? styles.activeTab : ''}
                                        onClick={() => setActiveSessionTab('active')}
                                    >
                                        {t('active')}
                                    </span>
                                    <span
                                        className={activeSessionTab === 'completed' ? styles.activeTab : ''}
                                        onClick={() => setActiveSessionTab('completed')}
                                    >
                                        {t('completed')}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.emptyContainer}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('emptyData')} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Модальные окна */}
            <AddCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <EditCompanyModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                companyData={mockCompanyData}
            />

            <DeleteCompanyModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                companyData={mockCompanyData}
            />

            {/* Модалка бизнес-точки с прокинутым ID */}
            <AddPointModal
                isOpen={isPointModalOpen}
                onClose={() => setIsPointModalOpen(false)}
                organizationId={mockCompanyData.id} // Вот тут магия передачи ID
                onSuccess={() => {
                    console.log('Успешно создано! Обнови список компаний или точек');
                }}
            />
        </div>
    );
};