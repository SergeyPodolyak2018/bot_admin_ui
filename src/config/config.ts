import {
  AI_URI,
  API_BASE_URI,
  BETA_FEATURES,
  ENABLE_LANDING_WIDGET,
  LONG_POLLING_TIMER,
  MAIN_PATH,
  PING_TIMEOUT,
  REACT_APP_BUILD_VERSION,
  REACT_APP_USE_MOCK,
  runtimeType,
  RuntimeTypes,
  STRIPE_ID,
  STRIPE_PUBLIC_KEY,
  UI_BASE_URI,
  UI_LANDING_ROOT,
  UI_ROOT,
  WS_BASE_URI,
  WS_PROXY_URI,
  WS_USE_PROXY,
} from './constants';

export const getAPIBaseUri = (): string => API_BASE_URI;
export const getWSBaseUri = (): string => WS_BASE_URI;
export const getWsProxyUri = (): string => WS_PROXY_URI;
export const getUiUri = (): string => UI_BASE_URI;
export const getMainPath = (): string => MAIN_PATH;
export const getStripePk = (): string => STRIPE_PUBLIC_KEY;
export const getStripeId = (): string => STRIPE_ID;
export const getBetaFeaturesEnabled = (): boolean => BETA_FEATURES;
export const getUIRoot = (): string => UI_ROOT;
export const getLandingUIRoot = (): string => UI_LANDING_ROOT;
export const getVersion = (): string => REACT_APP_BUILD_VERSION;
export const getAiUri = (): string => AI_URI;
export const isProductionRuntime = (): boolean => runtimeType === RuntimeTypes.PRODUCTION;
export const isMock = (): boolean => REACT_APP_USE_MOCK === 'true';
export const isWsUseProxy = (): boolean => WS_USE_PROXY === 'true';
export const enableLandingWidget = (): boolean => ENABLE_LANDING_WIDGET === 'true';
export const getPingTimeOut = (): number => Number(PING_TIMEOUT);
export const getLongPollingTimer = (): number => Number(LONG_POLLING_TIMER);
