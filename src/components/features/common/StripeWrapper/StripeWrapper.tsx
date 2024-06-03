import { getStripePk } from 'config';
import { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationEnum } from 'navigation';
import { Elements } from '@stripe/react-stripe-js';

// const LazyElements = lazy(() =>
//   import('').then((module) => ({
//     default: module.Elements,
//   }))
// );
const loadStripe = () => import('@stripe/stripe-js').then((module) => module.loadStripe);

export const StripeWrapper: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  if (!location.pathname.includes(NavigationEnum.BILLINGS)) {
    return <>{children}</>;
  }

  const getStripe = async () => {
    const fn = await loadStripe();
    return fn(getStripePk(), {
      // stripeAccount: getStripeId(),
    });
  };

  return <Elements stripe={getStripe()}>{children}</Elements>;
};
