import { API_BASE_URI, MAIN_PATH } from 'config';

export const CATEGORIES_PREFIX = '/categories';
export const CATEGORIES_URL = `${API_BASE_URI}${MAIN_PATH}${CATEGORIES_PREFIX}`;
export const CATEGORY_BY_BOT = `${CATEGORIES_URL}/bot`;
export const CATEGORY = CATEGORIES_URL;
