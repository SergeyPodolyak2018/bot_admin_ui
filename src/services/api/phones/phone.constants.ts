import { API_BASE_URI, MAIN_PATH } from 'config';

export const PHONE_PREFIX = '/phone-number';
export const PHONE_URL = `${API_BASE_URI}${MAIN_PATH}${PHONE_PREFIX}`;
export const URL = `${API_BASE_URI}/${MAIN_PATH}`;
export const AVAILABLE_COUNTRIES = `${PHONE_URL}/available-countries`;
export const PHONE_NUMBERS = `${PHONE_URL}/available-phone`;
export const PURCHASED_PHONE_NUMBERS = `${PHONE_URL}/purchased`;
export const ASSIGN_PHONE_NUMBERS = `${PHONE_URL}/assign`;
export const INVOICE_HISTORY = `${PHONE_URL}/invoice-history`;
export const DELETE_PHONE = `${PHONE_URL}`;
export const BUY_PHONE = `${PHONE_URL}/buy-phone-number`;
export const ACTIVATE_PHONE_NUMBER = `${PHONE_URL}/activate-phone-number`;
