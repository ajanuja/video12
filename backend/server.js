const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user joins with a name
  socket.on('join', (name) => {
    users[socket.id] = name;
    io.emit('users', users); // Send the updated user list to all clients
  });

  // Handle offer, answer, and candidate signals
  socket.on('offer', (data) => {
    io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', data);
  });

  socket.on('candidate', (data) => {
    io.to(data.target).emit('candidate', data);
  });

  // Remove user from list upon disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('users', users); // Update the user list when someone disconnects
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
