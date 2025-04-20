import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquare } from 'lucide-react';
import socketService from '../services/socketService';

const UserLoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Generate a unique ID for the user
    const userId = uuidv4();
    
    // Join the chat with the username
    socketService.joinChat({
      id: userId,
      username: username.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
    });
    
    setIsLoading(false);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center">
          <div className="flex justify-center">
            <MessageSquare size={48} className="text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Chat Messenger
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect and chat with users from around the world
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginForm;