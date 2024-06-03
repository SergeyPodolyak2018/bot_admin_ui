import { getWSBaseUri, getWsProxyUri } from 'config';

export const CALL_STATUS = `${getWSBaseUri()}/get_status`;
export const CALLS = `${getWSBaseUri()}/get_status`;
export const GET_MESSAGE = `${getWSBaseUri()}/chat_message`;

export const CHAT_MESSAGE = `${getWSBaseUri()}/chat_message`;
export const SEARCH_TEST = `${getWSBaseUri()}/search_test`;
export const SOCKET_BOT_INIT = `${getWSBaseUri()}/init_bot`;
export const DEMO_VOICE_BOT = `${getWSBaseUri()}/voice_chat`;
export const REFRESH_BOT = `${getWSBaseUri()}/refresh_bot`;
export const DEMO_STATUS = `${getWsProxyUri()}/demo_status`;
