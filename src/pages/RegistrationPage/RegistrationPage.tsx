import Image from 'assets/img/landingPng/Rectangle 9.png';
import GoogleIcon from 'assets/svg/google.svg';
import { Button as TryItNowButton, NotificationSnackbar } from 'components/common';
import { CustomInput } from 'components/features';

import { NavigationEnum } from 'navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { googleAuthLink, login, signUp } from 'services/api';
import { localStorageSetItem } from 'services/localStorage.ts';
import { addNotification, setAuthorized, setUserData, useAppDispatch } from 'store';
import { useAuth } from 'utils/hooks/useAuth.ts';
import logger from 'utils/logger.ts';
import styles from './registrationModal.module.scss';

export const RegistrationPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useAuth();
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const signUpAction = () => {
    if (password !== confirmPassword) {
      dispatch(
        addNotification({ message: 'Password and confirm password do not match.', title: 'Error', type: 'error' }),
      );
      return;
    }
    if (!email) {
      dispatch(addNotification({ message: 'The email field is required', title: 'Error', type: 'error' }));
      return;
    }
    if (!password) {
      dispatch(addNotification({ message: 'The password field is required', title: 'Error', type: 'error' }));
      return;
    }
    signUp({ password: password, email: email })
      .catch((e) => {
        logger.debug(e);
        if (e.response.status === 409) {
          dispatch(addNotification({ message: e.response.data.message, title: 'Error', type: 'error' }));
        } else {
          dispatch(addNotification({ message: 'Incorrect email or password', title: 'Error', type: 'error' }));
        }
        throw e;
      })
      .then(() => {
        login({ email: email, password: password }).then((data) => {
          localStorageSetItem('accessToken', data.data.accessToken);
          dispatch(setUserData(data.data));
          dispatch(setAuthorized(true));
          navigate(NavigationEnum.AI_AGENT);
        });
      })
      .catch(() => {});
  };

  return (
    <>
      <NotificationSnackbar />
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
                <p className={styles.subTitle}>{t('landingPageFeatures.RegistrationPage.signUp')}</p>
                <p className={styles.subHeader}>Start your 7-day free trial.</p>
              </div>
              <div className={styles.formHolder}>
                <div className={styles.fieldsHolder}>
                  <CustomInput
                    placeHolder={t('landingPageFeatures.LoginPage.enterEmail')}
                    onChange={handleEmailChange}
                    label={t('landingPageFeatures.LoginPage.emailLable')}
                    onKeyDown={signUpAction}
                  />
                  <CustomInput
                    onKeyDown={signUpAction}
                    placeHolder={t('landingPageFeatures.RegistrationPage.createPassword')}
                    onChange={handlePasswordChange}
                    label={t('landingPageFeatures.LoginPage.passwordLable')}
                    subLabel={t('landingPageFeatures.RegistrationPage.passwordRule')}
                    isPassword={true}
                  />
                  <CustomInput
                    onKeyDown={signUpAction}
                    placeHolder={t('landingPageFeatures.RegistrationPage.confirmPassword')}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    label={t('landingPageFeatures.RegistrationPage.confirmPasswordLable')}
                    subLabel={t('landingPageFeatures.RegistrationPage.passwordRule')}
                    isPassword={true}
                  />
                </div>
                {/* {!isPasswordCorrect && (
              <p className={styles.incorrectDataLabel}>{t('landingPageFeatures.RegistrationPage.passwordMismatch')}</p>
            )} */}
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
                    label={t('landingPageFeatures.RegistrationPage.createAccount')}
                    onClick={signUpAction}
                  />
                  <a href={googleAuthLink()} className={styles.button}>
                    <img src={GoogleIcon} alt="google" />
                    <span className={styles.label}>Sign in with Google</span>
                  </a>
                </div>
                <div className={styles.labelsHolder}>
                  <p className={styles.accountLabel}>
                    {t('landingPageFeatures.RegistrationPage.alreadyHaveAccount')}{' '}
                    <Link className={styles.loginLabel} to={NavigationEnum.LOGIN}>
                      {t('landingPageFeatures.header.signIn')}
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
    </>
  );
};
