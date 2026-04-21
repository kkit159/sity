import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '../AddCompanyModal.i18next';
import styles from './AddCompanyModal.module.scss';

import portfelIcon from '@/shared/assets/portfel.png';

interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    
    // ИСПОЛЬЗУЕМ ГЛОБАЛЬНЫЙ MESSAGE ВМЕСТО ХУКА
    const [loading, setLoading] = useState(false);
    const [businessType, setBusinessType] = useState<'commercial' | 'non-commercial'>('commercial');

    const notify = (type: 'success' | 'error', text: string) => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        message.open({
            content: (
                <div className={styles.toastContentInner}>
                    <div className={type === 'success' ? styles.toastIconSuccess : styles.toastIconError}>
                        {type === 'success' ? <CheckOutlined /> : <ExclamationCircleOutlined />}
                    </div>
                    <span>{text}</span>
                </div>
            ),
            duration: 4,
            className: `${styles.customToast} ${isDark ? styles.toastDark : styles.toastLight}`,
        });
    };

    const handleSubmit = async (values: any) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (!token) {
            notify('error', 'Ошибка авторизации. Пожалуйста, войдите снова.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: values.orgName,
                inn: values.inn || "",
                ogrn: values.ogrn || "",
                kpp: values.kpp || "",
                address: values.address || "",
                phone: values.phone || "", 
                organization_type: businessType === 'commercial' ? 'commercial' : 'non-profit'
            };

            const response = await fetch('/api/organization/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
                }
                throw new Error(data.detail || data.message || 'Ошибка сервера при создании');
            }

            notify('success', t('successAdded', { name: data.name || values.orgName }));

            setTimeout(() => {
                onClose();
                form.resetFields();
                setBusinessType('commercial');
            }, 600);
        } catch (error: any) {
            notify('error', error.message || 'Не удалось сохранить организацию');
            console.error('Request Failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
            width={808}
            destroyOnHidden
            rootClassName={styles.modalRoot}
            maskClosable={!loading} 
        >
            <div className={styles.dragHandle}></div>

            <button className={styles.closeButton} onClick={onClose} disabled={loading}>
                <CloseOutlined />
            </button>

            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <img src={portfelIcon} alt="Portfolio" />
                </div>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
            </div>

            <div className={styles.formWrapper}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    disabled={loading}
                    initialValues={{ businessType: 'commercial' }}
                >
                    <Form.Item label={t('businessType')} name="businessType">
                        <Select
                            size="large"
                            onChange={(value) => setBusinessType(value)}
                            options={[
                                { value: 'commercial', label: t('commercial') },
                                { value: 'non-commercial', label: t('nonCommercial') },
                            ]}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                        />
                    </Form.Item>

                    <div className={styles.animatedContent}>
                        {businessType === 'commercial' ? (
                            <div key="commercial" className={styles.fadeIn}>
                                <div className={styles.searchBlock}>
                                    <Form.Item label={t('searchLabel')} name="searchInn" className={styles.noMarginBottom}>
                                        <Input size="large" placeholder={t('searchPh')} />
                                    </Form.Item>
                                    <div className={styles.hintText}>{t('searchHint')}</div>
                                </div>

                                <div className={styles.divider}>
                                    <span>{t('or')}</span>
                                </div>

                                <Form.Item label={t('orgName')} name="orgName" rules={[{ required: true, message: t('orgNamePh') }]}>
                                    <Input size="large" placeholder={t('orgNamePh')} />
                                </Form.Item>

                                <Form.Item label={t('inn')} name="inn">
                                    <Input size="large" placeholder={t('innPh')} />
                                </Form.Item>

                                <Form.Item label={t('ogrn')} name="ogrn">
                                    <Input size="large" placeholder={t('ogrnPh')} />
                                </Form.Item>

                                <Form.Item label={t('kpp')} name="kpp">
                                    <Input size="large" placeholder={t('kppPh')} />
                                </Form.Item>
                            </div>
                        ) : (
                            <div key="non-commercial" className={styles.fadeIn}>
                                <div className={styles.divider} style={{ marginTop: 0 }}>
                                    <span>{t('or')}</span>
                                </div>
                                <Form.Item label={t('orgName')} name="orgName" rules={[{ required: true, message: t('orgNamePh') }]}>
                                    <Input size="large" placeholder={t('orgNamePh')} />
                                </Form.Item>
                            </div>
                        )}

                        <Form.Item label={t('address')} name="address">
                            <Input size="large" placeholder={t('addressPh')} />
                        </Form.Item>

                        <Form.Item label={t('phone')} name="phone" className={styles.lastInput}>
                            <Input size="large" placeholder={t('phonePh')} />
                        </Form.Item>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.submitBtn}
                        loading={loading}
                    >
                        {loading ? 'Создание организации...' : t('save')}
                    </Button>
                </Form>
            </div>
        </Modal>
    );
};