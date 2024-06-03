import { API_BASE_URI, MAIN_PATH } from 'config';

export const USERS_PREFIX = '/users';
export const AUTH_PREFIX = '/auth';
export const AUTH_URL = `${API_BASE_URI}${MAIN_PATH}${AUTH_PREFIX}`;
export const USERS_URL = `${API_BASE_URI}${MAIN_PATH}${USERS_PREFIX}`;
export const USER_INFO = `${USERS_URL}/info`;
export const USER_LOGIN = `${AUTH_URL}/login`;
export const RESET_PASSWORD = `${AUTH_URL}/reset-password`;
export const CHANGE_PASSWORD = `${AUTH_URL}/change-password`;
export const USER_SIGN_UP = `${AUTH_URL}/sign-up`;
export const USER_LOGOUT = `${AUTH_URL}/logout`;
export const PING = `${USERS_URL}/ping`;
export const DEVICE_INFO = `${USERS_URL}/device`;
export const USER_GOOGL = `${AUTH_URL}/google`;
export const USER_GOOGL_REDIRECT = `${AUTH_URL}/google-redirect`;
