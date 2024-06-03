import { Button as TryItNowButton } from 'components/common';
import { CustomInput } from 'components/features/LandingPageFeatures';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changePassword } from 'services';
import { addNotification, useAppDispatch } from 'store';

import styles from './ForgotPasswordForm.module.scss';

export type ChangePasswordProps = {
  onSubmit: (password: string) => void;
  code: string;
  goback: () => void;
};

export const StepThreeChangePassword: FC<ChangePasswordProps> = ({ onSubmit, goback }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (password.length < 8) {
      dispatch(addNotification({ type: 'error', title: 'Passwords should be at least 8 characters', message: '' }));
      return;
    }
    if (confirmPassword !== password) {
      dispatch(addNotification({ type: 'error', title: 'Passwords should be equals', message: '' }));
      return;
    }
    onSubmit(password);
  };

  return (
    <div className={styles.formHolder}>
      <div className={styles.formTitleBlock}>
        <div className={styles.title}>Set new password</div>
        <div className={styles.subTitle}>Must be at least 8 characters.</div>
      </div>
      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={t('landingPageFeatures.LoginPage.enterPassword')}
          isPassword={true}
          onChange={handlePasswordChange}
          label={t('landingPageFeatures.LoginPage.passwordLable')}
        />
      </div>
      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={t('landingPageFeatures.LoginPage.enterPassword')}
          isPassword={true}
          onChange={handleConfirmPasswordChange}
          onKeyDown={handleSubmit}
          label={'Confirm password'}
        />
      </div>
      <div className={styles.buttonsHolder}>
        <TryItNowButton
          style={{
            width: '100%',
            height: '39px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '19px',
            borderColor: '#9CA3B0',
          }}
          label={'Set New Password'}
          onClick={handleSubmit}
        />
      </div>
      <div className={styles.gobackContainer}>
        <span className={styles.title}>Go back to </span>
        <span className={styles.action} onClick={goback}>
          Sign in
        </span>
      </div>
    </div>
  );
};
