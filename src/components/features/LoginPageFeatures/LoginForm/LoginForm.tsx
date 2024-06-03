import Image from 'assets/img/landingPng/Rectangle 9.png';
import GoogleIcon from 'assets/svg/google.svg';
import { AxiosError } from 'axios';
import { Button as TryItNowButton } from 'components/common';
import { CustomInput } from 'components/features/LandingPageFeatures';
import { NavigationEnum } from 'navigation';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { googleAuthLink, localStorageSetItem, login } from 'services';
import { addNotification, setAuthorized, setUserData, useAppDispatch } from 'store';
import styles from './LoginForm.module.scss';

export type LoginFormProps = {
  onClickForgotPassword: () => void;
};
export const LoginForm: FC<LoginFormProps> = ({ onClickForgotPassword }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const loginAction = () => {
    if (!email) {
      dispatch(addNotification({ message: 'The email field is required', title: 'Error', type: 'error' }));
      return;
    }
    if (!password) {
      dispatch(addNotification({ message: 'The password field is required', title: 'Error', type: 'error' }));
      return;
    }
    login({ email: email, password: password })
      .then((data) => {
        localStorageSetItem('accessToken', data.data.accessToken);
        dispatch(setUserData(data.data));
        dispatch(setAuthorized(true));
      })
      .catch((err: AxiosError) => {
        const errorMessage = (err?.response?.data as any).message;
        const currentMessage = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
        if (err?.response) {
          dispatch(addNotification({ message: currentMessage, title: 'Error', type: 'error' }));
        }
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formColumn}>
        <div className={styles.titleHolder}>
          <div className={styles.title} onClick={() => navigate('/')}>
            {t('header.title')}
          </div>
        </div>
        <div className={styles.subWrappr}>
          <div className={styles.subWrapprCenter}>
            <div className={styles.subTitleHolder}>
              <p className={styles.subTitle}>{t('landingPageFeatures.header.signIn')}</p>
              <p className={styles.helptext}>Enter your credentials to access your account.</p>
            </div>
            <div className={styles.formHolder}>
              <div className={styles.fieldsHolder}>
                <CustomInput
                  placeHolder={t('landingPageFeatures.LoginPage.enterEmail')}
                  onChange={handleEmailChange}
                  label={t('landingPageFeatures.LoginPage.emailLable')}
                  onKeyDown={loginAction}
                />
                <div>
                  <CustomInput
                    placeHolder={t('landingPageFeatures.LoginPage.enterPassword')}
                    isPassword={true}
                    onChange={handlePasswordChange}
                    onKeyDown={loginAction}
                    label={t('landingPageFeatures.LoginPage.passwordLable')}
                  />
                  <div className={styles.forgotPassword}>
                    <div className={styles.forgotPassword__text} onClick={onClickForgotPassword}>
                      Forgot Password?
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttonsHolder}>
                <TryItNowButton
                  style={{
                    width: '100%',
                    height: '41px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '19px',
                    borderColor: '#9CA3B0',
                  }}
                  label={t('landingPageFeatures.header.signIn')}
                  onClick={loginAction}
                />
                <a href={googleAuthLink()} className={styles.button}>
                  <img src={GoogleIcon} alt="google" />
                  <span className={styles.label}>Sign in with Google</span>
                </a>
              </div>
              <div className={styles.labelsHolder}>
                <p className={styles.accountLabel}>
                  {t('landingPageFeatures.LoginPage.doesntHaveAccount')}
                  <Link className={styles.loginLabel} to={NavigationEnum.SIGN_UP}>
                    {' '}
                    {t('landingPageFeatures.header.signUp')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.imageColumn}>
        <img className={styles.image} src={Image} alt="" />
      </div>
    </div>
  );
};
