import { NotificationSnackbar } from 'components/common';
import { ForgotPasswordForm, LoginForm } from 'components/features/LoginPageFeatures';
import { useState } from 'react';

import { googleAuth } from 'services/api';
import { useAuth } from 'utils/hooks/useAuth.ts';

export const LoginPage = () => {
  const [forgotPassword, setForgotPassword] = useState(false);

  useAuth();

  const handleClickForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signUpActionWithGoogle = () => {
    googleAuth();
  };
  return (
    <>
      <NotificationSnackbar />
      {!forgotPassword ? (
        <LoginForm onClickForgotPassword={handleClickForgotPassword} />
      ) : (
        <ForgotPasswordForm onSubmit={() => setForgotPassword(false)} />
      )}
    </>
  );
};
