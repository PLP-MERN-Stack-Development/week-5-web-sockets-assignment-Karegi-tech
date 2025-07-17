Real-Time Chat App
A full-stack real-time chat application built using the MERN Stack (MongoDB, Express, React, Node.js) and Socket.IO for bi-directional communication between clients.

🔧 Features
🔗 Real-time messaging with WebSockets (Socket.IO)

👥 Join/leave chat room notifications

📶 Online/offline status indicator

✍️ Typing indicator

🔔 Notification sound for new messages

📬 Browser notifications for new messages

🔢 Unread message count (shown in the browser tab)

💬 System messages for user join/leave

🎨 Styled with Tailwind CSS

📁 Project Structure
pgsql
Copy
Edit
📦 project-root
├── client             # React frontend
│   ├── public
│   │   ├── notification.mp3
│   │   └── chat-icon.png
│   └── src
│       ├── App.jsx
│       ├── pages
│       │   └── ChatPage.jsx
│       └── socket.js
├── server             # Express + Socket.IO backend
│   └── server.js
└── package.json
🚀 Setup Instructions
1. Clone the repository
bash
Copy
Edit
git clone <your-repo-url>
cd project-root
2. Start the backend
bash
Copy
Edit
cd server
npm install
npm run dev
Make sure your backend runs on http://localhost:5000.

3. Start the frontend
bash
Copy
Edit
cd client
npm install
npm run dev
The frontend runs on http://localhost:5173.

📸 Screenshots
Chat Interface	User List	Notifications
✅ Typing + message bubbles	✅ Online users & typing status	✅ Sound + desktop alerts

📦 Dependencies
Backend:

express

socket.io

nodemon

Frontend:

react

socket.io-client

tailwindcss

🧪 Bonus Features Implemented
 Sound notifications

 Browser notifications via Web Notifications API

 Tab unread message counter

 Typing indicator

 System join/leave messages