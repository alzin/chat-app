export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
}

export interface TypingIndicator {
  userId: string;
  username: string;
  roomId: string;
  isTyping: boolean;
}