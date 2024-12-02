import React, { useState, useEffect } from 'react';
import { Languages, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { get, set } from 'idb-keyval';
import { useTranslation } from '../../hooks/useTranslation';

// Basic offline translations (example data)
const OFFLINE_TRANSLATIONS = {
  'en-es': {
    'hello': 'hola',
    'goodbye': 'adiós',
    'thank you': 'gracias',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
  },
  'en-fr': {
    'hello': 'bonjour',
    'goodbye': 'au revoir',
    'thank you': 'merci',
    'please': 's\'il vous plaît',
    'yes': 'oui',
    'no': 'non',
  },
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

interface Translation {
  input: string;
  output: string;
  from: string;
  to: string;
  timestamp: Date;
}

export function OfflineTranslator() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { translate, isOnline } = useTranslation();

  useEffect(() => {
    loadRecentTranslations();
  }, []);

  const loadRecentTranslations = async () => {
    const stored = await get('recent_translations') || [];
    setRecentTranslations(stored.map((t: Translation) => ({
      ...t,
      timestamp: new Date(t.timestamp)
    })));
  };

  const saveTranslation = async (translation: Translation) => {
    const updated = [translation, ...recentTranslations].slice(0, 10);
    await set('recent_translations', updated);
    setRecentTranslations(updated);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      let translatedText: string;

      if (isOnline) {
        const onlineTranslation = await translate(
          inputText,
          LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang,
          LANGUAGES.find(l => l.code === targetLang)?.name || targetLang
        );

        if (onlineTranslation) {
          translatedText = onlineTranslation;
        } else {
          // Fallback to offline translation
          translatedText = getOfflineTranslation();
        }
      } else {
        translatedText = getOfflineTranslation();
      }

      setTranslation(translatedText);

      const newTranslation: Translation = {
        input: inputText,
        output: translatedText,
        from: sourceLang,
        to: targetLang,
        timestamp: new Date(),
      };

      await saveTranslation(newTranslation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getOfflineTranslation = () => {
    const key = `${sourceLang}-${targetLang}`;
    const translations = OFFLINE_TRANSLATIONS[key as keyof typeof OFFLINE_TRANSLATIONS] || {};
    return translations[inputText.toLowerCase() as keyof typeof translations] || 
           'Translation not available offline';
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 pb-2 border-b border-[#00ff9d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <h2 className="terminal-text text-xs">TRANSLATOR</h2>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-[#00ff9d]" />
              <span className="terminal-text text-[8px] text-[#00ff9d]">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-[#ff6b6b]" />
              <span className="terminal-text text-[8px] text-[#ff6b6b]">OFFLINE</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="terminal-input"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <ArrowRight className="h-4 w-4" />
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="terminal-input"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="terminal-input w-full min-h-[80px] resize-y"
          />
          <button
            onClick={handleTranslate}
            disabled={isLoading}
            className={`terminal-button px-4 w-full ${
              isLoading ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            {isLoading ? 'TRANSLATING...' : 'TRANSLATE'}
          </button>
        </div>

        {translation && (
          <div className="border border-[#00ff9d] rounded p-2">
            <p className="terminal-text text-[10px] text-[#00ff9d]/70">TRANSLATION:</p>
            <p className="terminal-text text-xs mt-1 whitespace-pre-wrap">{translation}</p>
          </div>
        )}

        {recentTranslations.length > 0 && (
          <div className="space-y-2">
            <p className="terminal-text text-[10px] text-[#00ff9d]/70">RECENT TRANSLATIONS:</p>
            {recentTranslations.map((item, index) => (
              <div key={index} className="border border-[#00ff9d] rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="terminal-text text-[8px] text-[#00ff9d]/50">
                    {item.from.toUpperCase()} → {item.to.toUpperCase()}
                  </p>
                  <p className="terminal-text text-[8px] text-[#00ff9d]/50">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="terminal-text text-[10px]">{item.input}</p>
                <p className="terminal-text text-[10px] text-[#00ff9d] mt-1">{item.output}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}