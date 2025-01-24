import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  zh: { translation: zh }
};

// Get saved language from localStorage or default to 'en'
const savedLang = localStorage.getItem('i18n_lng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Save language whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n_lng', lng);
});

export default i18n;
