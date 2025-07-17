import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../socket';

const ChatPage = ({ username }) => {
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messageEndRef = useRef(null);
  const {
    messages,
    users,
    typingUsers,
    sendMessage,
    setTyping,
    isConnected,
  } = useSocket();

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  const showBrowserNotification = (msg) => {
    if (Notification.permission === 'granted' && msg.username !== username && !msg.system) {
      new Notification(`New message from ${msg.username}`, {
        body: msg.message,
        icon: '/chat-icon.png',
      });
    }
  };

  useEffect(() => {
    if (document.hidden) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && !lastMsg.system && lastMsg.username !== username) {
        setUnreadCount((count) => count + 1);
        playNotificationSound();
        showBrowserNotification(lastMsg);
      }
    } else {
      setUnreadCount(0);
    }
  }, [messages, username]);

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) Chat App` : 'Chat App';
  }, [unreadCount]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white border-r overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Users Online</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="text-gray-800">
              {user.username} {typingUsers.includes(user.username) && <span className="text-sm text-blue-500">typing...</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-md ${msg.system ? 'bg-gray-300 text-center text-sm text-gray-600' : msg.username === username ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-white border text-gray-900 self-start mr-auto'}`}
            >
              {!msg.system && (
                <p className="text-xs text-gray-500 mb-1">{msg.username}</p>
              )}
              <p>{msg.message}</p>
              <p className="text-[10px] text-gray-400 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2">
            <textarea
              value={message}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md resize-none h-16"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">{isConnected ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
