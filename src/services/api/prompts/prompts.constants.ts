import { API_BASE_URI, MAIN_PATH } from 'config';

export const PROMPTS_PREFIX = '/prompts';
export const PROMPTS_URL = `${API_BASE_URI}${MAIN_PATH}${PROMPTS_PREFIX}`;
export const PROMPT = PROMPTS_PREFIX;
export const BOT_PROMPTS = `${PROMPTS_URL}/bot`;
