import { BaseState } from 'store/store.types.ts';

export type GlobalState = Omit<BaseState<unknown>, 'data' | 'status'> & {
  loaderCount: number;
  notifications: NotificationToastData[];
  device: any | null;
  sideMenuState: boolean;
};

export type NotificationToastData = {
  id: string;
  message: string;
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export type AddNotificationArgs = Omit<NotificationToastData, 'id'>;
