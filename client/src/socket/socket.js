// socket.js

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = (username) => {
    socket.connect();
    socket.emit('user_join', username);
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const sendMessage = (text) => {
    const message = {
      message: text,
      timestamp: new Date().toISOString(),
    };
    socket.emit('send_message', message);
  };

  const sendPrivateMessage = (to, text) => {
    socket.emit('private_message', {
      to,
      message: text,
    });
  };

  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  useEffect(() => {
    const onConnect = () => {
      console.log('✅ Connected to socket');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('❌ Disconnected from socket');
      setIsConnected(false);
    };

    const onReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onPrivateMessage = (msg) => {
      msg.isPrivate = true;
      setMessages((prev) => [...prev, msg]);
    };

    const onUserList = (list) => setUsers(list);

    const onUserJoined = (user) => {
      const joinMsg = {
        id: Date.now(),
        system: true,
        message: `${user.username} joined the chat`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, joinMsg]);
    };

    const onUserLeft = (user) => {
      const leaveMsg = {
        id: Date.now(),
        system: true,
        message: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, leaveMsg]);
    };

    const onTypingUsers = (typingList) => {
      setTypingUsers(typingList);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
    };
  }, []);

  return {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  };
};

export default socket;
