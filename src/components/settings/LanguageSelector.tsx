import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage, Language } from '../../hooks/useLanguage';

export function LanguageSelector() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4" />
        <h3 className="terminal-text text-xs">LANGUAGE SETTINGS</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`
              terminal-button p-2 flex items-center justify-between gap-2
              ${currentLanguage.code === language.code ? 'bg-[var(--theme-color)]/20' : ''}
            `}
          >
            <span className="terminal-text text-[8px] md:text-[10px]">
              {language.name}
            </span>
            <span className="terminal-text text-[8px] md:text-[10px] text-[var(--theme-color)]/70">
              {language.nativeName}
            </span>
          </button>
        ))}
      </div>

      <div className="border border-[var(--theme-color)] rounded p-4">
        <p className="terminal-text text-[10px] mb-2">CURRENT LANGUAGE:</p>
        <p className="terminal-text text-xs">
          {currentLanguage.name} ({currentLanguage.nativeName})
        </p>
      </div>
    </div>
  );
}