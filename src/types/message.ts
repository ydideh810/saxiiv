export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  avatar?: string;
  lastSeen?: Date;
  status?: 'online' | 'offline' | 'typing';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice';
  signature?: string;
  nonce?: string;
}

export interface Thread {
  id: string;
  participants: Contact[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface KeyPair {
  publicKey: string;
  secretKey: string;
}