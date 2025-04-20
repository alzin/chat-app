import React from 'react';
import useStore from '../store/useStore';
import { formatLastSeen } from '../utils/dateUtils';

const UserList: React.FC = () => {
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);
  
  // Filter out current user and sort by online status
  const sortedUsers = [...users]
    .filter(user => user.id !== currentUser?.id)
    .sort((a, b) => {
      // Online users first
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      
      // Then sort by username
      return a.username.localeCompare(b.username);
    });
  
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        All Users ({sortedUsers.length})
      </h3>
      
      <div className="space-y-3">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              {user.isOnline && (
                <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{user.username}</h4>
              <p className="text-xs text-gray-500">
                {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
              Message
            </button>
          </div>
        ))}
        
        {sortedUsers.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No other users are currently available
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;