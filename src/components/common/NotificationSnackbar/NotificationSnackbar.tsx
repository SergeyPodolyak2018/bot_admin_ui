import { Alert, Stack, AlertTitle } from '@mui/material';
import { useEffect } from 'react';
import { removeNotificationById, selectNotifications, useAppDispatch, useAppSelector } from 'store';

const color = {
  success: 'linear-gradient(97.56deg, #F1F8F4 0.58%, #F5F5F5 93.38%)',
  error: 'linear-gradient(97.56deg, #F9E7E7 0.58%, #F5F5F5 93.38%)',
  warning: 'linear-gradient(97.56deg, #FAF2EA 0.58%, #F5F5F5 93.38%)',
  info: 'linear-gradient(97.56deg, #EAF6FA 0.58%, #F5F5F5 93.38%)',
};

export const NotificationSnackbar = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  useEffect(() => {
    const latestNotice = notifications[notifications.length - 1];
    const asyncCloseTimeOut = () => {
      if (!latestNotice) return;
      setTimeout(() => {
        dispatch(removeNotificationById(latestNotice.id));
      }, 5000);
    };

    asyncCloseTimeOut();
  }, [dispatch, notifications]);

  return (
    <Stack
      sx={{
        width: '334px',
        position: 'absolute',
        bottom: 50,
        right: 70,
        zIndex: 100001,
      }}>
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          onClose={() => dispatch(removeNotificationById(notification.id))}
          severity={notification.type}
          sx={{
            width: '100%',
            m: 0.5,
            minHeight: '40px',
            backgroundColor: color[notification.type],
            borderRadius: '10px',
            hyphens: 'auto',
          }}>
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.message}
        </Alert>
      ))}
    </Stack>
  );
};
