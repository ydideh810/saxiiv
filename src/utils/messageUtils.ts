import { format } from 'date-fns';
import { Message, Thread, Contact } from '../types/message';

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday ? format(date, 'HH:mm') : format(date, 'MMM d, HH:mm');
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createMessage = (
  content: string,
  senderId: string,
  receiverId: string
): Message => {
  return {
    id: generateMessageId(),
    senderId,
    receiverId,
    content,
    timestamp: new Date(),
    status: 'sent',
  };
};

export const sortThreadsByDate = (threads: Thread[]): Thread[] => {
  return [...threads].sort((a, b) => {
    const dateA = a.lastMessage?.timestamp || new Date(0);
    const dateB = b.lastMessage?.timestamp || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};