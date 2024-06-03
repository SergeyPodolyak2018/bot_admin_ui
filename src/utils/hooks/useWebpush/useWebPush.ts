import { VAPID_PUBLIC_KEY } from 'config';
import { useEffect } from 'react';
import { subscribeNotification } from 'services/api/notification/notification.service.ts';
import { selectUserAuth, useAppSelector } from 'store';
import logger from 'utils/logger.ts';

export const useWebPush = () => {
  const isAuth = useAppSelector(selectUserAuth);

  useEffect(() => {
    if (!isAuth) return;
    subscribe();
  }, [isAuth]);

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service.worker.js');
      let subscription = await registration.pushManager.getSubscription();
      if (subscription) return;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });
      await subscribeNotification(subscription);
      logger.info('Subscription:', subscription);
    } catch (error) {
      logger.error('Error subscribing:', error);
    }
  };
};
