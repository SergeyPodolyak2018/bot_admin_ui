import { AxiosResponse } from 'axios';
import { SendNotificationPayload } from 'services/api/notification/notification.types.ts';

import { apiAxiosInstance as axiosInstance } from 'utils/axios';
import { NOTIFICATION_SUBSCRIBE, SEND_NOTIFICATION } from './notification.constants';

export const subscribeNotification = (payload: PushSubscription): Promise<AxiosResponse> => {
  return axiosInstance.post(NOTIFICATION_SUBSCRIBE, payload);
};

export const sendNotification = (payload: SendNotificationPayload): Promise<AxiosResponse> => {
  return axiosInstance.post(SEND_NOTIFICATION, payload);
};
