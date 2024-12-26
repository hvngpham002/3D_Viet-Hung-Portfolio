import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
  },
  vi: {
    translation: {
      about: "Giới thiệu",
      projects: "Dự án",
      contact: "Liên hệ",
    },
  },
  zh: {
    translation: {
      about: "关于",
      projects: "项目",
      contact: "联系",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en', // Default or saved language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'], // Check localStorage first
  },
});

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('language', lang);
});

export default i18n;