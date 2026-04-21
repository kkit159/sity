import React, { useState } from 'react';
import { Modal, Form, Input, Button, Switch, message } from 'antd';
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// Импортируем наш правильный хук перевода
import { useTranslation } from '../AddPointModal.i18next';
import styles from './AddPointModal.module.scss';

import pointIcon from '@/shared/assets/buisnes_point.png';

interface AddPointModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    organizationId: number | string; // ID организации
}

export const AddPointModal: React.FC<AddPointModalProps> = ({ isOpen, onClose, onSuccess, organizationId }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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

        if (!organizationId) {
            notify('error', 'Ошибка: ID организации не найден.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                organization_id: organizationId,
                name: values.name,
                address: values.address || "",
                contact_phone_number: values.phone || ""
            };

            const response = await fetch('/api/business/', {
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
                if (response.status === 403) {
                    throw new Error('У вас нет прав на создание бизнес-точки в этой организации.');
                }
                throw new Error(data.detail || data.message || t('errorMsg'));
            }

            // Успешный успех (берем ключ из словаря)
            notify('success', t('successMsg'));

            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
                form.resetFields();
            }, 800);
        } catch (error: any) {
            notify('error', error.message || t('errorMsg'));
            console.error('Add Business Point Error:', error);
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
            width={600}
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
                    <img src={pointIcon} alt="Point" />
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
                    initialValues={{ showContact: true }}
                >
                    <Form.Item
                        label={t('pointName')}
                        name="name"
                        rules={[{ required: true, message: t('nameReq') }]}
                    >
                        <Input size="large" placeholder={t('namePh')} />
                    </Form.Item>

                    <Form.Item
                        label={t('address')}
                        name="address"
                        rules={[{ required: true, message: t('addressReq') }]}
                    >
                        <Input size="large" placeholder={t('addressPh')} />
                    </Form.Item>

                    <div className={styles.switchBlock}>
                        <div className={styles.switchInfo}>
                            <span className={styles.switchLabel}>{t('contactLabel')}</span>
                            <span className={styles.switchDesc}>{t('contactDesc')}</span>
                        </div>
                        <Form.Item name="showContact" valuePropName="checked" noStyle>
                            <Switch className={styles.customSwitch} />
                        </Form.Item>
                    </div>

                    <Form.Item 
                        name="phone"
                        dependencies={['showContact']}
                    >
                        <Input size="large" placeholder="+7 (999) 000-00-00" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.submitBtn}
                        loading={loading}
                    >
                        {loading ? t('loading') : t('save')}
                    </Button>
                </Form>
            </div>
        </Modal>
    );
};