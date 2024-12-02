import { usePollinationsChat } from '@pollinations/react';
import { useOnlineStatus } from './useOnlineStatus';

const SYSTEM_PROMPT = `You are a translation assistant. Please translate the provided text accurately while maintaining its original meaning and context. Only respond with the translation, nothing else.`;

export function useTranslation() {
  const isOnline = useOnlineStatus();
  const { sendUserMessage, messages } = usePollinationsChat([
    { role: 'system', content: SYSTEM_PROMPT }
  ]);

  const translateOnline = async (text: string, from: string, to: string) => {
    const prompt = `Translate the following text from ${from} to ${to}:\n\n${text}`;
    await sendUserMessage(prompt);
    const response = messages[messages.length - 1]?.content;
    return response || 'Translation failed';
  };

  return {
    translate: async (text: string, from: string, to: string) => {
      if (isOnline) {
        return await translateOnline(text, from, to);
      }
      return null; // Indicates offline mode should be used
    },
    isOnline
  };
}