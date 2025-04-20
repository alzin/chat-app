import React from 'react';
import { Message } from '../types';
import { formatMessageTime } from '../utils/dateUtils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-gray-700">No messages yet</h3>
          <p className="text-gray-500 mt-1">
            Be the first to send a message in this chat!
          </p>
        </div>
      </div>
    );
  }
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
              {date === new Date().toLocaleDateString() ? 'Today' : date}
            </div>
          </div>
          
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.userId === currentUserId;
            
            // Group consecutive messages from the same user
            const showAvatar =
              index === 0 ||
              dateMessages[index - 1].userId !== message.userId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && showAvatar && (
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${message.username}`}
                    alt={message.username}
                    className="w-8 h-8 rounded-full mr-2 self-end"
                  />
                )}
                
                <div className={`max-w-[70%] ${!isCurrentUser && !showAvatar ? 'ml-10' : ''}`}>
                  {!isCurrentUser && showAvatar && (
                    <div className="text-xs text-gray-500 mb-1 ml-1">
                      {message.username}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <div
                      className={`rounded-lg py-2 px-3 break-words ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      
                      {isCurrentUser && (
                        <span className="ml-1">
                          {message.read ? (
                            <CheckCheck size={14} className="text-blue-500" />
                          ) : (
                            <Check size={14} className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;