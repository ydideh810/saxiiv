import { useState, useCallback, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { Message, KeyPair } from '../types/message';
import { generateKeyPair, encryptMessage, decryptMessage, generateSignature } from '../utils/cryptoUtils';

const KEYPAIR_STORE_KEY = 'nidam_keypair';
const MESSAGES_STORE_KEY = 'nidam_p2p_messages';

export function useP2PMessaging() {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    initializeKeyPair();
    loadMessages();
  }, []);

  const initializeKeyPair = async () => {
    try {
      let stored = await get(KEYPAIR_STORE_KEY);
      if (!stored) {
        stored = generateKeyPair();
        await set(KEYPAIR_STORE_KEY, stored);
      }
      setKeyPair(stored);
    } catch (error) {
      console.error('Failed to initialize keypair:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const stored = await get(MESSAGES_STORE_KEY) || [];
      setMessages(stored);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = useCallback(async (
    content: string,
    recipientPublicKey: string
  ): Promise<Message | null> => {
    if (!keyPair) return null;

    try {
      const { encrypted, nonce } = encryptMessage(
        content,
        recipientPublicKey,
        keyPair.secretKey
      );

      const signature = generateSignature(content, keyPair.secretKey);

      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: keyPair.publicKey,
        receiverId: recipientPublicKey,
        content: encrypted,
        timestamp: new Date(),
        status: 'sent',
        type: 'text',
        signature,
        nonce
      };

      const updatedMessages = [...messages, message];
      await set(MESSAGES_STORE_KEY, updatedMessages);
      setMessages(updatedMessages);

      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }, [keyPair, messages]);

  const sendMediaMessage = useCallback(async (
    base64Data: string,
    type: 'image' | 'video' | 'voice',
    recipientPublicKey: string
  ): Promise<Message | null> => {
    if (!keyPair) return null;

    try {
      const { encrypted, nonce } = encryptMessage(
        base64Data,
        recipientPublicKey,
        keyPair.secretKey
      );

      const signature = generateSignature(base64Data, keyPair.secretKey);

      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: keyPair.publicKey,
        receiverId: recipientPublicKey,
        content: encrypted,
        timestamp: new Date(),
        status: 'sent',
        type: type === 'voice' ? 'voice' : type === 'video' ? 'video' : 'image',
        signature,
        nonce
      };

      const updatedMessages = [...messages, message];
      await set(MESSAGES_STORE_KEY, updatedMessages);
      setMessages(updatedMessages);

      return message;
    } catch (error) {
      console.error('Failed to send media message:', error);
      return null;
    }
  }, [keyPair, messages]);

  const receiveMessage = useCallback(async (
    encryptedMessage: Message,
    senderPublicKey: string
  ): Promise<Message | null> => {
    if (!keyPair || !encryptedMessage.nonce) return null;

    try {
      const decrypted = decryptMessage(
        encryptedMessage.content,
        encryptedMessage.nonce,
        senderPublicKey,
        keyPair.secretKey
      );

      const message: Message = {
        ...encryptedMessage,
        content: decrypted,
        status: 'received'
      };

      const updatedMessages = [...messages, message];
      await set(MESSAGES_STORE_KEY, updatedMessages);
      setMessages(updatedMessages);

      return message;
    } catch (error) {
      console.error('Failed to receive message:', error);
      return null;
    }
  }, [keyPair, messages]);

  return {
    keyPair,
    messages,
    sendMessage,
    sendMediaMessage,
    receiveMessage
  };
}