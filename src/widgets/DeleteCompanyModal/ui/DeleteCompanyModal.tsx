import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// Импортируем хуки для перевода (убедись, что путь правильный, если у тебя переводы в отдельной папке)
import { useTranslation } from '../DeleteCompanyModal.i18next'; 
import styles from './DeleteCompanyModal.module.scss';

import trashIcon from '@/shared/assets/musorka.png'; 

interface DeleteCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyData?: any; 
    onSuccess?: () => void; 
}

export const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ isOpen, onClose, companyData, onSuccess }) => {
    const { t } = useTranslation();
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

    const handleDelete = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (!token) {
            notify('error', 'Ошибка авторизации. Пожалуйста, войдите снова.');
            return;
        }

        if (!companyData?.id) {
            notify('error', 'Не найден ID компании для удаления.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/organization/${companyData.id}/`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
                }
                const errorData = await response.json().catch(() => ({}));
                // Передаем дефолтный текст на случай, если ключа нет
                throw new Error(errorData.detail || errorData.message || t('errorDeleted', { defaultValue: 'Ошибка удаления' }));
            }

            notify('success', t('successDeleted', { name: companyData.name || '', defaultValue: 'Компания успешно удалена' }));

            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 800);
        } catch (error: any) {
            notify('error', error.message || t('errorDeleted', { defaultValue: 'Ошибка удаления' }));
            console.error('Delete Organization Error:', error);
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
                    <img src={trashIcon} alt="Delete" />
                </div>
                
                <h2 className={styles.title}>{t('deleteTitle', { defaultValue: 'Удалить компанию?' })}</h2>
                <p className={styles.subtitle}>
                    {t('deleteDesc', { 
                        name: companyData?.name ? `ООО «${companyData.name}»` : '',
                        defaultValue: `Вы уверены, что хотите удалить ${companyData?.name ? `ООО «${companyData.name}»` : 'компанию'}?`
                    })}
                </p>

                <div className={styles.actions}>
                    <Button 
                        className={styles.cancelBtn} 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        {t('cancel', { defaultValue: 'Отмена' })}
                    </Button>
                    <Button 
                        type="primary" 
                        className={styles.deleteBtn} 
                        onClick={handleDelete} 
                        loading={loading}
                    >
                        {loading ? 'Удаление...' : t('delete', { defaultValue: 'Удалить' })}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};