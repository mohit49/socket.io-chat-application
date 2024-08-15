const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (code) => {
    socket.join(code);
    console.log(`Client joined room: ${code}`);
    io.to(code).emit('message', 'A new user has joined the room');
  });

  socket.on('chatMessage', ({ code, message }) => {
    io.to(code).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(express.static(path.join(__dirname, 'pages')));
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
