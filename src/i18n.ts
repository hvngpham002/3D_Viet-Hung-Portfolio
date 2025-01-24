import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initializeTranslations } from './services/supabaseService';

// Initialize with empty resources
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    zh: { translation: {} },
    vi: { translation: {} }
  },
  lng: localStorage.getItem('i18n_lng') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

// Load translations from Supabase
const loadTranslations = async () => {
  const translations = await initializeTranslations();
  if (translations) {
    Object.entries(translations).forEach(([lang, resources]) => {
      i18n.addResourceBundle(lang, 'translation', resources, true, true);
    });
  }
};

// Load translations immediately
loadTranslations().catch(console.error);

// Save language whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n_lng', lng);
});

// Optional: Add a function to reload translations
export const reloadTranslations = () => loadTranslations();

export default i18n;
