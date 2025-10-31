const express = require('express');
const app = express();
const http = require('http'); // Node's built-in HTTP module
const server = http.createServer(app); // Create an HTTP server
const { Server } = require("socket.io"); // Import the Socket.io Server class
const io = new Server(server, { // Attach Socket.io to the HTTP server
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});
const path = require("path");
const cors = require('cors'); 

const port = 3000;

// --- 1. Middleware ---
app.use(cors()); // Allow browser requests

// --- 2. Frontend HTML Route ---
// Serves the index.html file, which is our React App
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- 3. Socket.io Connection Logic ---
// This runs whenever a new client connects
io.on('connection', (socket) => {
  console.log(A user connected: ${socket.id});

  // Listen for a 'chat message' event from a client
  socket.on('chat message', (msg) => {
    // 'msg' is the object { user: '...', text: '...' }
    console.log(Message from ${msg.user}: ${msg.text});
    
    // Broadcast the message to EVERYONE connected (including the sender)
    io.emit('chat message', msg);
  });

  // Listen for the built-in 'disconnect' event
  socket.on('disconnect', () => {
    console.log(User disconnected: ${socket.id});
  });
});

// --- 4. Start Server ---
// IMPORTANT: We use server.listen, not app.listen, to run the combined server
server.listen(port, '0.0.0.0', () => {
    console.log(Socket.io server running on port ${port});
    console.log(Use the ByteXL 'Preview' button for port 3000.);
});
