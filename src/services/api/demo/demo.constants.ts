import { API_BASE_URI, MAIN_PATH } from 'config';

export const DEMO_PREFIX = '/demo';
export const DEMO_URL = `${API_BASE_URI}${MAIN_PATH}${DEMO_PREFIX}`;
export const GET_DEMO_BOTS = `${DEMO_URL}`;
export const GET_DEMO_STATUS = `${DEMO_URL}/status`;
