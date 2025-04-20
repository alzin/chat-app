import React, { useEffect, useState } from 'react';
import UserLoginForm from './UserLoginForm';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import useStore from '../store/useStore';
import socketService from '../services/socketService';
import { fetchMessages, fetchRooms } from '../services/apiService';

const ChatLayout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useStore((state) => state.currentUser);
  const setMessages = useStore((state) => state.setMessages);
  const setRooms = useStore((state) => state.setRooms);
  const activeRoom = useStore((state) => state.activeRoom);
  
  useEffect(() => {
    // Initialize socket connection
    socketService.initialize();
    
    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const [messagesData, roomsData] = await Promise.all([
            fetchMessages(activeRoom),
            fetchRooms()
          ]);
          
          setMessages(messagesData);
          setRooms(roomsData);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadInitialData();
    }
  }, [currentUser, activeRoom, setMessages, setRooms]);
  
  if (!currentUser) {
    return <UserLoginForm />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow isLoading={isLoading} />
    </div>
  );
};

export default ChatLayout;