import { getLandingUIRoot, getUIRoot } from 'config';

export const ROOT = getUIRoot();
export const LANDING_ROOT = getLandingUIRoot();

export const NavigationEnum = Object.freeze({
  ROOT,
  LANDING_PAGE: `/`,
  SIGN_UP: `/sign-up`,
  LOGIN: `/login`,
  MAIN: `${ROOT}/main`,
  TEST: `${ROOT}/test`,
  AI_AGENT: `${ROOT}/ai_agent`,
  AI_AGENT_CONFIG: `${ROOT}/ai_agent_config`,
  AI_AGENT_TEMPLATE: `${ROOT}/ai_agent/template`,
  WIDGET: `${ROOT}/widget`,
  AI_WIDGET: `${ROOT}/ai_agent/widget`,
  REPORTS: `${ROOT}/reports`,
  BILLINGS: `${ROOT}/billings`,
  STATISTICS: `${ROOT}/statistics`,
  ORGANISATIONS: `${ROOT}/organizations`,
  INTERACTIONS: `${ROOT}/interactions`,
  TEMPLATES: `${ROOT}/templates`,
  CREATE_BOT: `${ROOT}/create_bot`,
  PROFILE: `${ROOT}/profile`,
  TEST_RECORD_RTC: `/recordRTC`,
  TEST_NOTIFICATION: `/notification`,
  PHONES: `${ROOT}/phones`,
  DASHBOARD: `${ROOT}/home`,
});

// export const NavigationAccess = Object.freeze({
//   TEMPLATES: {entity: 'template', privileges: ['canRead']}
// })
