import pjson from '../../package.json';

export enum RuntimeTypes {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

export const runtimeType = import.meta.env.NODE_ENV;

export const MAIN_PATH = import.meta.env.VITE_MAIN_PATH || '/chatbot';
export const UI_ROOT = import.meta.env.VITE_UI_ROOT || '/admin';
export const UI_LANDING_ROOT = import.meta.env.VITE_UI_LANDING_ROOT || '';
export const ENABLE_LANDING_WIDGET = import.meta.env.VITE_ENABLE_LANDING_WIDGET || 'false';
export const API_BASE_URI = import.meta.env.VITE_API_BASE_URI || 'https://dev.monobot.ai/api';
export const WS_USE_PROXY = import.meta.env.VITE_WS_USE_PROXY || 'true'; // set true if use chatbot-admin-api
export const WS_URI = import.meta.env.VITE_WS_BASE_URI || 'wss://slicehouse.etring.com:8000';
export const WS_PROXY_URI = import.meta.env.VITE_WS_PROXY_URI || 'wss://dev.monobot.ai/api/ws';
export const WS_BASE_URI = WS_USE_PROXY === 'true' ? WS_PROXY_URI : WS_URI; // If used proxy use chat-bot api url
export const UI_BASE_URI = import.meta.env.VITE_UI_BASE_URI || `${window.location.protocol}//${window.location.host}/`;
export const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  'pk_test_51OuEXG075WicEZ2nBnQaVe56wIqnncYURAYGMqvqOvNHoudkxldCImVFjOPfrFX0zvsdBfadhtDPBueyR1zZqn8300svJELfut';
export const STRIPE_ID = import.meta.env.VITE_STRIPE_ID || '';
export const AI_URI = import.meta.env.VITE_REACT_APP_AI_URI || 'http://94.101.98.158:8012';
export const BETA_FEATURES = import.meta.env.VITE_FEATURES_ENABLED === 'true';
export const REACT_APP_BUILD_VERSION = import.meta.env.VITE_REACT_APP_VERSION || pjson.version;
export const REACT_APP_USE_MOCK = import.meta.env.VITE_REACT_APP_USE_MOCK || 'false';
export const PING_TIMEOUT = import.meta.env.VITE_PING_TIMEOUT || 60 * 1000;
export const LONG_POLLING_TIMER = import.meta.env.VITE_PING_TIMEOUT || 15000;
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'debug';
export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  'BLOiMPmE6_rhlnYCnGeLsDHrn0ZygeeoYngIELgX-5W75g4EoGZbo8Zbqco_lFKgjsFj7KpMHbhqteOPJK4sIig';
