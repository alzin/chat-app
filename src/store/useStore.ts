import { create } from 'zustand';
import { User, Message, ChatRoom, TypingIndicator } from '../types';

interface ChatState {
  currentUser: User | null;
  users: User[];
  activeRoom: string;
  rooms: ChatRoom[];
  messages: Message[];
  typingUsers: TypingIndicator[];
  isConnected: boolean;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setActiveRoom: (roomId: string) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setTypingIndicator: (typingData: TypingIndicator) => void;
  setConnectionStatus: (status: boolean) => void;
}

const useStore = create<ChatState>((set) => ({
  currentUser: null,
  users: [],
  activeRoom: 'general',
  rooms: [],
  messages: [],
  typingUsers: [],
  isConnected: false,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setUsers: (users) => set({ users }),
  
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  
  setRooms: (rooms) => set({ rooms }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setMessages: (messages) => set({ messages }),
  
  setTypingIndicator: (typingData) => set((state) => {
    // Remove old typing indicator for this user
    const filteredTyping = state.typingUsers.filter(
      (user) => user.userId !== typingData.userId
    );
    
    // Add new typing indicator if user is typing
    if (typingData.isTyping) {
      return {
        typingUsers: [...filteredTyping, typingData]
      };
    }
    
    // Otherwise just remove the indicator
    return {
      typingUsers: filteredTyping
    };
  }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
}));

export default useStore;