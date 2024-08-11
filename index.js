const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = {}; // Store user information

io.on('connection', (socket) => {
  socket.on('user-join', (username) => {
    users[socket.id] = username; // Store username with socket ID
    socket.broadcast.emit('user-joined', username); // Notify other clients
  });

  socket.on('user-message', (message) => {
    const username = users[socket.id];
    io.emit('message', { message, username });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user-left', username); // Notify other clients
  });
});

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
  return res.sendFile('/public/index.html');
});

server.listen(9000, () => console.log('Server Started at PORT:9000'));
