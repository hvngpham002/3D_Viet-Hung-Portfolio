/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false); // Close dropdown after selection
  };

  // Language options
  const languages = [
    { code: '', flag: '🌐' },
    { code: 'en', flag: '/icons/usa-flag.webp' },
    { code: 'vi', flag: '/icons/vietnam-flag.webp' },
    { code: 'zh', flag: '/icons/china-flag.webp' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const availableLanguages = languages.filter((lang) => lang.code !== i18n.language);

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer text-lg dark:text-white"
        aria-label="Toggle Language Menu"
      >
        <img src={currentLanguage?.flag} alt={currentLanguage?.code} className="w-6 h-6" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute -mt-10 top-full left-0 w-10 bg-gray-100 rounded-full shadow-lg overflow-hidden dark:bg-gray-800 "
        >
          {availableLanguages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className="w-full flex items-center justify-center px-2 py-2 hover:bg-gray-300 text-lg dark:text-white"
                aria-label={`Select ${lang.code}`}
              >
                {lang.flag === '🌐' ? lang.flag : <img src={lang.flag} alt={lang.code} className="w-6 h-6" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageToggle;
