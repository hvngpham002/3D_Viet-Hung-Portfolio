/* eslint-disable @typescript-eslint/naming-convention */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vi from './vi.json';
import zh from './zh.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      en: typeof en;
      vi: typeof vi;
      zh: typeof zh;
    };
  }
}

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  zh: { translation: zh }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator']
  }
});

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('language', lang);
});

export default i18n;