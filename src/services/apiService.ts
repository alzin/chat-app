import axios from 'axios';
import { User, Message, ChatRoom } from '../types';

// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = 'https://chat-app-3nk8.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

export const fetchMessages = async (roomId: string = 'general'): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(`/messages?roomId=${roomId}`);
  return response.data;
};

export const fetchRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiClient.get<ChatRoom[]>('/rooms');
  return response.data;
};