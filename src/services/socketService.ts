import { io, Socket } from 'socket.io-client';
import useStore from '../store/useStore';
import { Message, User, TypingIndicator } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    
    // this.socket = io('http://localhost:3001');
    this.socket = io('https://chat-app-3nk8.onrender.com:3001');
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      useStore.getState().setConnectionStatus(true);
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      useStore.getState().setConnectionStatus(false);
    });
    
    this.socket.on('user:joined', (user: User) => {
      useStore.getState().setCurrentUser(user);
    });
    
    this.socket.on('users:update', (users: User[]) => {
      useStore.getState().setUsers(users);
    });
    
    this.socket.on('message:new', (message: Message) => {
      useStore.getState().addMessage(message);
    });
    
    this.socket.on('messages:update', (messages: Message[]) => {
      useStore.getState().setMessages(messages);
    });
    
    this.socket.on('user:typing', (typingData: TypingIndicator) => {
      useStore.getState().setTypingIndicator(typingData);
    });
    
    this.initialized = true;
  }
  
  joinChat(userData: Partial<User>) {
    if (!this.socket) return;
    this.socket.emit('user:join', userData);
  }
  
  sendMessage(message: Partial<Message>) {
    if (!this.socket) return;
    this.socket.emit('message:send', message);
  }
  
  sendTypingIndicator(typingData: TypingIndicator) {
    if (!this.socket) return;
    this.socket.emit('user:typing', typingData);
  }
  
  markMessagesAsRead(data: { userId: string; roomId: string }) {
    if (!this.socket) return;
    this.socket.emit('message:read', data);
  }
  
  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;