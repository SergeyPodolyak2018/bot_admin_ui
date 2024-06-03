import { Button as TryItNowButton } from 'components/common';
import { CustomInput } from 'components/features/LandingPageFeatures';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ForgotPasswordForm.module.scss';

export type SendEmailProps = {
  onSubmit: (str: string) => void;
  goback: () => void;
};

export const StepOneSendEmail: FC<SendEmailProps> = ({ onSubmit, goback }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    console.log(email);
    onSubmit(email);
  };

  return (
    <div className={styles.formHolder}>
      <div className={styles.formTitleBlock}>
        <div className={styles.title}>Forgot password</div>
        <div className={styles.subTitle}>Enter your email for instructions.</div>
      </div>

      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={t('landingPageFeatures.LoginPage.enterEmail')}
          onChange={handleEmailChange}
          label={t('landingPageFeatures.LoginPage.emailLable')}
          type={'email'}
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
          label={'Send'}
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
