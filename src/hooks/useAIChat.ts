import { usePollinationsChat } from '@pollinations/react';
import { useEffect, useState, useCallback } from 'react';
import { useOfflineStorage } from './useOfflineStorage';
import { useOnlineStatus } from './useOnlineStatus';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatConfig {
  seed?: number;
  jsonMode?: boolean;
  model?: string;
}

const DEFAULT_CONFIG: ChatConfig = {
  seed: 42,
  jsonMode: false,
  model: 'mistral-large'
};

export function useAIChat(initialSystemMessage: string, config: ChatConfig = DEFAULT_CONFIG) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { saveMessages, loadMessages, getOfflineResponse } = useOfflineStorage();
  const isOnline = useOnlineStatus();
  
  const { sendUserMessage, messages: onlineMessages } = usePollinationsChat([
    { role: 'system', content: initialSystemMessage }
  ], config);

  useEffect(() => {
    loadMessages().then(setLocalMessages);
  }, [loadMessages]);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = { role: 'user', content: message };
    let response: Message;

    if (isOnline) {
      await sendUserMessage(message);
      const updatedMessages = [...onlineMessages, userMessage];
      setLocalMessages(updatedMessages);
      await saveMessages(updatedMessages);
    } else {
      const offlineResponse = getOfflineResponse(message);
      response = { role: 'assistant', content: offlineResponse };
      const updatedMessages = [...localMessages, userMessage, response];
      setLocalMessages(updatedMessages);
      await saveMessages(updatedMessages);
    }
  }, [isOnline, sendUserMessage, onlineMessages, localMessages, saveMessages, getOfflineResponse]);

  const messages = isOnline ? onlineMessages : localMessages;

  return {
    sendMessage: handleSendMessage,
    messages,
    isOnline,
  };
}