import React, { useState } from 'react';
import { Modal, Form, Input, Button, Divider, Checkbox, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useLang } from '@/app/providers/LanguageProvider';
import { useAuthFormStore } from '@/features/auth/model/authStore';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { ConfirmEmailModal } from '../../ConfirmEmailModal/ui/ConfirmEmailModal';
import { ConfirmPhoneModal } from '../../ConfirmPhoneModal/ui/ConfirmPhoneModal';

// ИМПОРТ НАПРЯМУЮ ИЗ СЛОВАРЕЙ (убираем сломанный useTranslation)
import { ru } from '../AuthModal.i18next/ru';
import { en } from '../AuthModal.i18next/en';

import registerBg from '@/shared/assets/register.png';
import vkImg from '@/shared/assets/vk.png';
import yandexImg from '@/shared/assets/yandex.png';

import styles from './AuthModal.module.scss';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (tokenOrEmail?: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const { lang } = useLang();

  // ЖЕЛЕЗОБЕТОННЫЙ ХАК ДЛЯ ПЕРЕВОДОВ:
  const dict = lang === 'EN' ? en : ru;
  const t = (key: keyof typeof ru) => dict[key] || key;

  const setAuth = useAuthStore((state) => state.setAuth);
  const login = useAuthFormStore((state) => state.login);
  const register = useAuthFormStore((state) => state.register);
  const isSubmitting = useAuthFormStore((state) => state.isSubmitting);

  const [isLogin, setIsLogin] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false);
  const [isPhoneConfirmOpen, setIsPhoneConfirmOpen] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPhone, setRegisteredPhone] = useState('');
  const [sessionId, setSessionId] = useState('');

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const toggleMode = () => {
    setIsLogin((prev: boolean) => !prev); // Указали тип boolean, чтобы TS не ругался
  };

  const handleFinish = async (values: any) => {
    try {
      if (isLogin) {
        const result = await login(values.email, values.password, t('error_login'));

        if (result.kind === 'two_factor') {
          messageApi.info(result.message || 'Требуется двухфакторная аутентификация');
          return;
        }

        setAuth(result.accessToken, result.refreshToken);
        messageApi.success(t('success_login'));
        if (onSuccess) onSuccess(result.raw);
        onClose();
        window.location.href = '/dashboard';
      } else {
        const reg = await register(
          {
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            firstName: values.firstName,
            lastName: values.lastName,
            middleName: values.middleName,
            phone: values.phone,
          },
          t('error_reg'),
        );

        setSessionId(reg.sessionId);
        setRegisteredEmail(reg.email);
        setRegisteredPhone(reg.phone);
        setIsEmailConfirmOpen(true);
      }
    } catch (error: unknown) {
      const err = error as Error;
      messageApi.error(err.message || 'Network error');
      console.error('Auth Flow Error:', error);
    }
  };

  const handleSwitchToPhone = () => {
    setIsEmailConfirmOpen(false);
    setTimeout(() => setIsPhoneConfirmOpen(true), 300);
  };

  const handleSwitchToEmail = () => {
    setIsPhoneConfirmOpen(false);
    setTimeout(() => setIsEmailConfirmOpen(true), 300);
  };

  const handleFullClose = () => {
    setIsEmailConfirmOpen(false);
    setIsPhoneConfirmOpen(false);
    onClose();

    setTimeout(() => {
      loginForm.resetFields();
      registerForm.resetFields();
      setRegisteredEmail('');
      setRegisteredPhone('');
      setSessionId('');
      setIsLogin(true);
    }, 300);
  };

  const handleVerifySuccess = () => {
    handleFullClose();
    if (onSuccess) onSuccess(registeredEmail);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={handleFullClose}
        footer={null}
        closable={false}
        centered
        width={940}
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
        <div className={`${styles.container} ${!isLogin ? styles.isRegister : ''} ${theme === 'dark' ? styles.darkTheme : ''}`}>

          <CloseOutlined
            className={`${styles.closeIcon} ${isLogin ? styles.light : styles.dark}`}
            onClick={handleFullClose}
          />

          <div className={styles.formPanel}>
            {/* LOGIN FORM */}
            <div className={`${styles.formWrapper} ${isLogin ? styles.active : ''}`}>
              <h2>{t('login_title')}</h2>
              <Form
                form={loginForm}
                name="login"
                layout="vertical"
                className={styles.form}
                requiredMark={false}
                onFinish={handleFinish}
              >
                <Form.Item
                  label={t('email')}
                  name="email"
                  rules={[
                    { required: true, message: t('email_req') },
                    { type: 'email', message: t('email_err') }
                  ]}
                >
                  <Input placeholder={t('email_ph')} size="large" />
                </Form.Item>

                <Form.Item
                  label={t('pass')}
                  name="password"
                  rules={[{ required: true, message: t('pass_req') }]}
                >
                  <Input.Password placeholder={t('pass_ph')} size="large" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block className={styles.submitBtn} size="large" loading={isSubmitting}>
                  {t('btn_login')}
                </Button>
                <a href="#" className={styles.forgotPass}>{t('forgot')}</a>

                <Divider plain className={styles.divider}>{t('or')}</Divider>

                <div className={styles.socialAuth}>
                  <button type="button" className={styles.socialBtn}>
                    <img src={vkImg} alt="VK" />
                    <span>{t('vk')}</span>
                  </button>
                  <button type="button" className={styles.socialBtn}>
                    <img src={yandexImg} alt="Yandex" />
                    <span>{t('yandex')}</span>
                  </button>
                </div>

                <div className={styles.mobileToggle} onClick={toggleMode}>
                  {t('mobile_to_reg')}
                </div>
              </Form>
            </div>

            {/* REGISTER FORM */}
            <div className={`${styles.formWrapper} ${styles.registerPadding} ${!isLogin ? styles.active : ''}`}>
              <h2>{t('reg_title')}</h2>
              <Form
                form={registerForm}
                name="register"
                layout="vertical"
                className={`${styles.form} ${styles.compactForm}`}
                requiredMark={false}
                onFinish={handleFinish}
              >
                <Form.Item label={t('fname')} name="firstName" rules={[{ required: true, message: t('fname_ph') }]}>
                  <Input placeholder={t('fname_ph')} />
                </Form.Item>

                <Form.Item label={t('lname')} name="lastName" rules={[{ required: true, message: t('lname_ph') }]}>
                  <Input placeholder={t('lname_ph')} />
                </Form.Item>

                <Form.Item label={t('mname')} name="middleName">
                  <Input placeholder={t('mname_ph')} />
                </Form.Item>

                <Form.Item
                  label={t('email')}
                  name="email"
                  rules={[
                    { required: true, message: t('email_req') },
                    { type: 'email', message: t('email_err') }
                  ]}
                >
                  <Input placeholder={t('email_ph')} />
                </Form.Item>

                <Form.Item label={t('phone')} name="phone">
                  <Input placeholder={t('phone_ph')} />
                </Form.Item>

                <Form.Item
                  label={t('pass')}
                  name="password"
                  extra={<span className={styles.passwordHint}>{t('pass_hint')}</span>}
                  rules={[
                    { required: true, message: t('pass_req') },
                    { pattern: /^(?=.*[A-ZА-Я])(?=.*\d).{8,}$/, message: t('pass_err') }
                  ]}
                >
                  <Input.Password placeholder={t('pass_ph')} />
                </Form.Item>

                <Form.Item
                  label={t('pass_conf')}
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: t('pass_conf_req') },
                    {
                      validator(_, value) {
                        if (!value || registerForm.getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error(t('pass_conf_err')));
                      },
                    },
                  ]}
                >
                  <Input.Password placeholder={t('pass_conf_ph')} />
                </Form.Item>

                <Button type="primary" htmlType="submit" block className={styles.submitBtn} size="large" loading={isSubmitting}>
                  {t('btn_reg')}
                </Button>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  className={styles.agreement}
                  rules={[
                    {
                      validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(t('agree_req'))),
                    },
                  ]}
                >
                  <Checkbox>
                    {t('agree')}
                  </Checkbox>
                </Form.Item>

                <Divider plain className={styles.divider}>{t('or')}</Divider>

                <div className={styles.socialAuth}>
                  <button type="button" className={styles.socialBtn}>
                    <img src={vkImg} alt="VK" />
                    <span>{t('vk')}</span>
                  </button>
                  <button type="button" className={styles.socialBtn}>
                    <img src={yandexImg} alt="Yandex" />
                    <span>{t('yandex')}</span>
                  </button>
                </div>

                <div className={styles.mobileToggle} onClick={toggleMode}>
                  {t('mobile_to_log')}
                </div>
              </Form>
            </div>
          </div>

          <div className={styles.infoPanel} style={{ backgroundImage: `url(${registerBg})` }}>
            <div className={`${styles.infoWrapper} ${isLogin ? styles.active : ''}`}>
              <h2>{t('info_reg_title')}</h2>
              <p>{t('info_reg_desc')}</p>
              <Button className={styles.actionBtn} onClick={toggleMode}>
                {t('btn_reg')}
              </Button>
            </div>

            <div className={`${styles.infoWrapper} ${!isLogin ? styles.active : ''}`}>
              <h2>{t('info_log_title')}</h2>
              <p>{t('info_log_desc')}</p>
              <Button className={styles.actionBtn} onClick={toggleMode}>
                {t('btn_login')}
              </Button>
            </div>
          </div>

        </div>
      </Modal>

      <ConfirmEmailModal
        open={isEmailConfirmOpen}
        onClose={handleFullClose}
        email={registeredEmail}
        sessionId={sessionId}
        onSwitchToPhone={handleSwitchToPhone}
        onVerifySuccess={handleVerifySuccess}
      />

      <ConfirmPhoneModal
        open={isPhoneConfirmOpen}
        onClose={handleFullClose}
        phone={registeredPhone}
        sessionId={sessionId}
        onSwitchToEmail={handleSwitchToEmail}
        onVerifySuccess={handleVerifySuccess}
      />
    </>
  );
};