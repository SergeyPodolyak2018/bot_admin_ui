import { ErrorBoundary, Loader, NotificationSnackbar } from 'components/common';
import { MainLayout, StripeWrapper } from 'components/features';
import { Outlet } from 'react-router-dom';
import { selectShowLoading, useAppSelector } from 'store';
import { useAuth, useWebPush } from 'utils/hooks';
import { useFingerprint } from 'utils/hooks/useFingerprint.ts';

export const Root = () => {
  const loader = useAppSelector(selectShowLoading);
  useAuth();
  useFingerprint();
  useWebPush();

  return (
    <StripeWrapper>
      {loader && <Loader type={'full-page'} />}
      <NotificationSnackbar />
      <ErrorBoundary>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ErrorBoundary>
    </StripeWrapper>
  );
};
