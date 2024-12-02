import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import i18n from '../i18n';

const LANGUAGE_STORE_KEY = 'nidam_language';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language) || SUPPORTED_LANGUAGES[0]
  );

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await get(LANGUAGE_STORE_KEY);
      if (stored) {
        const language = SUPPORTED_LANGUAGES.find(lang => lang.code === stored.code);
        if (language) {
          setCurrentLanguage(language);
          await i18n.changeLanguage(language.code);
          document.documentElement.lang = language.code;
          if (language.code === 'ar') {
            document.documentElement.dir = 'rtl';
          } else {
            document.documentElement.dir = 'ltr';
          }
        }
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const changeLanguage = async (language: Language) => {
    try {
      await set(LANGUAGE_STORE_KEY, language);
      setCurrentLanguage(language);
      document.documentElement.lang = language.code;
      if (language.code === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      await i18n.changeLanguage(language.code);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}