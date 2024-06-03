import { API_BASE_URI, MAIN_PATH } from 'config';
export const STRIPE_PREFIX = '/stripe';
export const STRIPE_URL = `${API_BASE_URI}${MAIN_PATH}${STRIPE_PREFIX}`;
export const GET_PAYMENT_METHODS = `${STRIPE_URL}/payment-methods`;
export const SAVE_PAYMENT_METHOD = `${STRIPE_URL}/payment-methods`;
export const CUSTOMER = `${STRIPE_URL}/customer`;
export const CREATE_PAYMENT = `${STRIPE_URL}/create-payment-intent`;
export const GET_BILLING_HISTORY = `${STRIPE_URL}/get-payment-history`;
