import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    navigate('/chat', { state: { username: username.trim() } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-6 text-blue-600">Join Chat</h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
};

export default JoinPage;
