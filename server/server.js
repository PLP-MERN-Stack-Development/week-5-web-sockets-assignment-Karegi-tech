// server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users = []; // { id, username }
let typingUsers = new Set();

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Join user
  socket.on('user_join', (username) => {
    const user = { id: socket.id, username };
    users.push(user);

    io.emit('user_list', users); // send list to all
    socket.broadcast.emit('user_joined', user); // notify others
    console.log(`👤 ${username} joined`);
  });

  // Send message to all
  socket.on('send_message', ({ message }) => {
    const sender = users.find((u) => u.id === socket.id);
    const msgData = {
      from: sender?.username || 'Unknown',
      message,
      timestamp: new Date().toISOString(),
    };
    io.emit('receive_message', msgData);
  });

  // Private message
  socket.on('private_message', ({ to, message }) => {
    const sender = users.find((u) => u.id === socket.id);
    const recipient = users.find((u) => u.id === to);
    if (recipient) {
      io.to(recipient.id).emit('private_message', {
        from: sender?.username || 'Unknown',
        message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    const user = users.find((u) => u.id === socket.id);
    if (!user) return;

    if (isTyping) {
      typingUsers.add(user.username);
    } else {
      typingUsers.delete(user.username);
    }
    io.emit('typing_users', Array.from(typingUsers));
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userIndex = users.findIndex((u) => u.id === socket.id);
    if (userIndex !== -1) {
      const [user] = users.splice(userIndex, 1);
      typingUsers.delete(user.username);
      io.emit('user_list', users);
      socket.broadcast.emit('user_left', user);
      console.log(`❌ ${user.username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
