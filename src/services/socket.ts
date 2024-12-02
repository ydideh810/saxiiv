import { io, Socket } from 'socket.io-client';
import { Message } from '../types/message';

export class SocketService {
  private socket: Socket;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private statusCallbacks: ((status: { userId: string; status: string }) => void)[] = [];

  constructor() {
    this.socket = io('wss://localhost:5173', {
      transports: ['websocket'],
      autoConnect: false,
    });

    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('message', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('status', (status: { userId: string; status: string }) => {
      this.statusCallbacks.forEach(callback => callback(status));
    });
  }

  connect(userId: string) {
    this.socket.auth = { userId };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: Message) {
    this.socket.emit('message', message);
  }

  onMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback);
  }

  onStatus(callback: (status: { userId: string; status: string }) => void) {
    this.statusCallbacks.push(callback);
  }

  sendTyping(recipientId: string) {
    this.socket.emit('typing', { recipientId });
  }
}

export const socketService = new SocketService();