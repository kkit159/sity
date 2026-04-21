import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';

import { useAuthFormStore } from '@/features/auth/model/authStore';
import { useTranslation } from '../ConfirmEmailModal.i18next';

import styles from './ConfirmEmailModal.module.scss';

interface ConfirmEmailModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  sessionId: string;
  onSwitchToPhone?: () => void;
  onVerifySuccess: () => void;
}

export const ConfirmEmailModal: React.FC<ConfirmEmailModalProps> = ({ 
  open, 
  onClose, 
  email,
  sessionId,
  onSwitchToPhone,
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
      console.error('Email Verification Error:', error);
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
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>

          <h2>{t('title')}</h2>
          <p className={styles.subtitle}>
            {t('subtitle')} <br/><strong>{email}</strong>
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

            {onSwitchToPhone && (
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className={styles.phoneLink}
                  onClick={onSwitchToPhone}
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