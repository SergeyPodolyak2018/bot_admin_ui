import { API_BASE_URI, MAIN_PATH } from 'config';

export const NOTIFICATION_PREFIX = '/notification';
export const NOTIFICATION_URL = `${API_BASE_URI}${MAIN_PATH}${NOTIFICATION_PREFIX}`;
export const NOTIFICATION_SUBSCRIBE = `${NOTIFICATION_URL}/subscribe`;
export const SEND_NOTIFICATION = `${NOTIFICATION_URL}/send`;
