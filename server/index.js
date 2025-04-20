import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// In-memory data store
const users = new Map();
const messages = [];
const chatRooms = new Map();

// Initialize default general chat room
chatRooms.set('general', {
  id: 'general',
  name: 'General',
  messages: []
});

// Routes
app.get('/api/users', (req, res) => {
  res.json(Array.from(users.values()));
});

app.get('/api/messages', (req, res) => {
  const roomId = req.query.roomId || 'general';
  const room = chatRooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json(room.messages);
});

app.get('/api/rooms', (req, res) => {
  res.json(Array.from(chatRooms.values()));
});

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // User joins
  socket.on('user:join', (userData) => {
    const user = {
      id: userData.id || socket.id,
      username: userData.username,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.username}`,
      isOnline: true,
      lastSeen: new Date().toISOString()
    };
    
    users.set(user.id, user);
    
    // Send the user their ID
    socket.emit('user:joined', user);
    
    // Notify everyone about new user
    io.emit('users:update', Array.from(users.values()));
  });
  
  // User sends message
  socket.on('message:send', (messageData) => {
    const roomId = messageData.roomId || 'general';
    const room = chatRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    const message = {
      id: uuidv4(),
      text: messageData.text,
      userId: messageData.userId,
      username: messageData.username,
      timestamp: new Date().toISOString(),
      roomId,
      read: false
    };
    
    room.messages.push(message);
    
    // Broadcast message to all clients in the room
    io.emit('message:new', message);
  });
  
  // User typing
  socket.on('user:typing', (data) => {
    socket.broadcast.emit('user:typing', {
      userId: data.userId,
      username: data.username,
      roomId: data.roomId || 'general',
      isTyping: data.isTyping
    });
  });
  
  // Mark messages as read
  socket.on('message:read', (data) => {
    const roomId = data.roomId || 'general';
    const room = chatRooms.get(roomId);
    
    if (room) {
      room.messages.forEach(msg => {
        if (msg.userId !== data.userId && !msg.read) {
          msg.read = true;
        }
      });
      
      io.emit('messages:update', room.messages);
    }
  });
  
  // User disconnects
  socket.on('disconnect', () => {
    const user = Array.from(users.values()).find(u => u.id === socket.id);
    
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date().toISOString();
      io.emit('users:update', Array.from(users.values()));
    }
    
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});