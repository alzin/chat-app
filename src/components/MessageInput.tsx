import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import useStore from '../store/useStore';
import socketService from '../services/socketService';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const currentUser = useStore((state) => state.currentUser);
  const activeRoom = useStore((state) => state.activeRoom);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentUser) return;
    
    socketService.sendMessage({
      text: message.trim(),
      userId: currentUser.id,
      username: currentUser.username,
      roomId: activeRoom
    });
    
    // Clear message and typing indicator
    setMessage('');
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Send stopped typing event
    socketService.sendTypingIndicator({
      userId: currentUser.id,
      username: currentUser.username,
      roomId: activeRoom,
      isTyping: false
    });
  };
  
  // Handle typing indicator
  useEffect(() => {
    if (!currentUser) return;
    
    if (message && !isTyping) {
      setIsTyping(true);
      socketService.sendTypingIndicator({
        userId: currentUser.id,
        username: currentUser.username,
        roomId: activeRoom,
        isTyping: true
      });
    }
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout
    typingTimeoutRef.current = window.setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketService.sendTypingIndicator({
          userId: currentUser.id,
          username: currentUser.username,
          roomId: activeRoom,
          isTyping: false
        });
      }
    }, 2000);
    
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, currentUser, activeRoom]);
  
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
      >
        <Paperclip size={20} />
      </button>
      
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[50px] max-h-[120px]"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="button"
          className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Smile size={20} />
        </button>
      </div>
      
      {message.trim() ? (
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
        </button>
      ) : (
        <button
          type="button"
          className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
        >
          <Mic size={20} />
        </button>
      )}
    </form>
  );
};

export default MessageInput;