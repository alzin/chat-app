import React from 'react';
import { User, MessageSquare, Users, Settings } from 'lucide-react';
import useStore from '../store/useStore';
import UserList from './UserList';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'chats' | 'users' | 'settings'>('chats');
  const currentUser = useStore((state) => state.currentUser);
  
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{currentUser?.username}</h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex items-center justify-center py-3 flex-1 transition-colors duration-200 ${
            activeTab === 'chats'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <MessageSquare size={20} className="mr-1" />
          <span className="text-sm font-medium">Chats</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center justify-center py-3 flex-1 transition-colors duration-200 ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Users size={20} className="mr-1" />
          <span className="text-sm font-medium">Users</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center justify-center py-3 flex-1 transition-colors duration-200 ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Settings size={20} className="mr-1" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Recent Chats</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">General Chat</h4>
                      <p className="text-xs text-gray-600">Welcome to the general chat room!</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Now</span>
                    <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
                      3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && <UserList />}
        
        {activeTab === 'settings' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-dark"
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-dark"
                    className="block h-6 rounded-full w-10 bg-gray-300 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 transform"></span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-notifications"
                    className="sr-only"
                    defaultChecked
                  />
                  <label
                    htmlFor="toggle-notifications"
                    className="block h-6 rounded-full w-10 bg-blue-500 cursor-pointer"
                  >
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 transform"></span>
                  </label>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;