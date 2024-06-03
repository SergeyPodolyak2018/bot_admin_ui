import Image from 'assets/img/landingPng/Rectangle 9.png';
import styles from 'pages/LoginPage/loginModal.module.scss';
import { FC, useState } from 'react';
import { StepOneSendEmail } from './StepOneSendEmail.tsx';
import { StepThreeChangePassword } from './StepThreeChangePassword.tsx';
import { StepTwoPasteCode } from './StepTwoPasteCode.tsx';
import { resetPassword, changePassword } from '../../../../services/index.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { addNotification, useAppDispatch } from '../../../../store/index.ts';

export type ForgotPasswordFormProps = {
  onSubmit: () => void;
};

type FormState = 'sendCodeToEmail' | 'pasteCode' | 'changePassword';
export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [currentState, setCurrentState] = useState<FormState>('sendCodeToEmail');
  const [email, setEmail] = useState('');

  const returnToLogin = () => {
    onSubmit();
    localStorage.removeItem(email + '_timerTime');
    localStorage.removeItem(email + '_timerTimestamp');
  };

  const reset = (em?: string) => {
    resetPassword(em || email)
      .then(() => {
        dispatch(addNotification({ type: 'success', title: 'Code sent to email ' + em || email, message: '' }));
        setEmail(em || email);
        setLocalStorageTimer(em || email);
        setCurrentState('pasteCode');
      })
      .catch((err) => {
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Insert correct email' }));
      });
  };

  const changePasswordAction = (code: string, password: string) => {
    changePassword(password, code)
      .then(() => {
        dispatch(addNotification({ type: 'success', title: 'Password changed', message: '' }));
        onSubmit();
      })
      .catch((error) => {
        dispatch(addNotification({ type: 'error', title: 'Error', message: 'Invalid code' }));
        setCurrentState('pasteCode');
      });
  };

  const setLocalStorageTimer = (em: string) => {
    const startTime = 120; // 2 minutes in seconds
    localStorage.setItem(em + '_timerTime', startTime.toString());
    localStorage.setItem(em + '_timerTimestamp', Date.now().toString());
  };

  const handleSubmit = (em: string) => {
    setLocalStorageTimer(em);
    reset(em);
    // const savedTime = localStorage.getItem(em + '_timerTime');
    // const savedTimestamp = localStorage.getItem(em + '_timerTimestamp');

    // if (savedTime && savedTimestamp) {
    //   const elapsedTime = Date.now() - Number(savedTimestamp);
    //   const remaining = Number(savedTime) - Math.floor(elapsedTime / 1000);

    //   if (remaining <= 0) {
    //     reset(em);
    //   }
    // } else {
    //   reset(em);
    // }
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
            {currentState === 'sendCodeToEmail' && <StepOneSendEmail onSubmit={handleSubmit} goback={returnToLogin} />}
            {currentState === 'pasteCode' && email !== '' && (
              <StepTwoPasteCode
                email={email}
                resend={reset}
                onSubmit={(_code, password) => {
                  changePasswordAction(_code, password);
                }}
                goback={returnToLogin}
              />
            )}
            {/* {currentState === 'changePassword' && (
              <StepThreeChangePassword code={code} onSubmit={changePasswordAction} goback={returnToLogin} />
            )} */}
          </div>
        </div>
      </div>
      <div className={styles.imageColumn}>
        <img className={styles.image} src={Image} alt="" />
      </div>
    </div>
  );
};
