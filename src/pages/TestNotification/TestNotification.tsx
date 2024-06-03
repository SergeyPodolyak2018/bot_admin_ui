import { FC } from 'react';
import { sendNotification } from 'services/api/notification/notification.service.ts';
import { useAuth, useWebPush } from 'utils/hooks';

export const TestNotification: FC = () => {
  useWebPush();
  useAuth();

  return (
    <div>
      <button onClick={() => sendNotification({ title: 'title', text: 'text' })}>SEND</button>
    </div>
  );
};
