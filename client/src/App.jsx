import React, { useEffect, useState } from 'react';
import { useSocket } from './socket/socket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [message, setMessage] = useState('');

  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    setTyping,
  } = useSocket();

  // Disconnect socket on unmount
  useEffect(() => {
    return () => disconnect();
  }, []);

  // Show toast notifications for system or private messages
  useEffect(() => {
    if (!username) return;

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;

    if (latestMessage.system) {
      if (latestMessage.message.includes('joined')) {
        toast.success(`✅ ${latestMessage.message}`);
      } else if (latestMessage.message.includes('left')) {
        toast.warning(`⚠️ ${latestMessage.message}`);
      }
    }

    if (latestMessage.private && latestMessage.sender !== username) {
      toast.info(`📩 Private from ${latestMessage.sender}: ${latestMessage.message}`);
    }
  }, [messages, username]);

  const handleJoin = () => {
    if (inputName.trim()) {
      setUsername(inputName.trim());
      connect(inputName.trim());
    } else {
      toast.error("Name can't be empty");
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {!username ? (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">Join Chat</h1>
            <input
              className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring"
              placeholder="Enter your name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button
              onClick={handleJoin}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Join Chat
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-700">Logged in as: {username}</h2>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="text-sm mb-2 text-gray-600">
              <strong>Online Users:</strong>{' '}
              {users.length > 0 ? users.map((u) => u.username).join(', ') : 'No one online'}
            </div>

            <div className="h-64 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50 mb-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-1 ${msg.system ? 'text-gray-500 italic' : ''}`}
                >
                  {msg.system ? (
                    <span>{msg.message}</span>
                  ) : (
                    <span>
                      <strong>{msg.sender}</strong>: {msg.message}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {typingUsers.length > 0 && (
              <div className="text-sm italic text-gray-500 mb-2">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow border p-2 rounded"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setTyping(e.target.value.length > 0);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default App;
