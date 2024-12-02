import { get, set } from 'idb-keyval';
import { useCallback } from 'react';
import { Message } from './useAIChat';

const MESSAGES_STORE_KEY = 'nidam_messages';
const OFFLINE_RESPONSES = new Map([
  ['translate', 'Offline translation is available for basic phrases.'],
  ['help', 'Available offline commands: translate, help, status'],
  ['status', 'System is operating in offline mode. Limited functionality available.'],
]);

export function useOfflineStorage() {
  const saveMessages = useCallback(async (messages: Message[]) => {
    try {
      await set(MESSAGES_STORE_KEY, messages);
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, []);

  const loadMessages = useCallback(async (): Promise<Message[]> => {
    try {
      const messages = await get(MESSAGES_STORE_KEY);
      return messages || [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }, []);

  const getOfflineResponse = useCallback((message: string): string => {
    const command = message.toLowerCase().trim();
    for (const [key, response] of OFFLINE_RESPONSES.entries()) {
      if (command.includes(key)) {
        return response;
      }
    }
    return 'I am currently operating in offline mode with limited functionality. Please try again when online.';
  }, []);

  return {
    saveMessages,
    loadMessages,
    getOfflineResponse,
  };
}