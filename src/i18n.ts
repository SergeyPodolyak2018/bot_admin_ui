import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'translation';

/* eslint-disable */

const detectOptions = {
  // order and from where user language should be detected
  order: ['localStorage', 'sessionStorage', 'navigator'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,
};

i18next
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    detection: detectOptions,

    debug: false,
    fallbackLng: 'en-US',
    defaultNS,
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: `/locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18next;
