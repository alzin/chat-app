import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useStore from '../store/useStore';
import socketService from '../services/socketService';

interface ChatWindowProps {
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isLoading }) => {
  const currentUser = useStore((state) => state.currentUser);
  const messages = useStore((state) => state.messages);
  const activeRoom = useStore((state) => state.activeRoom);
  const typingUsers = useStore((state) => state.typingUsers);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollToBottom && messages.length > 0) {
      // Request animation frame to ensure DOM is updated
      requestAnimationFrame(() => {
        const messageList = document.getElementById('message-list');
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      });
    }
  }, [messages, scrollToBottom]);
  
  // Mark messages as read
  useEffect(() => {
    if (currentUser && activeRoom) {
      socketService.markMessagesAsRead({
        userId: currentUser.id,
        roomId: activeRoom
      });
    }
  }, [currentUser, activeRoom, messages]);
  
  // Get typing users for the current room
  const currentTypingUsers = typingUsers
    .filter(user => user.roomId === activeRoom && user.userId !== currentUser?.id && user.isTyping)
    .map(user => user.username);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="py-3 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
              G
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              General Chat
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="truncate">
                {isLoading ? 'Loading...' : `${messages.length} messages`}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4" id="message-list">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={currentUser?.id || ''} />
        )}
      </div>
      
      {/* Typing Indicator */}
      {currentTypingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500 italic">
          {currentTypingUsers.join(', ')} {currentTypingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      
      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;