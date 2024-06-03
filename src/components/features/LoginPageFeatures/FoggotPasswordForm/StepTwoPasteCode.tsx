import { Button as TryItNowButton } from 'components/common';
import { CustomInput } from 'components/features/LandingPageFeatures';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addNotification, useAppDispatch } from 'store';

import styles from './ForgotPasswordForm.module.scss';

export type PasteCodeProps = {
  email: string;
  onSubmit: (code: string, password: string) => void;
  resend: () => void;
  goback: () => void;
};

export const StepTwoPasteCode: FC<PasteCodeProps> = ({ onSubmit, email, resend, goback }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  useEffect(() => {
    const savedTime = localStorage.getItem(email + '_timerTime');
    const savedTimestamp = localStorage.getItem(email + '_timerTimestamp');

    if (savedTime && savedTimestamp) {
      const elapsedTime = Date.now() - Number(savedTimestamp);
      const remaining = Number(savedTime) - Math.floor(elapsedTime / 1000);

      if (remaining > 0) {
        setRemainingTime(remaining);
        setTimerRunning(true);
      } else {
        setTimerRunning(false);
        localStorage.removeItem('timerTime');
        localStorage.removeItem('timerTimestamp');
      }
    }
  }, []);

  useEffect(() => {
    let interval: any;

    if (timerRunning) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setTimerRunning(false);
            localStorage.removeItem('timerTime');
            localStorage.removeItem('timerTimestamp');
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartTimer = () => {
    const startTime = 120; // 2 minutes in seconds
    setRemainingTime(startTime);
    setTimerRunning(true);
    localStorage.setItem(email + '_timerTime', startTime.toString());
    localStorage.setItem(email + '_timerTimestamp', Date.now().toString());
  };

  const start = () => {
    if (!timerRunning) {
      handleStartTimer();
      resend();
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getResendBtnClasses = () => [styles.resendButton, timerRunning ? styles.notActiveBtn : ''].join(' ');

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (code.length === 0) {
      dispatch(addNotification({ type: 'error', title: 'Code should be not empty', message: '' }));
      return;
    }
    if (password.length < 8) {
      dispatch(addNotification({ type: 'error', title: 'Passwords should be at least 8 characters', message: '' }));
      return;
    }
    if (confirmPassword !== password) {
      dispatch(addNotification({ type: 'error', title: 'Passwords should be equals', message: '' }));
      return;
    }
    onSubmit(code, password);
  };

  return (
    <div className={styles.formHolder}>
      {/* <form autoComplete="off"> */}
      <div className={styles.formTitleBlock}>
        <div className={styles.title}>Set new password</div>
        <div className={styles.subTitle}>
          We send a code to <b>{email}</b>
        </div>
      </div>
      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={'Enter code'}
          type={'text'}
          onChange={handleCodeChange}
          label={''}
          autoComplete={'code'}
        />
        <div className={styles.resendBlock}>
          <div>
            <span className={styles.resendQuestion} style={{ color: 'rgba(114, 114, 114, 1)' }}>
              Did’t receive the email?{' '}
            </span>
            <span className={getResendBtnClasses()} onClick={start}>
              Click to resend
            </span>
          </div>
          <div className={styles.timer} style={{ display: timerRunning ? 'block' : 'none' }}>
            {' '}
            {formatTime(remainingTime)}
          </div>
        </div>
      </div>
      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={'Enter new password'}
          isPassword={true}
          onChange={handlePasswordChange}
          label={'New Password'}
          autoComplete="new-password"
          subLabel="Must be at least 8 characters"
          disable={code.length === 0}
        />
      </div>
      <div className={styles.fieldsHolder}>
        <CustomInput
          placeHolder={'Enter your password'}
          isPassword={true}
          onChange={handleConfirmPasswordChange}
          label={'Confirm New Password'}
          autoComplete="new-password"
          subLabel="Must be at least 8 characters"
          disable={code.length === 0}
        />
      </div>
      <div className={styles.buttonsHolder}>
        <TryItNowButton
          style={{
            width: '100%',
            height: '47px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19px',
            borderColor: '#9CA3B0',
          }}
          label={'Set new password'}
          onClick={handleSubmit}
          disabled={code.length === 0}
        />
      </div>
      <div className={styles.gobackContainer}>
        <span className={styles.title}>Go back to </span>
        <span className={styles.action} onClick={goback}>
          Sign in
        </span>
      </div>
      {/* </form> */}
    </div>
  );
};
