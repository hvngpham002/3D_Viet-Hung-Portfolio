import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initializeTranslations } from './services/supabaseService';

let isLoading = true;

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
  },
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged loaded',
  }
});

// Load translations from Supabase
const loadTranslations = async () => {
  try {
    isLoading = true;
    const translations = await initializeTranslations();
    if (translations) {
      Object.entries(translations).forEach(([lang, resources]) => {
        i18n.addResourceBundle(lang, 'translation', resources, true, true);
      });
    }
    // Force a reload with the stored language
    const storedLang = localStorage.getItem('i18n_lng');
    if (storedLang) {
      await i18n.changeLanguage(storedLang);
    }
  } catch (error) {
    console.error('Failed to load translations:', error);
  } finally {
    isLoading = false;
    i18n.emit('loaded');
  }
};

// Load translations immediately
loadTranslations();

// Save language whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n_lng', lng);
});

// Optional: Add functions to check loading state and reload translations
export const isLoadingTranslations = () => isLoading;
export const reloadTranslations = () => loadTranslations();

export default i18n;
