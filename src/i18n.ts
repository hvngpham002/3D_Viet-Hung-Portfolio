import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initializeTranslations } from './services/supabaseService';

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
  }
});

// Load translations from Supabase
const loadTranslations = async (): Promise<void> => {
  try {
    const translations = await initializeTranslations();
    if (translations) {
      Object.entries(translations).forEach(([lang, resources]) => {
        i18n.addResourceBundle(lang, 'translation', resources, true, true);
      });
      // After loading, we need to ensure the correct language is set
      const currentLng = i18n.language;
      i18n.changeLanguage(currentLng);
    }
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

// Load translations immediately
loadTranslations();

// Save language whenever it changes
i18n.on('languageChanged', (lng: string) => {
  localStorage.setItem('i18n_lng', lng);
});

// Optional: function to reload translations
export const reloadTranslations = (): Promise<void> => loadTranslations();

export default i18n;
