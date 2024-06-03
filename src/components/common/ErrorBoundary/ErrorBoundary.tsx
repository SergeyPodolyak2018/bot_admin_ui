import { Alert } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import logger from 'utils/logger.ts';

export const FallbackElement = () => {
  return (
    <Alert sx={{ margin: 2 }} variant="outlined" severity="error">
      Oops... {`Something's`} happening
    </Alert>
  );
};

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const errorHandler = (err: PromiseRejectionEvent) => {
      setHasError(true);
      logger.error(`Error Boundary`, err);
    };
    window.addEventListener('unhandledrejection', (err) => errorHandler(err));
    return () => {
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  // if (hasError) {
  //   return <FallbackElement />;
  // }

  return <>{children}</>;
};
