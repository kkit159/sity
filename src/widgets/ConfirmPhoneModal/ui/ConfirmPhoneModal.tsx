import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';

import { useAuthFormStore } from '@/features/auth/model/authStore';
import { useTranslation } from '../ConfirmPhoneModal.i18next';

import styles from './ConfirmPhoneModal.module.scss';

interface ConfirmPhoneModalProps {
  open: boolean;
  onClose: () => void;
  phone: string;
  sessionId: string;
  onSwitchToEmail?: () => void;
  onVerifySuccess: () => void;
}

export const ConfirmPhoneModal: React.FC<ConfirmPhoneModalProps> = ({ 
  open, 
  onClose, 
  phone,
  sessionId,
  onSwitchToEmail,
  onVerifySuccess
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const verifyCode = useAuthFormStore((state) => state.verifyCode);
  const isSubmitting = useAuthFormStore((state) => state.isSubmitting);

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleFinish = async (values: { code: string }) => {
    try {
      await verifyCode(sessionId, values.code, t('error_verify'));
      messageApi.success(t('success_verify'));
      onVerifySuccess();
    } catch (error: unknown) {
      const err = error as Error;
      messageApi.error(err.message || 'Verification failed');
      console.error('SMS Verification Error:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={540}
        wrapClassName={styles.modalWrap}
        destroyOnHidden
        styles={{
          mask: {
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(235, 240, 245, 0.8)',
            backdropFilter: 'blur(4px)',
          },
          content: {
            background: 'transparent',
            padding: 0,
            boxShadow: 'none',
            border: 'none',
            borderRadius: 0,
            transform: 'translate3d(0, 0, 0)',
          },
          body: { padding: 0 },
          wrapper: { overflow: 'hidden' },
        }}
      >
        <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
          <CloseOutlined className={styles.closeIcon} onClick={onClose} />

          <div className={styles.iconCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>

          <h2>{t('title')}</h2>
          <p className={styles.subtitle}>
            {t('subtitle')} <br/><strong>{phone}</strong>
          </p>

          <Form 
            form={form}
            layout="vertical" 
            className={styles.form} 
            requiredMark={false} 
            onFinish={handleFinish}
          >
            <Form.Item 
              label={t('code_label')} 
              name="code"
              rules={[
                { required: true, message: t('code_req') },
                { pattern: /^\d+$/, message: t('code_err') },
                { len: 6, message: t('code_len') } 
              ]}
            >
              <Input 
                placeholder={t('code_ph')} 
                maxLength={6} 
                autoFocus 
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                disabled={isSubmitting}
              /> 
            </Form.Item>

            <Button type="primary" htmlType="submit" block className={styles.submitBtn} size="large" loading={isSubmitting}>
              {t('btn_submit')}
            </Button>

            {onSwitchToEmail && (
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className={styles.emailLink}
                  onClick={onSwitchToEmail}
                  disabled={isSubmitting}
                >
                  {t('btn_switch')}
                </button>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};