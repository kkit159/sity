import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// Импортируем хук из локальной папки переводов этого виджета
import { useTranslation } from '../AddCompanyModal.i18next';
import styles from './EditCompanyModal.module.scss';

// Замени на свою иконку карандаша!
import editIcon from '@/shared/assets/edit.png';

interface EditCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyData?: any;
    onSuccess?: () => void;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, companyData, onSuccess }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [businessType, setBusinessType] = useState<'commercial' | 'non-commercial'>('commercial');

    // Предзаполнение формы при открытии
    useEffect(() => {
        if (isOpen && companyData) {
            const initialType = companyData.organization_type === 'non-profit' ? 'non-commercial' : 'commercial';
            setBusinessType(initialType);

            form.setFieldsValue({
                businessType: initialType,
                orgName: companyData.name,
                inn: companyData.inn,
                ogrn: companyData.ogrn,
                kpp: companyData.kpp,
                address: companyData.address,
                phone: companyData.phone || companyData.contact_phone_number,
            });
        }
    }, [isOpen, companyData, form]);

    const notify = (type: 'success' | 'error', text: string) => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        messageApi.open({
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

        if (!companyData?.id) {
            notify('error', 'Не найден ID компании для обновления.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: values.orgName,
                address: values.address || "",
                phone: values.phone || "",
                organization_type: businessType === 'commercial' ? 'commercial' : 'non-profit',
                ...(businessType === 'commercial' && {
                    inn: values.inn || "",
                    ogrn: values.ogrn || "",
                    kpp: values.kpp || "",
                })
            };

            const response = await fetch(`/api/organization/${companyData.id}/`, {
                method: 'PATCH',
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
                throw new Error(data.detail || data.message || 'Ошибка сервера при обновлении');
            }

            // ИСПРАВЛЕНО: В i18next второй аргумент это объект опций, а не просто строка
            notify('success', t('dataSaved', { defaultValue: 'Изменения сохранены' }));

            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 800);
        } catch (error: any) {
            notify('error', error.message || 'Не удалось сохранить изменения');
            console.error('Update Organization Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
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
                        <img src={editIcon} alt="Edit" />
                    </div>
                    {/* ИСПРАВЛЕНО: TS ошибка устранена */}
                    <p className={styles.subtitle}>{t('editTitle', { defaultValue: 'Редактирование компании' })}</p>
                    <h2 className={styles.title}>{companyData?.name || 'Название компании'}</h2>
                </div>

                <div className={styles.formWrapper}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                        disabled={loading}
                    >
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
                                </div>
                            ) : (
                                <div key="non-commercial" className={styles.fadeIn}>
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

                                    <div className={styles.divider}>
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
                            {loading ? 'Сохранение...' : t('save')}
                        </Button>
                    </Form>
                </div>
            </Modal>
        </>
    );
};