/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'EN', flag: '/icons/usa-flag.webp' },
    { code: 'vi', label: 'VI', flag: '/icons/vietnam-flag.webp' },
    { code: 'zh', label: 'ZH', flag: '/icons/china-flag.webp' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) ?? languages[0];
  const availableLanguages = languages.filter((lang) => lang.code !== currentLanguage.code);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle language menu"
        style={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: 'var(--paper-1)',
          border: '1px solid var(--rule-strong)',
          color: 'var(--ink-900)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.08em',
          boxShadow: 'var(--shadow-press)',
          cursor: 'pointer',
        }}
      >
        {currentLanguage.label}
      </button>

      {isOpen && (
        <ul
          className="absolute right-0 top-full z-[60] mt-1"
          style={{
            background: 'var(--paper-1)',
            border: '1px solid var(--rule-strong)',
            boxShadow: 'var(--shadow-card)',
            minWidth: 80,
          }}
        >
          {availableLanguages.map((lang, index) => (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left"
                aria-label={`Select ${lang.code}`}
                style={{
                  background: 'transparent',
                  color: 'var(--ink-900)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  borderBottom:
                    index < availableLanguages.length - 1 ? '1px dotted var(--rule)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <img src={lang.flag} alt="" className="h-5 w-5" />
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageToggle;
