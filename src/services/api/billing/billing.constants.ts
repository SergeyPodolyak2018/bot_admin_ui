import { API_BASE_URI, MAIN_PATH } from 'config';

export const BILLING_PREFIX = '/billing';
export const BILLING_URL = `${API_BASE_URI}${MAIN_PATH}${BILLING_PREFIX}`;
export const CHANGE_BILLING_PLAN = `${BILLING_URL}/change-plan`;
