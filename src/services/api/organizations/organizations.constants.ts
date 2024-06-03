import { API_BASE_URI, MAIN_PATH } from 'config';

export const ORGANISATIONS_PREFIX = '/organizations';
export const ORGANISATIONS_URL = `${API_BASE_URI}${MAIN_PATH}${ORGANISATIONS_PREFIX}`;
export const ORGANISATIONS = ORGANISATIONS_URL;
export const ORGANISATIONS_ASSIGN_USER = `${ORGANISATIONS_URL}/assign-users`;
