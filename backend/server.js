import { Server } from 'socket.io';
import app from './app.js';
import http from 'http';
import { socketHandler } from './socket.js';
const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);
socketHandler(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});