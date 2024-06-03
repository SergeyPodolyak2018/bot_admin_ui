import { API_BASE_URI, MAIN_PATH } from '../../../config';

export const FILES_PREFIX = '/files';
export const FILES_URL = `${API_BASE_URI}${MAIN_PATH}${FILES_PREFIX}`;
export const FILES = FILES_URL;
export const BOT_FILES = `${FILES_URL}/bot`;
